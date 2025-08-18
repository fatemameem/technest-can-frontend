
import React from 'react';
import { TeamMember } from '../types.js';
import { Card, CardContent, CardHeader } from './ui/Card.js';
import { Linkedin, Twitter, Github } from './icons.js';

interface TeamCardProps {
    member: TeamMember;
}

const SocialIcon = ({ platform }: { platform: string }) => {
    switch(platform) {
        case 'linkedin': return <Linkedin className="w-5 h-5" />;
        case 'twitter': return <Twitter className="w-5 h-5" />;
        case 'github': return <Github className="w-5 h-5" />;
        default: return null;
    }
};

const TeamCard = ({ member }: TeamCardProps) => {
    return (
        <Card className="text-center">
            <CardHeader className="items-center">
                <img
                    className="w-24 h-24 rounded-full"
                    src={member.avatarUrl || `https://ui-avatars.com/api/?name=${member.name.replace(' ', '+')}&background=2563EB&color=F1F5F9&size=128`}
                    alt={member.name}
                />
            </CardHeader>
            <CardContent>
                <h3 className="text-lg font-semibold text-dark-text-primary">{member.name}</h3>
                <p className="text-dark-primary font-medium">{member.role}</p>
                <p className="mt-2 text-sm text-dark-text-secondary">{member.bio}</p>
                {member.socials && (
                    <div className="mt-4 flex justify-center space-x-3">
                        {member.socials.map((social) => (
                            <a key={social.platform} href={social.url} target="_blank" rel="noopener noreferrer" className="text-dark-meta hover:text-dark-accent">
                                <span className="sr-only">{social.platform}</span>
                                <SocialIcon platform={social.platform} />
                            </a>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default TeamCard;