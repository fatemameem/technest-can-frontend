'use client';
import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import Link from 'next/link';
import PodcastCard, { PodcastEpisode } from '../cards/PodcastCard';
interface PodcastsSectionProps {
    podcasts: {
        id: any;
        title: any;
        date: any;
        path: any;
        linkedin: any;
        instagram: any;
        facebook: any;
        thumbnailUrl: any;
    }[];
    title: string;
    badge?: string;
    description?: string;
    showAllBtn: boolean;
}
const PodcastsSection: React.FC<PodcastsSectionProps> = ({ podcasts, title, badge, description, showAllBtn }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const checkScrollButtons = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setCanScrollLeft(scrollLeft > 5);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
        }
    };
    
    useEffect(() => {
        setTimeout(checkScrollButtons, 100);
        const scrollContainer = scrollContainerRef.current;
        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', checkScrollButtons, { passive: true });
        }
        window.addEventListener('resize', checkScrollButtons, { passive: true });
        return () => {
            if (scrollContainer) {
                scrollContainer.removeEventListener('scroll', checkScrollButtons);
            }
            window.removeEventListener('resize', checkScrollButtons);
        };
    }, [podcasts]);


    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = scrollContainerRef.current.clientWidth;
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };
    
    return (
        <section className="bg-slate-900 rounded-3xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-12 lg:p-16">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
                    <div>
                        {badge ? (
                            <Badge variant="default" className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300 font-poppins">
                                {badge}
                            </Badge>
                        ) : null}
                        <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
                            {title}
                        </h2>
                        {description ? (
                            <p className="mt-4 max-w-2xl text-lg text-slate-700 dark:text-slate-300 font-poppins">
                                {description}
                            </p>
                        ) : null}
                    </div>
                    <div className="flex-shrink-0 flex items-center gap-4">
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={() => scroll('left')}
                                disabled={!canScrollLeft}
                                aria-label="Scroll left"
                                className="grid h-12 w-12 place-items-center rounded-full border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 transition-colors enabled:hover:bg-slate-100 enabled:dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft className="h-6 w-6" />
                            </button>
                            <button 
                                onClick={() => scroll('right')}
                                disabled={!canScrollRight}
                                aria-label="Scroll right"
                                className="grid h-12 w-12 place-items-center rounded-full border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 transition-colors enabled:hover:bg-slate-100 enabled:dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronRight className="h-6 w-6" />
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    ref={scrollContainerRef}
                    className="grid grid-flow-col auto-cols-[80%] sm:auto-cols-[45%] md:auto-cols-[calc((100%-1.5rem)/2)] lg:auto-cols-[calc((100%-3rem)/3)] gap-6 overflow-x-auto pb-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                    >
                    {podcasts && podcasts.length > 0 ? (
                        podcasts.map((p) => {
                            const platforms: NonNullable<PodcastEpisode["platforms"]> = [
                            p.linkedin ? { name: "LinkedIn", url: p.linkedin } : null,
                            p.facebook ? { name: "Facebook", url: p.facebook } : null,
                            p.instagram ? { name: "Instagram", url: p.instagram } : null,
                            ].filter(Boolean) as any;
                    
                            return (
                            <PodcastCard
                                key={p.id}
                                podcast={{
                                id: p.id,
                                title: p.title,
                                date: p.date,
                                platforms,
                                // TODO: when a dedicated episode page exists, pass its href. For now, generic:
                                href: p.path,
                                embedUrl: undefined,
                                summary: "",
                                thumbnailUrl: p.thumbnailUrl ?? "https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080",
                                bgColor: 'bg-slate-900',
                                }}
                            />
                            );
                        })
                        ) : (
                        Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="aspect-[3/4] rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
                        ))
                    )}
                </div>
                {showAllBtn ? (
                    <div className="text-center mt-8">
                        <Button asChild className="btn-primary font-poppins">
                            <Link href="/podcasts">View All Episodes</Link>
                        </Button>
                    </div>
                ) : null}
            </div>
        </section>
    );
};

export default PodcastsSection;
