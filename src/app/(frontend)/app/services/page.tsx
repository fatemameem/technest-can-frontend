import { Hero } from '@/components/ui/hero';
import { Section } from '@/components/ui/section';
import { ServiceCard } from '@/components/cards/ServiceCard';
import sampleData from '@/data/sample.json';

export default function Services() {
  return (
    <>
      <Hero
        title="Our Services"
        subtitle="Comprehensive cybersecurity solutions and AI ethics guidance tailored to your organization's needs."
        imageUrl='/images/services.jpeg'
      />

      <Section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sampleData.services.map((service) => (
            <div key={service.id} className="max-w-xl">
              <ServiceCard service={{ ...service, icon: service.icon as "shield-check" | "file-text" | "mail" | "graduation-cap" }} />
            </div>
          ))}
        </div>
      </Section>

      <Section className="bg-slate-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Need a Custom Solution?</h2>
          <p className="text-lg text-slate-300 mb-8">
            We understand that every organization has unique cybersecurity and AI ethics challenges. 
            Our team works closely with you to develop customized solutions that meet your specific needs.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 surface rounded-2xl">
              <h3 className="font-semibold mb-2">Assessment</h3>
              <p className="text-slate-400 text-sm">
                Comprehensive evaluation of your current security posture and AI implementations.
              </p>
            </div>
            <div className="p-6 surface rounded-2xl">
              <h3 className="font-semibold mb-2">Strategy</h3>
              <p className="text-slate-400 text-sm">
                Customized roadmap for improving security and implementing ethical AI practices.
              </p>
            </div>
            <div className="p-6 surface rounded-2xl">
              <h3 className="font-semibold mb-2">Implementation</h3>
              <p className="text-slate-400 text-sm">
                Hands-on support and guidance throughout the implementation process.
              </p>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}