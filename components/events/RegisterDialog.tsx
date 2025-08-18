'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

interface RegisterDialogProps {
  event: {
    id: string;
    title: string;
  };
  children: React.ReactNode;
}

export function RegisterDialog({ event, children }: RegisterDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    consent: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.consent) {
      toast.error('Please accept the terms and conditions');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success(`Successfully registered for ${event.title}!`, {
      description: 'You will receive a confirmation email shortly.',
    });
    
    setIsSubmitting(false);
    setIsOpen(false);
    setFormData({ name: '', email: '', organization: '', consent: false });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="surface border-white/10">
        <DialogHeader>
          <DialogTitle>Register for Event</DialogTitle>
          <DialogDescription className="text-slate-400">
            Register for &quot;{event.title}&quot;. We'll send you confirmation details and updates.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
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
          
          <div className="space-y-2">
            <Label htmlFor="organization">Organization</Label>
            <Input
              id="organization"
              value={formData.organization}
              onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
              className="focus-ring"
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
              I agree to receive event updates and communications from TECH-NEST
            </Label>
          </div>

          <Button 
            type="submit" 
            className="w-full btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Registering...' : 'Register'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}