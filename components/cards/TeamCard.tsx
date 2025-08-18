import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Linkedin, Twitter, Github, ExternalLink } from 'lucide-react';

interface TeamCardProps {
  member: {
    id: string;
    name: string;
    role: string;
    bio: string;
    image: string;
    social: {
      linkedin?: string;
      twitter?: string;
      github?: string;
    };
  };
}

export function TeamCard({ member }: TeamCardProps) {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Card className="surface hover-lift">
      <CardContent className="p-6 text-center">
        <Avatar className="w-24 h-24 mx-auto mb-4">
          <AvatarImage src={member.image} alt={member.name} />
          <AvatarFallback className="text-lg font-semibold bg-blue-600">
            {getInitials(member.name)}
          </AvatarFallback>
        </Avatar>
        
        <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
        <p className="text-cyan-400 font-medium mb-3">{member.role}</p>
        <p className="text-slate-300 text-sm mb-6 leading-relaxed">{member.bio}</p>
        
        <div className="flex justify-center gap-2">
          {member.social.linkedin && (
            <Button variant="ghost" size="icon" className="h-8 w-8 focus-ring" asChild>
              <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer">
                <Linkedin className="h-4 w-4" />
                <span className="sr-only">LinkedIn profile</span>
              </a>
            </Button>
          )}
          {member.social.twitter && (
            <Button variant="ghost" size="icon" className="h-8 w-8 focus-ring" asChild>
              <a href={member.social.twitter} target="_blank" rel="noopener noreferrer">
                <Twitter className="h-4 w-4" />
                <span className="sr-only">Twitter profile</span>
              </a>
            </Button>
          )}
          {member.social.github && (
            <Button variant="ghost" size="icon" className="h-8 w-8 focus-ring" asChild>
              <a href={member.social.github} target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4" />
                <span className="sr-only">GitHub profile</span>
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}