import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { 
  ShieldCheck, 
  FileText, 
  Mail, 
  GraduationCap,
  ArrowRight
} from 'lucide-react';

const iconMap = {
  'shield-check': ShieldCheck,
  'file-text': FileText,
  'mail': Mail,
  'graduation-cap': GraduationCap,
};

interface ServiceCardProps {
  service: {
    id: string;
    title: string;
    description: string;
    features: string[];
    icon: keyof typeof iconMap;
    available: boolean;
  };
}

export function ServiceCard({ service }: ServiceCardProps) {
  const IconComponent = iconMap[service.icon];

  return (
    <Card className="surface hover-lift h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center space-x-3 mb-3">
          <div className="p-2 bg-blue-600/10 rounded-lg">
            <IconComponent className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-lg lg:text-xl">{service.title}</CardTitle>
        </div>
        <p className="text-slate-300 text-sm md:text-base font-poppins">{service.description}</p>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        {/* <div className="flex flex-wrap justify-center items-center gap-2 mb-6">
          {service.features.map((feature, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {feature}
            </Badge>
          ))}
        </div> */}
        <div className="mt-auto">
          {service.available ? (
            // Render button with link when available
            <Button asChild variant="outline" className="font-poppins text-sm md:text-base btn-secondary w-full">
              <Link href={`/contact?service=${service.id}`}>
                Request Service
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          ) : (
            // Render just a disabled button when not available
            <Button 
              variant="outline" 
              className="btn-secondary text-sm md:text-base w-full opacity-50 cursor-not-allowed" 
              disabled={true}
            >
              Coming Soon
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}