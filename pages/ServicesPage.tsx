import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, FileText, Mail, Users } from 'lucide-react';
import { usePageTitle } from '../hooks/usePageTitle';
import Container from '../components/Container';
import Section from '../components/Section';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ServiceType } from '../types';

const services = [
  {
    type: 'consultancy' as ServiceType,
    title: 'Consultancy',
    description: 'Expert guidance to help your organization build a resilient cybersecurity posture. We offer risk assessments, policy development, and incident response planning.',
    icon: <Briefcase className="h-10 w-10 text-blue-700 dark:text-blue-600" />,
  },
  {
    type: 'content' as ServiceType,
    title: 'Content Creation',
    description: 'Engaging and accessible articles, videos, and educational materials to inform your audience on digital safety and AI ethics.',
    icon: <FileText className="h-10 w-10 text-blue-700 dark:text-blue-600" />,
  },
  {
    type: 'newsletter' as ServiceType,
    title: 'Custom Newsletters',
    description: 'A curated source of cybersecurity news, threat intelligence, and practical tips, tailored for your community or organization.',
    icon: <Mail className="h-10 w-10 text-blue-700 dark:text-blue-600" />,
  },
  {
    type: 'training' as ServiceType,
    title: 'Training & Workshops',
    description: 'Interactive and hands-on training sessions for teams of all sizes. Topics range from phishing awareness to secure coding practices.',
    icon: <Users className="h-10 w-10 text-blue-700 dark:text-blue-600" />,
  },
];

const ServicesPage: React.FC = () => {
  usePageTitle('Our Services');
  const navigate = useNavigate();

  return (
    <>
      <Section className="bg-slate-100 dark:bg-slate-900">
        <Container className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl md:text-6xl">Our Services</h1>
          <p className="mt-6 max-w-3xl mx-auto text-lg text-slate-700 dark:text-slate-300">
            We provide tailored solutions to empower individuals and organizations in the digital age.
          </p>
        </Container>
      </Section>
      <Section>
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service) => (
              <Card key={service.type} className="flex flex-col">
                <CardHeader className="flex-row gap-4 items-center">
                  {service.icon}
                  <CardTitle>{service.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-slate-700 dark:text-slate-300">{service.description}</p>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="primary"
                    onClick={() => navigate(`/contact?service=${service.type}`)}
                  >
                    Request this service
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
};

export default ServicesPage;