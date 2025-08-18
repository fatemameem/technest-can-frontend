
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import Container from '../components/Container.js';
import Section from '../components/Section.js';
import PageHeader from '../components/PageHeader.js';
import { Button } from '../components/ui/Button.js';
import { CheckCircle } from '../components/icons.js';

// Shim for zodResolver
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

const contactSchema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email address"),
    organization: z.string().optional(),
    subject: z.string().min(1, "Please select a subject"),
    message: z.string().min(10, "Message must be at least 10 characters"),
    consent: z.boolean().refine(val => val === true, "You must agree to the terms"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const serviceSubjects = {
    consultancy: "Consultancy Inquiry",
    content: "Content Creation Inquiry",
    newsletter: "Newsletter Service Inquiry",
    training: "Training & Workshop Inquiry",
};

const Contact = () => {
    const location = useLocation();
    const [submissionSuccess, setSubmissionSuccess] = useState(false);
    const [introLine, setIntroLine] = useState("We'd love to hear from you. How can we help?");

    const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<ContactFormValues>({
        resolver: zodResolverShim(contactSchema)
    });

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const service = params.get('service') as keyof typeof serviceSubjects;
        if (service && serviceSubjects[service]) {
            setValue('subject', serviceSubjects[service]);
            setIntroLine(`Interested in our ${service} services? Fill out the form below to get started.`);
        }
    }, [location, setValue]);

    const onSubmit: SubmitHandler<ContactFormValues> = async (data) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('Form submitted:', data);
        setSubmissionSuccess(true);
    };

    if (submissionSuccess) {
        return (
            <Section>
                <Container className="text-center">
                    <CheckCircle className="w-16 h-16 text-dark-success mx-auto" />
                    <h2 className="mt-4 text-3xl font-bold text-dark-text-primary">Thank You!</h2>
                    <p className="mt-2 text-lg text-dark-text-secondary">Your message has been sent. We'll get back to you shortly.</p>
                </Container>
            </Section>
        );
    }

    return (
        <Section>
            <Container>
                <PageHeader
                    title="Contact Us"
                    subtitle={introLine}
                />
                <div className="mt-12 max-w-lg mx-auto">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-dark-text-secondary">Full Name</label>
                            <input {...register('name')} id="name" className="mt-1 block w-full bg-slate-800 border-slate-600 rounded-md p-2 focus:ring-dark-accent focus:border-dark-accent" />
                            {errors.name && <p className="text-sm text-dark-danger mt-1">{errors.name.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-dark-text-secondary">Email Address</label>
                            <input {...register('email')} id="email" type="email" className="mt-1 block w-full bg-slate-800 border-slate-600 rounded-md p-2 focus:ring-dark-accent focus:border-dark-accent" />
                            {errors.email && <p className="text-sm text-dark-danger mt-1">{errors.email.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="organization" className="block text-sm font-medium text-dark-text-secondary">Organization (Optional)</label>
                            <input {...register('organization')} id="organization" className="mt-1 block w-full bg-slate-800 border-slate-600 rounded-md p-2 focus:ring-dark-accent focus:border-dark-accent" />
                        </div>
                        <div>
                             <label htmlFor="subject" className="block text-sm font-medium text-dark-text-secondary">Subject</label>
                             <select {...register('subject')} id="subject" className="mt-1 block w-full bg-slate-800 border-slate-600 rounded-md p-2 focus:ring-dark-accent focus:border-dark-accent">
                                 <option value="">Select a subject</option>
                                 <option value="General Inquiry">General Inquiry</option>
                                 <option value={serviceSubjects.consultancy}>Consultancy</option>
                                 <option value={serviceSubjects.content}>Content Creation</option>
                                 <option value={serviceSubjects.newsletter}>Newsletter</option>
                                 <option value={serviceSubjects.training}>Training & Workshops</option>
                                 <option value="Partnerships">Partnerships</option>
                             </select>
                             {errors.subject && <p className="text-sm text-dark-danger mt-1">{errors.subject.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-dark-text-secondary">Message</label>
                            <textarea {...register('message')} id="message" rows={4} className="mt-1 block w-full bg-slate-800 border-slate-600 rounded-md p-2 focus:ring-dark-accent focus:border-dark-accent"></textarea>
                            {errors.message && <p className="text-sm text-dark-danger mt-1">{errors.message.message}</p>}
                        </div>
                        <div className="flex items-start">
                            <input {...register('consent')} id="consent" type="checkbox" className="h-4 w-4 rounded border-slate-600 text-dark-primary focus:ring-dark-primary" />
                            <div className="ml-3 text-sm">
                                <label htmlFor="consent" className="text-dark-text-secondary">You agree to our Privacy Policy.</label>
                                {errors.consent && <p className="text-sm text-dark-danger mt-1">{errors.consent.message}</p>}
                            </div>
                        </div>
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? 'Sending...' : 'Send Message'}
                        </Button>
                    </form>
                </div>
            </Container>
        </Section>
    );
};

export default Contact;