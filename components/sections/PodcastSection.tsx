'use client';
import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import Link from 'next/link';
import PodcastCard, { PodcastEpisode } from '../cards/PodcastCard';
import sampleData from '@/data/sample.json';

const PodcastsSection: React.FC = () => {
    const [podcasts, setPodcasts] = useState<PodcastEpisode[]>([]);
    const [loading, setLoading] = useState(true);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const response = await fetch('/data/podcasts.json');
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                setPodcasts(data);
            } catch (error) {
                console.error("Failed to load podcasts:", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const checkScrollButtons = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setCanScrollLeft(scrollLeft > 5);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
        }
    };
    
    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        if (scrollContainer) {
            // Need a slight delay to ensure images are loaded and scrollWidth is accurate
            setTimeout(() => {
                checkScrollButtons();
            }, 100);
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
                        <Badge variant="default" className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300">Listen Now</Badge>
                        <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
                            Latest Podcast Episodes
                        </h2>
                        <p className="mt-4 max-w-2xl text-lg text-slate-700 dark:text-slate-300">
                            Tune in for discussions on the latest in cybersecurity and AI ethics.
                        </p>
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
                    {loading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="aspect-[3/4] rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
                        ))
                    ) : (
                        sampleData.podcasts.map(p => (
                            <PodcastCard
                                key={p.id}
                                podcast={{
                                id: p.id,
                                title: p.title,
                                date: p.date,
                                platforms: p.platform
                                ? [{
                                    name:
                                    p.platform === 'youtube' ? 'YouTube' :
                                    p.platform === 'spotify' ? 'Spotify' :
                                    p.platform === 'apple' ? 'Apple' :
                                    p.platform === 'soundcloud' ? 'SoundCloud' :
                                    'YouTube', // fallback to a valid value
                                    url: '#'
                                }]
                                : [],
                                embedUrl: p.embedId ? `https://www.youtube.com/embed/${p.embedId}` : undefined,
                                summary: p.description,
                                imageUrl: 'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
                                bgColor: 'bg-slate-900',
                                }}
                            />
                        ))
                    )}
                </div>
                <div className="flex justify-center">
                    <Button variant="outline" size="sm">
                        <Link href="/podcasts">View All</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default PodcastsSection;
