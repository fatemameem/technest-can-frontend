
import React from 'react';
import Container from '../components/Container.js';
import Section from '../components/Section.js';
import PageHeader from '../components/PageHeader.js';
import { ButtonLink } from '../components/ui/Button.js';

const Subscribe = () => {
    return (
        <Section>
            <Container className="text-center">
                <PageHeader
                    title="Subscribe to our Newsletter"
                    subtitle="Our newsletter is coming soon! Be the first to know about our latest events, insights, and resources on cybersecurity and AI ethics."
                />
                <div className="mt-10 max-w-lg mx-auto">
                    <div className="flex gap-x-4">
                        <input 
                            type="email" 
                            placeholder="Enter your email"
                            disabled
                            className="min-w-0 flex-auto rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-dark-primary sm:text-sm sm:leading-6 cursor-not-allowed opacity-50"
                        />
                        <button
                            disabled
                            className="flex-none rounded-md bg-dark-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dark-primary cursor-not-allowed opacity-50"
                        >
                            Notify Me
                        </button>
                    </div>
                    <p className="mt-6 text-dark-meta">
                        In the meantime, feel free to <ButtonLink to="/contact" variant="link" className="px-1">contact us</ButtonLink> for any inquiries.
                    </p>
                </div>
            </Container>
        </Section>
    );
};

export default Subscribe;