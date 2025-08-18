
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Button, ButtonLink } from '../ui/Button.js';
import { Shield, Menu, X } from '../icons.js';
import { cn } from '../../lib/utils.js';
import { useAdmin } from '../../context/AdminContext.js';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Services', path: '/services' },
  { name: 'Events', path: '/events' },
  { name: 'Contact', path: '/contact' },
];

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAdmin, toggleAdmin } = useAdmin();

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  const NavLinks = ({ isMobile = false }: { isMobile?: boolean }) => (
    <>
      {navLinks.map((link) => (
        <NavLink
          key={link.path}
          to={link.path}
          onClick={handleLinkClick}
          className={({ isActive }) =>
            cn(
              'font-medium transition-colors hover:text-dark-accent',
              isActive ? 'text-dark-accent' : 'text-dark-text-secondary',
              isMobile ? 'block py-2 text-lg' : 'px-4 py-2 text-sm'
            )
          }
        >
          {link.name}
        </NavLink>
      ))}
      {isAdmin && (
         <NavLink
         to="/admin"
         onClick={handleLinkClick}
         className={({ isActive }) =>
           cn(
             'font-medium transition-colors hover:text-dark-accent',
             isActive ? 'text-dark-accent' : 'text-dark-text-secondary',
             isMobile ? 'block py-2 text-lg' : 'px-4 py-2 text-sm'
           )
         }
       >
         Admin
       </NavLink>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-dark-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <NavLink to="/" className="flex items-center space-x-2">
          <Shield className="h-6 w-6 text-dark-primary" />
          <span className="font-bold text-lg">TECH-NEST</span>
        </NavLink>
        <nav className="hidden md:flex items-center space-x-1">
          <NavLinks />
        </nav>
        <div className="hidden md:flex items-center space-x-4">
          <ButtonLink to="/subscribe" variant="secondary" size="sm">
            Subscribe
          </ButtonLink>
          <Button onClick={toggleAdmin} variant="ghost" size="sm" className="hidden lg:inline-flex">
            {isAdmin ? 'Exit Admin' : 'Admin View'}
          </Button>
        </div>
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Open mobile menu"
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-dark-surface shadow-lg animate-in fade-in-20 slide-in-from-top-4">
          <nav className="flex flex-col items-center p-4 space-y-2">
            <NavLinks isMobile />
            <ButtonLink to="/subscribe" variant="secondary" className="w-full mt-4" onClick={handleLinkClick}>
              Subscribe
            </ButtonLink>
             <Button onClick={() => { toggleAdmin(); handleLinkClick(); }} variant="ghost" className="w-full mt-2">
              {isAdmin ? 'Exit Admin' : 'Admin View'}
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;