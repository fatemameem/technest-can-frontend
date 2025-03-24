"use client";

import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import { useMobileMenu } from '@/common/MobileMenuContext';

export default function Header() {
  const pathname = usePathname();
  const [showSearch, setShowSearch] = useState(false);
  const { toggleMobileMenu } = useMobileMenu();

  const getPageTitle = () => {
    switch (pathname) {
      case '/':
        return 'Welcome to TechNest!';
      case '/programs-and-partners':
        return 'Programs & Partners';
      case '/scholarships-and-grants':
        return 'Scholarships & Grants';
      case '/geographic-insights':
        return 'Geographic Insights';
      case '/long-term-impact':
        return 'Long Term Impact';
      case '/about-us':
        return 'About Us';
      case '/login':
        return 'Login';
      default:
        return 'Welcome to TechNest!';
    }
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

  return (
    <div className="text-white pt-1 pb-3 lg:pt-2 lg:pb-6 xl:pt-3 xl:pb-8">
      {/* Desktop Header */}
      <div className="hidden lg:flex justify-between items-center">
        <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold">{getPageTitle()}</h1>
        <div className="relative">
          <div className="relative flex items-center">
            <button className="absolute left-2 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <input
              type="text"
              placeholder="Search"
              className="pl-8 pr-3 py-1.5 text-sm rounded-lg bg-white text-gray-800 w-48 lg:w-56 xl:w-64 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="flex lg:hidden justify-between items-center bg-white rounded-lg p-2 text-primaryBlue">
        {/* Hamburger Menu */}
        <button 
          onClick={toggleMobileMenu}
          className="p-1.5 focus:outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Logo and TECHNEST text - fixed regardless of page */}
        <div className="flex items-center gap-1.5">
          <Image src="/logo.png" alt="TechNest Logo" width={25} height={25} />
          <span className="text-sm font-bold">TECHNEST</span>
        </div>
        
        {/* Search Icon */}
        <button 
          onClick={toggleSearch}
          className="p-1.5 focus:outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>

      {/* Mobile Header Title (outside the white bar) - centered */}
      <div className="lg:hidden mt-2 text-center">
        <h1 className="text-lg font-bold">{getPageTitle()}</h1>
      </div>

      {/* Mobile Search Box - Show when search icon is clicked */}
      {showSearch && (
        <div className="lg:hidden mt-2 relative">
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-8 pr-3 py-1.5 text-sm rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
            autoFocus
          />
          <button className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}