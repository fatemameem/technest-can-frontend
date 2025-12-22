import { Hero } from '@/components/ui/hero';
import { Section } from '@/components/ui/section';
import { ServiceCard } from '@/components/cards/ServiceCard';
import sampleData from '@/data/sample.json';
import { TechNestCarePopup } from '@/components/promotionals/TechNestCarePopup';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Services() {
  return (
    <>
      <Hero
        title="Our Services"
        subtitle="Comprehensive cybersecurity solutions and AI ethics guidance tailored to your organization's needs."
        imageUrl='/images/services.jpeg'
      />
      {/* Tech-Nest Care Promotional Section */}
      <section className="py-16 px-6 lg:px-12 bg-gradient-to-br from-slate-900 via-cyan-950/20 to-slate-900 border-t border-b border-cyan-500/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="space-y-6 my-24">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full">
                <svg
                  className="w-5 h-5 text-cyan-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <span className="text-cyan-400 text-sm font-medium">
                  Free Trial Until March 31, 2026
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                Protect Your Organization with{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                  Tech-Nest Care
                </span>
              </h2>

              <p className="text-lg text-slate-300 leading-relaxed">
                Our AI-assisted cybersecurity monitoring platform helps your organization 
                detect and respond to threats quickly with real-time alerts and intelligent analysis.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyan-500/10 rounded-lg">
                    <svg
                      className="w-6 h-6 text-cyan-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <span className="text-slate-300">Threat Detection</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyan-500/10 rounded-lg">
                    <svg
                      className="w-6 h-6 text-cyan-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <span className="text-slate-300">Real-Time Alerts</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyan-500/10 rounded-lg">
                    <svg
                      className="w-6 h-6 text-cyan-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <span className="text-slate-300">AI-Powered Security</span>
                </div>
              </div>

              <div className="pt-6">
                <Link href="/contact?subject=Request a demo of Tech-Nest Care">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold px-8 py-6 text-lg shadow-lg shadow-cyan-500/20"
                  >
                    Request Your Free Trial
                    <svg
                      className="w-5 h-5 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </Button>
                </Link>
              </div>
            </div>

            {/* Image Preview - Hidden on mobile */}
            <div className="hidden lg:block h-full">
              <div className="relative h-full rounded-xl overflow-hidden border border-cyan-500/20 shadow-2xl shadow-cyan-500/10">
                <Image
                  src="/images/technest-care.jpeg"
                  alt="Tech-Nest Care Platform Preview"
                  fill
                  className=""
                  sizes="(max-width: 1024px) 0vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <Section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sampleData.services.map((service) => (
            <div key={service.id} className="max-w-xl">
              <ServiceCard service={{ ...service, icon: service.icon as "shield-check" | "file-text" | "mail" | "graduation-cap" }} />
            </div>
          ))}
        </div>
      </Section>

      {/* Tech-Nest Care Promotional Popup */}
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
      <TechNestCarePopup />
    </>
  );
}