import React from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';

import { usePageTitle } from '../hooks/usePageTitle';
import Container from '../components/Container';
import Section from '../components/Section';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const SubscribePage: React.FC = () => {
  usePageTitle('Subscribe');

  return (
    <Section>
      <Container className="text-center">
        <Mail className="mx-auto h-16 w-16 text-amber-500" />
        <h1 className="mt-8 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl">Subscribe: Coming Soon!</h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg text-slate-700 dark:text-slate-300">
          We're putting the final touches on our newsletter and subscription service. It will be packed with valuable insights, event announcements, and cybersecurity tips.
        </p>
        <p className="mt-2 max-w-2xl mx-auto text-lg text-slate-700 dark:text-slate-300">
          Sign up will be available shortly. For now, feel free to <Link to="/contact" className="text-blue-700 dark:text-blue-500 hover:underline font-semibold">contact us</Link> with any inquiries.
        </p>
        <div className="mt-10 max-w-md mx-auto">
          <div className="flex gap-4">
            <Input type="email" placeholder="your.email@example.com" disabled />
            <Button disabled>Notify Me</Button>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Sign-up form is currently disabled.</p>
        </div>
      </Container>
    </Section>
  );
};

export default SubscribePage;