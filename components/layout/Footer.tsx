
import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Linkedin, Twitter, Github } from '../icons.js';

const Footer = () => {
  return (
    <footer className="bg-dark-surface border-t border-slate-800">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1 flex flex-col items-start">
             <Link to="/" className="flex items-center space-x-2 mb-4">
              <Shield className="h-8 w-8 text-dark-primary" />
              <span className="font-bold text-xl">TECH-NEST</span>
            </Link>
            <p className="text-dark-text-secondary text-sm">
              Empowering people everywhere to respond confidently to digital change.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 md:col-span-3 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-dark-text-primary tracking-wider uppercase">Navigate</h3>
              <ul className="mt-4 space-y-2">
                <li><Link to="/about" className="text-sm text-dark-text-secondary hover:text-dark-accent">About</Link></li>
                <li><Link to="/services" className="text-sm text-dark-text-secondary hover:text-dark-accent">Services</Link></li>
                <li><Link to="/events" className="text-sm text-dark-text-secondary hover:text-dark-accent">Events</Link></li>
                <li><Link to="/contact" className="text-sm text-dark-text-secondary hover:text-dark-accent">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-dark-text-primary tracking-wider uppercase">Resources</h3>
              <ul className="mt-4 space-y-2">
                <li><Link to="/videos" className="text-sm text-dark-text-secondary hover:text-dark-accent">Videos</Link></li>
                <li><span className="text-sm text-dark-meta cursor-not-allowed">Blog (soon)</span></li>
                <li><span className="text-sm text-dark-meta cursor-not-allowed">Podcasts (soon)</span></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-dark-text-primary tracking-wider uppercase">Connect</h3>
              <div className="flex mt-4 space-x-4">
                  <a href="#" className="text-dark-text-secondary hover:text-dark-accent"><span className="sr-only">LinkedIn</span><Linkedin /></a>
                  <a href="#" className="text-dark-text-secondary hover:text-dark-accent"><span className="sr-only">Twitter</span><Twitter /></a>
                  <a href="#" className="text-dark-text-secondary hover:text-dark-accent"><span className="sr-only">GitHub</span><Github /></a>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-dark-meta">&copy; {new Date().getFullYear()} TECH-NEST. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <Link to="#" className="text-xs text-dark-meta hover:text-dark-text-secondary">Privacy Policy</Link>
            <Link to="#" className="text-xs text-dark-meta hover:text-dark-text-secondary">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;