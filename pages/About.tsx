
import React from 'react';
import Container from '../components/Container.js';
import Section from '../components/Section.js';
import PageHeader from '../components/PageHeader.js';
import { ButtonLink } from '../components/ui/Button.js';

const About = () => {
    return (
        <>
            <Section>
                <Container>
                    <PageHeader 
                        title="About TECH-NEST"
                        subtitle="We are dedicated to empowering people everywhere to respond confidently to digital change."
                    />
                </Container>
            </Section>

            <Section className="bg-dark-surface">
                <Container>
                    <div className="max-w-4xl mx-auto prose prose-invert prose-lg text-dark-text-secondary">
                        <h2 className="text-dark-text-primary">Mission & Context</h2>
                        <p>
                            In a world where our daily lives, finances, communities, and even democracies are intricately connected to digital technologies, the risks of cyber threats and unethical uses of artificial intelligence grow every day. Ransomware, misinformation, deepfakes, and privacy violations are not just headlines—they touch schoolchildren, families, seniors, small businesses, and communities everywhere.
                        </p>
                        <p>
                            We are dedicated to empowering people everywhere to respond confidently to digital change. Our mission is to make cyber safety and AI ethics accessible, practical, and actionable for all members of society, regardless of background, age, or technical expertise.
                        </p>
                        <p>
                            Through education, outreach, hands-on engagement, and real-world storytelling, we help individuals and organizations identify cyber risks, protect their digital lives, and make informed decisions about technology. We strive to close gaps in knowledge and access—especially for those who are often left out of digital transformation—so that every person can benefit from a safer, fairer, and more inclusive digital future.
                        </p>
                        
                        <h2 className="text-dark-text-primary">Our Vision</h2>
                        <p>
                            We envision a society where every individual is equipped with the skills, mindset, and opportunities needed to safely navigate, question, and shape the digital world. We are building resources, support systems, and partnerships that extend far beyond a single organization or campus—moving toward a future where cybersafety and AI responsibility are woven into the fabric of everyday life, for everyone.
                        </p>
                        
                        <h2 className="text-dark-text-primary">Our Impact</h2>
                        <p>
                            Since our inception, TECH-NEST has delivered interactive programs and public awareness campaigns reaching hundreds of participants from all walks of life. Our outreach spans schools, community centers, family events, and workplaces—and features expert guests from a variety of backgrounds, ensuring relatable and culturally responsive programming.
                        </p>
                        <p>
                            By prioritizing representation and inclusion—especially of women, racialized groups, and underrepresented voices—we help ensure the digital transformation is one that uplifts everyone, not just a few.
                        </p>
                    </div>
                </Container>
            </Section>
            
            <Section>
                <Container className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-dark-text-primary sm:text-4xl">Meet Our Team</h2>
                    <p className="mt-4 text-lg text-dark-text-secondary max-w-2xl mx-auto">
                        We are a passionate group of educators, technologists, and community builders.
                    </p>
                    <div className="mt-8">
                        <ButtonLink to="/about/team" size="lg">View Team Members</ButtonLink>
                    </div>
                </Container>
            </Section>
        </>
    );
};

export default About;