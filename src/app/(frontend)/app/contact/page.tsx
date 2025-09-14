'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Hero } from '@/components/ui/hero';
import { Section } from '@/components/ui/section';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Mail, Phone, MapPin } from 'lucide-react';
import sampleData from '@/data/sample.json';
import { API_BASE } from '@/lib/env';

function ContactInner() {
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    subject: '',
    message: '',
    consent: false,
  });

  // Pre-fill subject based on URL parameter
  useEffect(() => {
    const serviceParam = searchParams.get('service');
    if (serviceParam) {
      const service = sampleData.services.find(s => s.id === serviceParam);
      if (service) {
        setFormData(prev => ({ ...prev, subject: service.title }));
      }
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.consent) {
      toast.error('Please accept the privacy policy');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          organization: formData.organization,
          subject: formData.subject,
          message: formData.message,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json?.ok) {
        const errMsg =
          (json && (json.error || json.message)) ||
          `Failed to send message (${res.status})`;
        toast.error('Message failed to send', { description: errMsg });
      } else {
        toast.success('Message sent successfully!', {
          description: "We'll get back to you within 24 hours.",
        });

        // Reset form
        setFormData({
          name: '',
          email: '',
          organization: '',
          subject: '',
          message: '',
          consent: false,
        });
      }
    } catch (error: any) {
      const errMsg = error?.message || 'Network error';
      toast.error('Message failed to send', { description: errMsg });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Hero
        title="Contact Us"
        subtitle="Get in touch with our team for cybersecurity consulting, AI ethics guidance, or training opportunities."
      />

      <Section>
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="surface">
                <CardHeader>
                  <CardTitle>Send us a message</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="focus-ring"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="focus-ring"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="organization">Organization</Label>
                      <Input
                        id="organization"
                        value={formData.organization}
                        onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                        className="focus-ring"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Select 
                        required
                        value={formData.subject} 
                        onValueChange={(value) => setFormData({ ...formData, subject: value })}
                      >
                        <SelectTrigger className="focus-ring">
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Inquiry</SelectItem>
                          {sampleData.services.map((service) => (
                            <SelectItem key={service.id} value={service.title}>
                              {service.title}
                            </SelectItem>
                          ))}
                          <SelectItem value="partnership">Partnership</SelectItem>
                          <SelectItem value="media">Media Inquiry</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        required
                        rows={6}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="focus-ring resize-none"
                        placeholder="Tell us about your needs..."
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="consent"
                        checked={formData.consent}
                        onCheckedChange={(checked) => setFormData({ ...formData, consent: !!checked })}
                      />
                      <Label 
                        htmlFor="consent" 
                        className="text-sm text-slate-300 cursor-pointer"
                      >
                        I agree to the privacy policy and consent to being contacted by TECH-NEST
                      </Label>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full btn-primary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
            
            {/* Contact Info */}
            <div className="space-y-6">
              <Card className="surface">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Get in Touch</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 text-slate-300">
                      <Mail className="h-5 w-5 text-cyan-400" />
                      <span>hello@tech-nest.org</span>
                    </div>
                    <div className="flex items-center space-x-3 text-slate-300">
                      <Phone className="h-5 w-5 text-cyan-400" />
                      <span>+1 (555) 123-4567</span>
                    </div>
                    <div className="flex items-center space-x-3 text-slate-300">
                      <MapPin className="h-5 w-5 text-cyan-400" />
                      <span>Montreal, QC</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="surface">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Response Time</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    We typically respond to all inquiries within 24 hours during business days. 
                    For urgent security matters, please call the number mentioned above.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={null}>
      <ContactInner />
    </Suspense>
  );
}

// export const dynamic = "force-dynamic";