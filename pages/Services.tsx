
import React from 'react';
import Container from '../components/Container.js';
import Section from '../components/Section.js';
import PageHeader from '../components/PageHeader.js';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/Card.js';
import { ButtonLink } from '../components/ui/Button.js';

const services = [
  { 
    title: 'Consultancy', 
    description: 'We provide expert guidance and strategic advice to help your organization navigate the complexities of cybersecurity and AI ethics. Our consultants work with you to develop robust security postures and responsible AI frameworks.',
    link: '/contact?service=consultancy'
  },
  { 
    title: 'Content Creation', 
    description: 'Our team creates high-quality, accessible content—from articles and whitepapers to videos and infographics—designed to educate and inform your audience on critical digital safety topics.',
    link: '/contact?service=content'
  },
  { 
    title: 'Newsletter Services', 
    description: 'Stay ahead of the curve with our curated newsletter. We deliver the latest news, insights, and practical tips on cybersecurity and AI ethics directly to your subscribers\' inboxes.',
    link: '/contact?service=newsletter'
  },
  { 
    title: 'Training & Workshops', 
    description: 'Empower your team with our interactive and engaging training sessions. We offer hands-on workshops tailored to different skill levels, covering everything from basic cyber hygiene to advanced threat analysis.',
    link: '/contact?service=training'
  },
];


const Services = () => {
    return (
        <Section>
            <Container>
                <PageHeader
                    title="Our Services"
                    subtitle="We offer a suite of services designed to build a safer and more informed digital community."
                />
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {services.map((service) => (
                        <Card key={service.title} className="flex flex-col">
                            <CardHeader>
                                <CardTitle>{service.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <CardDescription className="text-base text-dark-text-secondary">{service.description}</CardDescription>
                            </CardContent>
                            <CardFooter>
                                <ButtonLink to={service.link}>Request this service</ButtonLink>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </Container>
        </Section>
    );
};

export default Services;