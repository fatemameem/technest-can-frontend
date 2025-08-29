import { Hero } from '@/components/ui/hero';
import { Section } from '@/components/ui/section';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Mail, ArrowRight } from 'lucide-react';

export default function Subscribe() {
  return (
    <>
      <Hero
        title="Newsletter Subscription"
        subtitle="Stay updated with the latest insights on cybersecurity trends and AI ethics developments."
      >
        <Badge variant="outline" className="border-amber-500/50 text-amber-400 mb-8">
          Coming Soon
        </Badge>
      </Hero>

      <Section>
        <div className="max-w-2xl mx-auto text-center">
          <Card className="surface">
            <CardContent className="p-8">
              <div className="mb-6">
                <Mail className="h-16 w-16 text-cyan-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-4">Newsletter Coming Soon</h2>
                <p className="text-slate-300 leading-relaxed">
                  We're working on bringing you a comprehensive weekly newsletter featuring:
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="p-4 border border-white/10 rounded-lg">
                  <h3 className="font-semibold mb-2">Expert Analysis</h3>
                  <p className="text-slate-400 text-sm">
                    Deep insights into emerging cybersecurity threats and trends
                  </p>
                </div>
                <div className="p-4 border border-white/10 rounded-lg">
                  <h3 className="font-semibold mb-2">AI Ethics Updates</h3>
                  <p className="text-slate-400 text-sm">
                    Latest developments in AI governance and ethical frameworks
                  </p>
                </div>
                <div className="p-4 border border-white/10 rounded-lg">
                  <h3 className="font-semibold mb-2">Industry News</h3>
                  <p className="text-slate-400 text-sm">
                    Curated news from the cybersecurity and tech ethics world
                  </p>
                </div>
                <div className="p-4 border border-white/10 rounded-lg">
                  <h3 className="font-semibold mb-2">Best Practices</h3>
                  <p className="text-slate-400 text-sm">
                    Actionable security tips and ethical guidelines
                  </p>
                </div>
              </div>
              
              <div className="mb-8">
                <div className="flex max-w-sm mx-auto">
                  <Input 
                    type="email" 
                    placeholder="Enter your email"
                    disabled
                    className="rounded-r-none bg-slate-800/50"
                  />
                  <Button 
                    disabled
                    className="rounded-l-none btn-primary"
                  >
                    Notify Me
                  </Button>
                </div>
                <p className="text-slate-500 text-xs mt-2">
                  We'll notify you when the newsletter launches
                </p>
              </div>
              
              <div className="border-t border-white/10 pt-6">
                <p className="text-slate-400 mb-4">
                  In the meantime, get in touch with us directly:
                </p>
                <Button asChild className="btn-primary">
                  <Link href="/contact">
                    Contact Us
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>
    </>
  );
}