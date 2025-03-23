"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar = () => {
  const pathname = usePathname();

  const isActiveLink = (path: string) => {
    return pathname === path;
  };

  const getLinkStyles = (path: string) => {
    return isActiveLink(path) 
      ? "flex items-center gap-3 px-6 py-3 rounded-lg bg-primaryBlue text-white text-sm"
      : "flex items-center gap-3 px-6 py-3 rounded-lg bg-white text-gray-500/70 hover:bg-gray-100 text-sm";
  };

  return (
    <div className="flex flex-col h-screen bg-white border rounded-3xl sticky left-0 top-0 w-1/4 overflow-y-auto">
      <div className="w-full py-9 px-5 border-b border-primaryGrey border-solid">
        <div className="logo-and-name flex items-center justify-start gap-4 ">
          <Image src="/logo.png" alt="logo" width={80} height={80} />
          <h1 className="text-2xl font-extrabold text-primaryBlue uppercase">TechNest <br /> CANADA</h1>
        </div>
        {/* <hr className="relative left-0 right-0 -mx-5 w-[calc(100%+2.5rem)] border-t border-primaryGrey" /> */}
      </div>
      <div className="flex flex-col flex-1 px-5 py-9">
        <nav className="flex flex-col gap-4">
          <Link href="/" className={getLinkStyles("/")}>
            <Image src="dashboard.svg" alt="dashboard" width={20} height={20} />
            Dashboard
          </Link>
          <Link href="/programs-and-partners" className={getLinkStyles("/programs-and-partners")}>
            <Image src="programs.svg" alt="programs" width={20} height={20} />
            Programs & Partners
          </Link>
          <Link href="/scholarships-and-grants" className={getLinkStyles("/scholarships-and-grants")}>
            <Image src="scholarships.svg" alt="scholarships" width={20} height={20} />
            Scholarships & Grants
          </Link>
          <Link href="/geographic-insights" className={getLinkStyles("/geographic-insights")}>
            <Image src="geographic.svg" alt="map-pin" width={20} height={20} />
            Geographic Insights
          </Link>
          <Link href="/long-term-impact" className={getLinkStyles("/long-term-impact")}>
            <Image src="longtermimpact.svg" alt="long-term-impact" width={20} height={20} />
            Long Term Impact
          </Link>
          <Link href="/about-us" className={getLinkStyles("/about-us")}>
            <Image src="aboutus.svg" alt="about-us" width={20} height={20} />
            About Us
          </Link>
        </nav>
        
        <div className="mt-auto mb-9">
          <Link href="/login" className={getLinkStyles("/login")}>
            <Image src="login.svg" alt="login" width={20} height={20} />
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;