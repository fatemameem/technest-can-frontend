"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMobileMenu } from '@/common/MobileMenuContext';

const Sidebar = () => {
  const pathname = usePathname();
  const { mobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useMobileMenu();

  const isActiveLink = (path: string) => {
    return pathname === path;
  };

  const getLinkStyles = (path: string) => {
    return isActiveLink(path) 
      ? "flex items-center gap-2 px-4 py-2 rounded-lg bg-primaryBlue text-white text-xs lg:text-sm"
      : "flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-gray-500/70 hover:bg-gray-100 text-xs lg:text-sm";
  };

  const navLinks = [
    { href: "/", icon: "dashboard.svg", text: "Dashboard" },
    { href: "/programs-and-partners", icon: "programs.svg", text: "Programs & Partners" },
    { href: "/scholarships-and-grants", icon: "scholarships.svg", text: "Scholarships & Grants" },
    { href: "/geographic-insights", icon: "geographic.svg", text: "Geographic Insights" },
    { href: "/long-term-impact", icon: "longtermimpact.svg", text: "Long Term Impact" },
    { href: "/about-us", icon: "aboutus.svg", text: "About Us" },
  ];

  // Prevent clicks on the menu from closing it
  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Mobile navigation overlay
  const mobileNavOverlay = (
    <div 
      className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={closeMobileMenu}
    >
      <div 
        className={`fixed left-0 top-0 h-full w-3/4 sm:w-1/2 md:w-[35%] bg-white transition-transform duration-300 transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
        onClick={handleMenuClick}
      >
        {/* Company logo and name */}
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="logo" width={30} height={30} />
            <h1 className="text-base font-extrabold text-primaryBlue uppercase">TechNest <br /> CANADA</h1>
          </div>
          <button onClick={toggleMobileMenu} className="text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Navigation links container with flex to push login to bottom */}
        <div className="flex flex-col h-[calc(100%-5rem)]">
          {/* Main nav links */}
          <nav className="flex-1 flex flex-col gap-1 p-3 overflow-y-auto">
            {navLinks.map((link) => (
              <Link 
                key={link.href}
                href={link.href} 
                className={isActiveLink(link.href) 
                  ? "flex items-center gap-2 p-2 rounded-lg bg-primaryBlue text-white text-sm"
                  : "flex items-center gap-2 p-2 rounded-lg text-gray-500 hover:bg-gray-100 text-sm"}
                onClick={toggleMobileMenu}
              >
                <Image src={link.icon} alt={link.text} width={16} height={16} />
                {link.text}
              </Link>
            ))}
          </nav>
          
          {/* Login fixed at bottom */}
          <div className="mt-auto border-t p-3">
            <Link 
              href="/login" 
              className={`${isActiveLink("/login") ? "flex items-center gap-2 p-2 rounded-lg bg-primaryBlue text-white text-sm" : "flex items-center gap-2 p-2 rounded-lg text-gray-500 hover:bg-gray-100 text-sm"}`} 
              onClick={toggleMobileMenu}
            >
              <Image src="login.svg" alt="login" width={16} height={16} />
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  // Desktop sidebar
  const desktopSidebar = (
    <div className="hidden lg:flex flex-col h-screen bg-white border rounded-xl sticky left-0 top-0 lg:w-1/5 xl:w-1/6 overflow-y-auto">
      <div className="w-full py-3 lg:py-4 xl:py-5 px-2 lg:px-3 xl:px-4 border-b border-primaryGrey border-solid">
        <div className="logo-and-name flex items-center justify-start gap-1 lg:gap-2">
          <Image src="/logo.png" alt="logo" width={40} height={40} className="w-8 h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12" />
          <h1 className="text-xs lg:text-sm xl:text-base font-extrabold text-primaryBlue uppercase">TechNest <br /> CANADA</h1>
        </div>
      </div>
      <div className="flex flex-col flex-1 px-2 lg:px-3 py-2 lg:py-3 xl:py-4">
        <nav className="flex flex-col gap-1 lg:gap-2">
          {navLinks.map((link) => (
            <Link 
              key={link.href}
              href={link.href} 
              className={getLinkStyles(link.href)}
            >
              <Image src={link.icon} alt={link.text} width={16} height={16} />
              <span className="truncate">{link.text}</span>
          </Link>
          ))}
        </nav>
        
        <div className="mt-auto mb-2 lg:mb-3 xl:mb-4">
          <Link href="/login" className={getLinkStyles("/login")}>
            <Image src="login.svg" alt="login" width={16} height={16} />
            Login
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {mobileNavOverlay}
      {desktopSidebar}
    </>
  );
};

export default Sidebar;