
import React from 'react';
import { PodcastEpisode } from '../types.js';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/Card.js';
import { Youtube, Spotify, Apple } from './icons.js';
import { formatDate } from '../lib/utils.js';

interface PodcastCardProps {
    podcast: PodcastEpisode;
}

const PlatformIcon = ({ name }: { name: string }) => {
    switch (name) {
        case 'YouTube': return <Youtube className="w-5 h-5" />;
        case 'Spotify': return <Spotify className="w-5 h-5" />;
        case 'Apple': return <Apple className="w-5 h-5" />;
        default: return null;
    }
};

const PodcastCard = ({ podcast }: PodcastCardProps) => {
    return (
        <Card className="flex flex-col">
            {podcast.embedUrl && (
                <div className="aspect-video">
                    <iframe
                        src={podcast.embedUrl}
                        title={`Embedded player for ${podcast.title}`}
                        className="w-full h-full rounded-t-2xl"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            )}
            <CardHeader>
                <CardTitle>{podcast.title}</CardTitle>
                <CardDescription>{formatDate(podcast.date)}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                <p className="text-sm text-dark-text-secondary">{podcast.summary}</p>
                <div className="mt-4 flex items-center gap-4">
                    <p className="text-sm font-semibold">Listen on:</p>
                    <div className="flex gap-3">
                        {podcast.platforms.map(platform => (
                            <a 
                                key={platform.name} 
                                href={platform.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-dark-meta hover:text-dark-accent"
                                aria-label={`Listen on ${platform.name}`}
                            >
                                <PlatformIcon name={platform.name} />
                            </a>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default PodcastCard;