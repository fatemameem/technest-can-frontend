"use client";

import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
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

  return (
    <div className="flex justify-between items-center text-white pt-5 pb-12">
      <h1 className="text-6xl font-bold">{getPageTitle()}</h1>
      <div className="relative">
        <div className="relative flex items-center">
          <button className="absolute left-3 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <input
            type="text"
            placeholder="Search"
            className="pl-10 pr-4 py-2 rounded-lg bg-white text-gray-800 w-64 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
      </div>
    </div>
  );
}