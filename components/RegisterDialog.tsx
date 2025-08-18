import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { EventItem } from '../types';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from './ui/Card';

interface RegisterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventItem;
}

const RegisterDialog: React.FC<RegisterDialogProps> = ({ isOpen, onClose, event }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formState, setFormState] = useState({
    fullName: '',
    email: '',
    affiliation: 'individual',
    consent: false,
  });

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  useEffect(() => {
    // Reset form on dialog open
    if (isOpen) {
      setIsSubmitted(false);
      setFormState({ fullName: '', email: '', affiliation: 'individual', consent: false });
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    setFormState(prevState => ({
      ...prevState,
      [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value,
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send this to a backend.
    // For this demo, we just show a success message.
    console.log('Registration submitted:', { eventId: event.id, ...formState });
    setIsSubmitted(true);
  };
  
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
      aria-labelledby="registration-dialog-title"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md m-4">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle id="registration-dialog-title">Register for Event</CardTitle>
                <CardDescription>{event.title}</CardDescription>
              </div>
              <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Close dialog">
                <X size={20} className="text-slate-500 dark:text-slate-400" />
              </button>
            </div>
          </CardHeader>
          <CardContent>
            {isSubmitted ? (
              <div className="text-center py-8">
                <h3 className="text-xl font-bold text-emerald-700 dark:text-emerald-400">Registration Confirmed!</h3>
                <p className="mt-2 text-slate-700 dark:text-slate-300">Thank you for registering. We've sent a confirmation to your email.</p>
                <Button onClick={onClose} className="mt-6">Close</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                  <Input id="fullName" name="fullName" type="text" value={formState.fullName} onChange={handleChange} required />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
                  <Input id="email" name="email" type="email" value={formState.email} onChange={handleChange} required />
                </div>
                <div>
                  <label htmlFor="affiliation" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Affiliation</label>
                  <select
                    id="affiliation"
                    name="affiliation"
                    value={formState.affiliation}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-xl border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="individual">Individual</option>
                    <option value="company">Company</option>
                    <option value="education">Education</option>
                    <option value="non-profit">Non-profit</option>
                  </select>
                </div>
                 <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input id="consent" name="consent" type="checkbox" checked={formState.consent} onChange={handleChange} className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded dark:border-slate-600"/>
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="consent" className="font-medium text-gray-700 dark:text-slate-300">I would like to receive emails about future events.</label>
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                    <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                    <Button type="submit">Register</Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegisterDialog;