
import React from 'react';
import { useAppContext } from '../context/AppContext.js';
import Container from '../components/Container.js';
import Section from '../components/Section.js';
import PageHeader from '../components/PageHeader.js';
import TeamCard from '../components/TeamCard.js';

const Team = () => {
    const { team, loading, error } = useAppContext();

    return (
        <Section>
            <Container>
                <PageHeader
                    title="Our Team"
                    subtitle="Meet the passionate individuals driving the mission of TECH-NEST forward."
                />
                <div className="mt-12">
                    {loading && <p className="text-center">Loading team members...</p>}
                    {error && <p className="text-center text-dark-danger">Error loading team members: {error.message}</p>}
                    {!loading && !error && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {team.map((member) => (
                                <TeamCard key={member.id} member={member} />
                            ))}
                        </div>
                    )}
                </div>
            </Container>
        </Section>
    );
};

export default Team;