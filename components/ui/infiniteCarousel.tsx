'use client';
import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { Observer } from 'gsap/Observer';
import { ParticleCard } from './particleCard';

gsap.registerPlugin(Observer);

interface InfiniteScrollItem {
  content: React.ReactNode;
}

interface InfiniteScrollProps {
  width?: string;
  height?: string;
  maxHeight?: string;
  negativeMargin?: string;
  items?: InfiniteScrollItem[];
  itemMinHeight?: number;
  itemMinWidth?: number;
  isTilted?: boolean;
  tiltDirection?: 'left' | 'right';
  autoplay?: boolean;
  autoplaySpeed?: number;
  autoplayDirection?: 'down' | 'up' | 'left' | 'right';
  pauseOnHover?: boolean;
  direction?: 'vertical' | 'horizontal';
  fullScreenWidth?: boolean;
  autoplayOnView?: boolean;
}

const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  width = 'full',
  height = 'auto',
  maxHeight = '100%',
  negativeMargin = '-1.9em',
  items = [],
  itemMinHeight = 150,
  itemMinWidth = 200,
  isTilted = false,
  tiltDirection = 'left',
  autoplay = true,
  autoplaySpeed = 0.5,
  autoplayDirection = 'down',
  pauseOnHover = false,
  direction = 'vertical',
  fullScreenWidth = true,
  autoplayOnView = true
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  const getTiltTransform = (): string => {
    if (!isTilted) return 'none';
    if (direction === 'horizontal') {
      return tiltDirection === 'left'
        ? 'rotateY(20deg) rotateZ(-10deg) skewY(10deg)'
        : 'rotateY(-20deg) rotateZ(10deg) skewY(-10deg)';
    }
    return tiltDirection === 'left'
      ? 'rotateX(20deg) rotateZ(-20deg) skewX(20deg)'
      : 'rotateX(20deg) rotateZ(20deg) skewX(-20deg)';
  };

  // Intersection Observer for autoplay on view
  useEffect(() => {
    if (!autoplayOnView) {
      setIsInView(true);
      return;
    }

    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      {
        threshold: 0.1, // Start when 10% visible
        rootMargin: '50px' // Start 50px before entering viewport
      }
    );

    observer.observe(wrapper);

    return () => {
      observer.disconnect();
    };
  }, [autoplayOnView]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (items.length === 0) return;

    const divItems = gsap.utils.toArray<HTMLDivElement>(container.children);
    if (!divItems.length) return;

    const firstItem = divItems[0];
    const itemStyle = getComputedStyle(firstItem);
    
    let itemSize: number;
    let itemMargin: number;
    let totalItemSize: number;
    let totalSize: number;
    let positionProperty: 'x' | 'y';

    if (direction === 'horizontal') {
      const itemWidth = firstItem.offsetWidth;
      const itemMarginLeft = parseFloat(itemStyle.marginLeft) || 0;
      itemSize = itemWidth;
      itemMargin = itemMarginLeft;
      totalItemSize = itemWidth + itemMarginLeft;
      totalSize = itemWidth * items.length + itemMarginLeft * (items.length - 1);
      positionProperty = 'x';
    } else {
      const itemHeight = firstItem.offsetHeight;
      const itemMarginTop = parseFloat(itemStyle.marginTop) || 0;
      itemSize = itemHeight;
      itemMargin = itemMarginTop;
      totalItemSize = itemHeight + itemMarginTop;
      totalSize = itemHeight * items.length + itemMarginTop * (items.length - 1);
      positionProperty = 'y';
    }

    const wrapFn = gsap.utils.wrap(-totalSize, totalSize);

    // Set initial positions
    divItems.forEach((child, i) => {
      const position = i * totalItemSize;
      gsap.set(child, { [positionProperty]: position });
    });

    const observer = Observer.create({
      target: container,
      type: 'wheel,touch,pointer',
      preventDefault: true,
      onPress: ({ target }) => {
        (target as HTMLElement).style.cursor = 'grabbing';
      },
      onRelease: ({ target }) => {
        (target as HTMLElement).style.cursor = 'grab';
      },
      onChange: ({ deltaY, deltaX, isDragging, event }) => {
        let delta: number;
        
        if (direction === 'horizontal') {
          // For horizontal scrolling, use deltaX for touch/pointer and deltaY for wheel
          delta = event.type === 'wheel' ? -deltaY : deltaX;
        } else {
          // For vertical scrolling, use deltaY
          delta = event.type === 'wheel' ? -deltaY : deltaY;
        }
        
        const distance = isDragging ? delta * 5 : delta * 10;
        
        divItems.forEach(child => {
          gsap.to(child, {
            duration: 0.5,
            ease: 'expo.out',
            [positionProperty]: `+=${distance}`,
            modifiers: {
              [positionProperty]: gsap.utils.unitize(wrapFn)
            }
          });
        });
      }
    });

    let rafId: number;
    
    // Only autoplay if autoplay is enabled, component is in view (or autoplayOnView is disabled), and isInView is true
    const shouldAutoplay = autoplay && isInView;
    
    if (shouldAutoplay) {
      let directionFactor: number;
      
      if (direction === 'horizontal') {
        directionFactor = autoplayDirection === 'right' ? 1 : -1;
      } else {
        directionFactor = autoplayDirection === 'down' ? 1 : -1;
      }
      
      const speedPerFrame = autoplaySpeed * directionFactor;

      const tick = () => {
        if (!isInView && autoplayOnView) {
          rafId = requestAnimationFrame(tick);
          return;
        }

        divItems.forEach(child => {
          gsap.set(child, {
            [positionProperty]: `+=${speedPerFrame}`,
            modifiers: {
              [positionProperty]: gsap.utils.unitize(wrapFn)
            }
          });
        });
        rafId = requestAnimationFrame(tick);
      };

      rafId = requestAnimationFrame(tick);

      if (pauseOnHover) {
        const stopTicker = () => rafId && cancelAnimationFrame(rafId);
        const startTicker = () => {
          if (isInView || !autoplayOnView) {
            rafId = requestAnimationFrame(tick);
          }
        };

        container.addEventListener('mouseenter', stopTicker);
        container.addEventListener('mouseleave', startTicker);

        return () => {
          observer.kill();
          stopTicker();
          container.removeEventListener('mouseenter', stopTicker);
          container.removeEventListener('mouseleave', startTicker);
        };
      } else {
        return () => {
          observer.kill();
          rafId && cancelAnimationFrame(rafId);
        };
      }
    }

    return () => {
      observer.kill();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [items, autoplay, autoplaySpeed, autoplayDirection, pauseOnHover, isTilted, tiltDirection, negativeMargin, direction, isInView, autoplayOnView]);

  const getContainerStyles = () => {
    const containerWidth = fullScreenWidth ? '100vw' : width;
    
    if (direction === 'horizontal') {
      return {
        display: 'flex',
        flexDirection: 'row' as const,
        height: height,
        width: 'max-content',
        transform: getTiltTransform()
      };
    }
    return {
      width: containerWidth,
      transform: getTiltTransform()
    };
  };

  const getWrapperStyles = () => {
    const wrapperWidth = fullScreenWidth ? '100vw' : width;
    
    if (direction === 'horizontal') {
      return {
        maxHeight: maxHeight,
        width: wrapperWidth,
        height: height,
        overflow: 'hidden'
      };
    }
    return {
      maxHeight: maxHeight,
      width: wrapperWidth,
      overflow: 'hidden'
    };
  };

  const containerWidth = fullScreenWidth ? '100vw' : width;

  return (
    <>
      <style>
        {`
          .infinite-scroll-wrapper {
            ${direction === 'vertical' ? `
              max-height: ${maxHeight};
              width: ${containerWidth};
              overflow: hidden;
            ` : `
              max-height: ${maxHeight};
              width: ${containerWidth};
              height: ${height};
              overflow: hidden;
            `}
          }

          .infinite-scroll-container {
            ${direction === 'vertical' ? `
              width: ${containerWidth};
            ` : `
              display: flex;
              flex-direction: row;
              height: ${height};
              width: max-content;
            `}
          }

          .infinite-scroll-item {
            ${direction === 'vertical' ? `
              height: ${itemMinHeight}px;
              margin-top: ${negativeMargin};
              width: 100%;
            ` : `
              width: ${itemMinWidth}px;
              height: 100%;
              margin-left: ${negativeMargin};
              flex-shrink: 0;
            `}
          }
        `}
      </style>

      <div 
        className="infinite-scroll-wrapper" 
        ref={wrapperRef}
        style={getWrapperStyles()}
      >
        <div
          className="infinite-scroll-container"
          ref={containerRef}
          style={getContainerStyles()}
        >
          {items.map((item, i) => (
            <div className="infinite-scroll-item" key={i}>
              <ParticleCard 
                className="min-h-[100px] min-w-[200px] border border-solid rounded-[20px] p-4 transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(0,0,0,0.15)]"
                enableBorderGlow={true}
                enableTilt={false}
                clickEffect={true}
                enableMagnetism={false}
                particleCount={12}
                glowColor="87, 238, 255"
              >
                {item.content}
              </ParticleCard>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default InfiniteScroll;
