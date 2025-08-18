import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Mail, MapPin, Phone, Linkedin, Twitter, Youtube } from 'lucide-react';
import { usePageTitle } from '../hooks/usePageTitle';
import Container from '../components/Container';
import Section from '../components/Section';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { ServiceType } from '../types';

const ContactPage: React.FC = () => {
  usePageTitle('Contact Us');
  const location = useLocation();
  const [subject, setSubject] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const service = params.get('service') as ServiceType | null;
    if (service) {
      const serviceTitle = service.charAt(0).toUpperCase() + service.slice(1);
      setSubject(`Inquiry about ${serviceTitle} Service`);
    }
  }, [location]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Front-end only: simulate submission
    setFormSubmitted(true);
  };

  return (
    <>
      <Section className="bg-slate-100 dark:bg-slate-900">
        <Container className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl md:text-6xl">Get in Touch</h1>
          <p className="mt-6 max-w-3xl mx-auto text-lg text-slate-700 dark:text-slate-300">
            Have a question or want to collaborate? We’d love to hear from you.
          </p>
        </Container>
      </Section>
      <Section>
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              {formSubmitted ? (
                 <div className="p-8 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-500/30 rounded-2xl text-center">
                   <h2 className="text-2xl font-bold text-emerald-800 dark:text-emerald-300">Thank you!</h2>
                   <p className="mt-2 text-emerald-700 dark:text-emerald-400">Your message has been sent. We'll get back to you shortly.</p>
                 </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                    <Input id="name" name="name" type="text" required className="mt-1" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
                    <Input id="email" name="email" type="email" required className="mt-1" />
                  </div>
                   <div>
                    <label htmlFor="organization" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Organization (Optional)</label>
                    <Input id="organization" name="organization" type="text" className="mt-1" />
                  </div>
                   <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Subject</label>
                    <Input id="subject" name="subject" type="text" value={subject} onChange={e => setSubject(e.target.value)} required className="mt-1" />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Message</label>
                    <Textarea id="message" name="message" rows={4} required className="mt-1" />
                  </div>
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input id="consent" name="consent" type="checkbox" className="focus:ring-blue-500 dark:focus:ring-blue-600 h-4 w-4 text-blue-600 border-slate-300 dark:border-slate-600 rounded"/>
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="consent" className="font-medium text-slate-700 dark:text-slate-300">I agree to the privacy policy.</label>
                      <p className="text-slate-500 dark:text-slate-400">You can unsubscribe at any time.</p>
                    </div>
                  </div>
                  <div>
                    <Button type="submit" size="lg">Send Message</Button>
                  </div>
                </form>
              )}
            </div>
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <MapPin className="h-6 w-6 text-blue-700 dark:text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold">Our Address</h3>
                  <p className="text-slate-700 dark:text-slate-300">123 Digital Way, Suite 404<br/>Cyber City, CA 90210</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail className="h-6 w-6 text-blue-700 dark:text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold">Email Us</h3>
                  <a href="mailto:hello@technest.org" className="text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-500">hello@technest.org</a>
                </div>
              </div>
               <div className="flex items-start gap-4">
                <Phone className="h-6 w-6 text-blue-700 dark:text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold">Call Us</h3>
                  <a href="tel:+15551234567" className="text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-500">(555) 123-4567</a>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  <a href="#" aria-label="Twitter" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-500"><Twitter size={24} /></a>
                  <a href="#" aria-label="LinkedIn" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-500"><Linkedin size={24} /></a>
                  <a href="#" aria-label="YouTube" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-500"><Youtube size={24} /></a>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
};

export default ContactPage;