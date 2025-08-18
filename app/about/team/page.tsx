import { Hero } from '@/components/ui/hero';
import { Section } from '@/components/ui/section';
import { TeamCard } from '@/components/cards/TeamCard';
import sampleData from '@/data/sample.json';

export default function Team() {
  return (
    <>
      <Hero
        title="Our Team"
        subtitle="Meet the experts behind TECH-NEST's cybersecurity and AI ethics initiatives."
      />

      <Section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sampleData.team.map((member) => (
            <TeamCard key={member.id} member={member} />
          ))}
        </div>
      </Section>
    </>
  );
}