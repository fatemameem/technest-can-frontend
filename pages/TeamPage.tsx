import React, { useState, useEffect } from 'react';
import { Linkedin, Twitter } from 'lucide-react';
import { usePageTitle } from '../hooks/usePageTitle';
import Container from '../components/Container';
import Section from '../components/Section';
import { Card } from '../components/ui/Card';
import { TeamMember } from '../types';

const TeamCard: React.FC<{ member: TeamMember }> = ({ member }) => (
  <Card className="text-center p-6">
    <img
      src={member.avatarUrl}
      alt={`Portrait of ${member.name}`}
      className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
    />
    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{member.name}</h3>
    <p className="text-blue-700 dark:text-blue-500 font-semibold">{member.role}</p>
    <p className="mt-4 text-slate-700 dark:text-slate-300 text-sm">{member.bio}</p>
    {member.socials && (
      <div className="mt-4 flex justify-center space-x-4">
        {member.socials.map((social) => (
          <a key={social.platform} href={social.url} className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-500" aria-label={social.platform}>
            {social.platform === 'LinkedIn' && <Linkedin size={20} />}
            {social.platform === 'Twitter' && <Twitter size={20} />}
          </a>
        ))}
      </div>
    )}
  </Card>
);

const TeamPage: React.FC = () => {
  usePageTitle('Our Team');
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTeam = async () => {
      try {
        setLoading(true);
        const response = await fetch('/data/team.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setTeam(data);
      } catch (error) {
        console.error("Failed to load team data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadTeam();
  }, []);

  return (
    <>
      <Section className="bg-slate-100 dark:bg-slate-900">
        <Container className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl md:text-6xl">Meet Our Team</h1>
          <p className="mt-6 max-w-3xl mx-auto text-lg text-slate-700 dark:text-slate-300">
            The passionate individuals dedicated to building a safer digital future.
          </p>
        </Container>
      </Section>
      <Section>
        <Container>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="p-6 dark:bg-slate-900">
                  <div className="w-32 h-32 rounded-full mx-auto mb-4 bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
                  <div className="h-6 w-3/4 mx-auto bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
                  <div className="h-4 w-1/2 mx-auto mt-2 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
                  <div className="mt-4 space-y-2">
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
                    <div className="h-4 w-5/6 mx-auto bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {team.map((member) => (
                <TeamCard key={member.id} member={member} />
              ))}
            </div>
          )}
        </Container>
      </Section>
    </>
  );
};

export default TeamPage;