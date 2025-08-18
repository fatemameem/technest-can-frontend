import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Twitter, Linkedin, Youtube } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-200 dark:bg-slate-900 text-slate-700 dark:text-slate-300">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white">
              <Shield className="h-8 w-8 text-blue-700 dark:text-blue-500" />
              <span>TECH-NEST</span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Empowering people everywhere to respond confidently to digital change.
            </p>
            <div className="flex space-x-4">
              <a href="#" aria-label="Twitter" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"><Twitter size={20} /></a>
              <a href="#" aria-label="LinkedIn" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"><Linkedin size={20} /></a>
              <a href="#" aria-label="YouTube" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"><Youtube size={20} /></a>
            </div>
          </div>
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 tracking-wider uppercase">Navigate</h3>
              <ul className="mt-4 space-y-2">
                <li><Link to="/about" className="text-base text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">About</Link></li>
                <li><Link to="/services" className="text-base text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">Services</Link></li>
                <li><Link to="/events" className="text-base text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">Events</Link></li>
                <li><Link to="/contact" className="text-base text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">Contact</Link></li>
              </ul>
            </div>
             <div>
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 tracking-wider uppercase">Resources</h3>
              <ul className="mt-4 space-y-2">
                <li><Link to="/videos" className="text-base text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">Videos</Link></li>
                <li><a href="#" className="text-base text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">Podcasts</a></li>
                <li><a href="#" className="text-base text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">Blog</a></li>
              </ul>
            </div>
            <div className="sm:col-span-2 md:col-span-1">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 tracking-wider uppercase">Stay Updated</h3>
              <p className="mt-4 text-base text-slate-500 dark:text-slate-400">Get the latest cybersecurity news and event updates.</p>
              <form className="mt-4 sm:flex sm:max-w-md">
                <label htmlFor="email-address" className="sr-only">Email address</label>
                <Input
                  type="email"
                  name="email-address"
                  id="email-address"
                  autoComplete="email"
                  placeholder="Enter your email"
                  className="w-full"
                />
                <div className="mt-3 rounded-md sm:mt-0 sm:ml-3 sm:flex-shrink-0">
                  <Button type="submit" variant="primary" className="w-full">
                    Subscribe
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-slate-300 dark:border-slate-700 pt-8 text-sm text-center text-slate-500 dark:text-slate-400">
          <p>&copy; {new Date().getFullYear()} TECH-NEST. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;