import React from 'react';
import { Link } from 'react-router-dom';
import { usePageTitle } from '../hooks/usePageTitle';
import Container from '../components/Container';
import Section from '../components/Section';
import { Button } from '../components/ui/Button';

const AboutPage: React.FC = () => {
  usePageTitle('About Us');

  return (
    <>
      <div className="relative bg-slate-900">
        <div aria-hidden="true" className="absolute inset-0">
            <img 
                src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1974&auto=format&fit=crop" 
                alt="Diverse team collaborating"
                className="h-full w-full object-cover object-center"
            />
        </div>
        <div aria-hidden="true" className="absolute inset-0 bg-slate-900 bg-opacity-70" />
        <Section className="relative bg-transparent py-20 sm:py-24">
            <Container className="text-center">
                <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">About TECH-NEST</h1>
                <p className="mt-6 max-w-3xl mx-auto text-lg text-slate-200">
                    Making cyber safety and AI ethics accessible, practical, and actionable for all.
                </p>
            </Container>
        </Section>
      </div>
      <Section>
        <Container>
          <div className="max-w-4xl mx-auto prose prose-lg prose-slate dark:prose-invert prose-a:text-blue-700 hover:prose-a:text-blue-600 dark:prose-a:text-blue-500 dark:hover:prose-a:text-blue-400">
            <h2>Our Mission & Context</h2>
            <p>
              In a world where our daily lives, finances, communities, and even democracies are intricately connected to digital technologies, the risks of cyber threats and unethical uses of artificial intelligence grow every day. Ransomware, misinformation, deepfakes, and privacy violations are not just headlines—they touch schoolchildren, families, seniors, small businesses, and communities everywhere.
            </p>
            <p>
              We are dedicated to empowering people everywhere to respond confidently to digital change. Our mission is to make cyber safety and AI ethics accessible, practical, and actionable for all members of society, regardless of background, age, or technical expertise.
            </p>
            <p>
              Through education, outreach, hands-on engagement, and real-world storytelling, we help individuals and organizations identify cyber risks, protect their digital lives, and make informed decisions about technology. We strive to close gaps in knowledge and access—especially for those who are often left out of digital transformation—so that every person can benefit from a safer, fairer, and more inclusive digital future.
            </p>
            
            <h2>Our Vision</h2>
            <p>
              We envision a society where every individual is equipped with the skills, mindset, and opportunities needed to safely navigate, question, and shape the digital world. We are building resources, support systems, and partnerships that extend far beyond a single organization or campus—moving toward a future where cybersafety and AI responsibility are woven into the fabric of everyday life, for everyone.
            </p>

            <h2>Our Impact</h2>
            <p>
              Since our inception, TECH-NEST has delivered interactive programs and public awareness campaigns reaching hundreds of participants from all walks of life. Our outreach spans schools, community centers, family events, and workplaces—and features expert guests from a variety of backgrounds, ensuring relatable and culturally responsive programming. By prioritizing representation and inclusion—especially of women, racialized groups, and underrepresented voices—we help ensure the digital transformation is one that uplifts everyone, not just a few.
            </p>
            
            <div className="not-prose mt-12 text-center">
              <Button as={Link} to="/about/team" size="lg">Meet Our Team</Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
};

export default AboutPage;