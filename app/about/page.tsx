import { Hero } from '@/components/ui/hero';
import { Section } from '@/components/ui/section';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Users, Target, Lightbulb } from 'lucide-react';

export default function About() {
  return (
    <>
      <Hero
        title="About TECH-NEST"
        subtitle="We are a dedicated team of cybersecurity experts and AI ethics researchers committed to building a safer digital future for everyone."
        imageUrl="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=800&h=600&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      >
        <Button asChild className="btn-primary">
          <Link href="/about/team">
            Meet Our Team
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </Hero>

      <Section>
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-invert prose-lg mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              <div className="text-center p-6 surface rounded-2xl">
                <Target className="h-12 w-12 text-cyan-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Our Mission</h3>
                <p className="text-slate-300">
                  To advance cybersecurity practices and promote ethical AI development through 
                  expert consulting, education, and thought leadership.
                </p>
              </div>
              
              <div className="text-center p-6 surface rounded-2xl">
                <Lightbulb className="h-12 w-12 text-cyan-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Our Vision</h3>
                <p className="text-slate-300">
                  A world where technology serves humanity safely and ethically, with robust 
                  cybersecurity protecting our digital infrastructure and AI systems.
                </p>
              </div>
              
              <div className="text-center p-6 surface rounded-2xl">
                <Users className="h-12 w-12 text-cyan-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Our Impact</h3>
                <p className="text-slate-300">
                  We've helped over 500 organizations strengthen their security posture and 
                  trained thousands of professionals in cybersecurity best practices.
                </p>
              </div>
            </div>

            <div className="text-center space-y-6">
              <h2 className="text-3xl font-bold">Why We Exist</h2>
              <p className="text-xl text-slate-300 leading-relaxed">
                In an increasingly connected world, the intersection of cybersecurity and AI ethics 
                has never been more critical. We bridge the gap between technical expertise and 
                ethical considerations, helping organizations navigate complex security challenges 
                while maintaining responsible AI practices.
              </p>
              <p className="text-lg text-slate-300 leading-relaxed">
                Our team combines decades of experience in cybersecurity, artificial intelligence, 
                and ethics to provide comprehensive solutions that protect both digital assets and 
                human values. From small startups to enterprise corporations, we tailor our approach 
                to meet the unique needs of each client while upholding the highest standards of 
                security and ethics.
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section className="bg-slate-900/50">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-8">Ready to work with us?</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="btn-primary">
              <Link href="/services">View Our Services</Link>
            </Button>
            <Button asChild variant="outline" className="btn-secondary">
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}