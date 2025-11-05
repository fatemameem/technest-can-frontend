import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Linkedin, Twitter, Github, ExternalLink, Mail } from 'lucide-react';

interface TeamCardProps {
  member: {
  id: string | number;
  name: string;
  role?: string;
  bio?: string;
  imageUrl?: string;
  linkedin?: string;
  twitter?: string;
  github?: string;
  email?: string;
  website?: string;
  [key: string]: any; // allow extra fields from Sheets without breaking
  };
}

export function TeamCard({ member }: TeamCardProps) {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };
  // {console.log(member.imageUrl)}

  return (
    <Card className="surface hover-lift">
      <CardContent className="p-6 text-center">
        <Avatar className="w-48 h-48 mx-auto mb-4">
          <AvatarImage src={member.imageUrl} alt={member.name} />
          <AvatarFallback className="text-lg font-semibold bg-blue-600">
            {getInitials(member.name)}
          </AvatarFallback>
        </Avatar>
        
        <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
        {/* <p className="text-cyan-400 font-medium mb-3">{member.role}</p> */}
        <p className="text-slate-300 text-sm mb-6 leading-relaxed overflow-auto line-clamp-6">{member.bio}</p>
        
        <div className="flex justify-center gap-2">
          {member.linkedin && (
            <Button variant="ghost" size="icon" className="h-8 w-8 focus-ring" asChild>
              <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                <Linkedin className="h-4 w-4" />
                <span className="sr-only">LinkedIn profile</span>
              </a>
            </Button>
          )}
          {member.email && (
            <Button variant="ghost" size="icon" className="h-8 w-8 focus-ring" asChild>
              <a href={`mailto:${member.email}`} target="_blank" rel="noopener noreferrer">
                <Mail className="h-4 w-4" />
                <span className="sr-only">Mail</span>
              </a>
            </Button>
          )}
          {member.twitter && (
            <Button variant="ghost" size="icon" className="h-8 w-8 focus-ring" asChild>
              <a href={member.twitter} target="_blank" rel="noopener noreferrer">
                <Twitter className="h-4 w-4" />
                <span className="sr-only">Twitter profile</span>
              </a>
            </Button>
          )}
          {member.github && (
            <Button variant="ghost" size="icon" className="h-8 w-8 focus-ring" asChild>
              <a href={member.github} target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4" />
                <span className="sr-only">GitHub profile</span>
              </a>
            </Button>
          )}
          {member.website && (
            <Button variant="ghost" size="icon" className="h-8 w-8 focus-ring" asChild>
              <a href={member.website} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
                <span className="sr-only">Website</span>
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}