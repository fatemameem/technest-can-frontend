import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Shield, Menu, X } from 'lucide-react';
import { Button } from './ui/Button';
import { ThemeToggle } from './ThemeToggle';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Services', path: '/services' },
  { name: 'Events', path: '/events' },
  { name: 'Contact', path: '/contact' },
];

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const baseLinkClass = "text-base font-medium text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-500 transition-colors duration-300";
  const activeLinkClass = "text-blue-700 dark:text-blue-500";

  const renderNavLinks = (isMobile = false) => (
    navLinks.map((link) => (
      <NavLink
        key={link.path}
        to={link.path}
        onClick={() => setIsMobileMenuOpen(false)}
        className={({ isActive }) => 
          `${isMobile ? 'block py-3 text-lg' : ''} ${baseLinkClass} ${isActive ? activeLinkClass : ''}`
        }
      >
        {link.name}
      </NavLink>
    ))
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
            <Shield className="h-8 w-8 text-blue-700 dark:text-blue-600" />
            <span>TECH-NEST</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            {renderNavLinks()}
          </nav>
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            <Button as={Link} to="/subscribe" variant="primary">
              Subscribe
            </Button>
          </div>
          <div className="md:hidden flex items-center gap-4">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Open mobile menu"
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Sheet */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-slate-50 dark:bg-slate-950 shadow-lg border-t border-slate-200 dark:border-slate-800">
          <div className="px-5 pt-2 pb-5 space-y-1">
            <nav className="flex flex-col space-y-2 mb-4">
              {renderNavLinks(true)}
            </nav>
            <Button as={Link} to="/subscribe" variant="primary" className="w-full">
              Subscribe
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;