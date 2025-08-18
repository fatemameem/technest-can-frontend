
import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { EventItem } from '../types.js';
import { useAppContext } from '../context/AppContext.js';
import { Button } from './ui/Button.js';
import { X, CheckCircle } from './icons.js';

// Shim for zodResolver because it's not available in this environment
const zodResolverShim = (schema: z.ZodSchema) => (values: any, _context: any, _options: any) => {
    try {
        schema.parse(values);
        return { values, errors: {} };
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errors = error.issues.reduce((acc: Record<string, any>, curr) => {
                if (curr.path.length > 0) {
                    acc[curr.path[0].toString()] = { type: 'manual', message: curr.message };
                }
                return acc;
            }, {});
            return { values: {}, errors };
        }
        throw error;
    }
};

const registrationSchema = z.object({
    fullName: z.string().min(2, "Full name is required"),
    email: z.string().email("Invalid email address"),
    affiliation: z.string().optional(),
    consent: z.boolean().optional(),
});

type RegistrationFormValues = z.infer<typeof registrationSchema>;

interface RegisterDialogProps {
    event: EventItem;
    children: React.ReactElement;
}

const RegisterDialog = ({ event, children }: RegisterDialogProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const { addRegistration, isRegistered } = useAppContext();
    const hasRegistered = isRegistered(event.id);

    const { register, handleSubmit, formState: { errors }, reset } = useForm<RegistrationFormValues>({
        resolver: zodResolverShim(registrationSchema),
    });

    const onSubmit: SubmitHandler<RegistrationFormValues> = (data) => {
        addRegistration({
            eventId: event.id,
            fullName: data.fullName,
            email: data.email,
            affiliation: data.affiliation,
            consent: data.consent || false,
        });
        setIsSuccess(true);
        reset();
    };

    const openDialog = () => {
        if (hasRegistered) return;
        setIsOpen(true);
    };

    const closeDialog = () => {
        setIsOpen(false);
        // Delay resetting success state to allow for exit animation
        setTimeout(() => setIsSuccess(false), 300); 
    };

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeDialog();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
        }
        return () => document.removeEventListener('keydown', handleEsc);
    }, [isOpen]);

    return (
        <>
            {React.cloneElement(children as React.ReactElement<any>, { onClick: openDialog })}
            {isOpen && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
                    aria-labelledby="dialog-title"
                    role="dialog"
                    aria-modal="true"
                    onClick={closeDialog}
                >
                    <div
                        className="relative m-4 bg-dark-surface rounded-2xl shadow-xl w-full max-w-md"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-4 right-4"
                                onClick={closeDialog}
                                aria-label="Close dialog"
                            ><X /></Button>

                            {!isSuccess ? (
                                <>
                                    <h2 id="dialog-title" className="text-xl font-bold text-dark-text-primary">Register for {event.title}</h2>
                                    <p className="text-sm text-dark-meta mt-1">Complete the form below to secure your spot.</p>
                                    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
                                        <div>
                                            <label htmlFor="fullName" className="block text-sm font-medium text-dark-text-secondary">Full Name</label>
                                            <input {...register('fullName')} id="fullName" className="mt-1 block w-full bg-slate-800 border-slate-600 rounded-md p-2 focus:ring-dark-accent focus:border-dark-accent" />
                                            {errors.fullName && <p className="text-sm text-dark-danger mt-1">{errors.fullName.message}</p>}
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-dark-text-secondary">Email</label>
                                            <input {...register('email')} id="email" type="email" className="mt-1 block w-full bg-slate-800 border-slate-600 rounded-md p-2 focus:ring-dark-accent focus:border-dark-accent" />
                                            {errors.email && <p className="text-sm text-dark-danger mt-1">{errors.email.message}</p>}
                                        </div>
                                         <div>
                                            <label htmlFor="affiliation" className="block text-sm font-medium text-dark-text-secondary">Affiliation (Optional)</label>
                                            <input {...register('affiliation')} id="affiliation" placeholder="Company / Individual" className="mt-1 block w-full bg-slate-800 border-slate-600 rounded-md p-2 focus:ring-dark-accent focus:border-dark-accent" />
                                        </div>
                                        <div className="flex items-start">
                                            <input {...register('consent')} id="consent" type="checkbox" className="h-4 w-4 rounded border-slate-600 text-dark-primary focus:ring-dark-primary" />
                                            <div className="ml-3 text-sm">
                                                <label htmlFor="consent" className="text-dark-text-secondary">I'd like to receive email updates from TECH-NEST.</label>
                                            </div>
                                        </div>
                                        <Button type="submit" className="w-full">Confirm Registration</Button>
                                    </form>
                                </>
                            ) : (
                                <div className="text-center py-8">
                                    <CheckCircle className="w-16 h-16 text-dark-success mx-auto" />
                                    <h2 className="mt-4 text-2xl font-bold text-dark-text-primary">Registration Confirmed!</h2>
                                    <p className="mt-2 text-dark-text-secondary">Thank you for registering. We've sent a confirmation to your email.</p>
                                    <Button onClick={closeDialog} className="mt-6">Close</Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default RegisterDialog;