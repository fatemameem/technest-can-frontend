
import React from 'react';
import Container from '../components/Container.js';
import Section from '../components/Section.js';
import PageHeader from '../components/PageHeader.js';
import { Card } from '../components/ui/Card.js';
import { Badge } from '../components/ui/Badge.js';

const Videos = () => {
    return (
        <Section>
            <Container>
                <PageHeader
                    title="Video Tutorials"
                    subtitle="A library of educational videos is on its way. Stay tuned for practical guides and expert interviews."
                />
                
                <div className="mt-8 flex justify-center items-center gap-4 opacity-50 cursor-not-allowed">
                    <input 
                        type="search" 
                        placeholder="Search videos..."
                        disabled
                        className="w-full max-w-sm bg-slate-800 border-slate-600 rounded-md p-2"
                    />
                    <select disabled className="bg-slate-800 border-slate-600 rounded-md p-2">
                        <option>All Categories</option>
                    </select>
                </div>

                <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <Card key={index} className="relative">
                            <div className="aspect-video bg-dark-surface rounded-t-2xl flex items-center justify-center">
                                <p className="text-dark-meta">Video Placeholder</p>
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-dark-text-secondary">Video Title Coming Soon</h3>
                                <p className="text-sm text-dark-meta mt-1">A brief description of the video content will appear here.</p>
                            </div>
                             <Badge className="absolute top-4 left-4">Coming Soon</Badge>
                        </Card>
                    ))}
                </div>
            </Container>
        </Section>
    );
};

export default Videos;