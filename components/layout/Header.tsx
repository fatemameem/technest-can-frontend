'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Shield, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useSession } from "next-auth/react";

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Events', href: '/events' },
  { name: 'Podcasts', href: '/podcasts' },
  { name: 'Blogs', href: '/blogs' },
  { name: 'About', href: '/about' },
  { name: 'Services', href: '/services' },
  // { name: 'Resources', href: '/resources' },
  // { name: 'Videos', href: '/videos' },
  { name: 'Contact', href: '/contact' },
];

const mobileNavigation = [
  ...navigation,
  { name: 'Blogs', href: '/blogs' },
  // { name: 'Videos', href: '/videos' },
  { name: 'Contact', href: '/contact' },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const role = (session?.user as any)?.role as "admin" | "moderator" | undefined;
  const canSeeAdmin = role === "admin" || role === "moderator";

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/95 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 focus-ring rounded-lg">
            <Shield className="h-8 w-8 text-cyan-400" />
            <span className="text-xl font-bold">TECH-NEST</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-slate-300 hover:text-cyan-400 transition-colors focus-ring rounded px-2 py-1"
              >
                {item.name}
              </Link>
            ))}
            {canSeeAdmin && (
              <Link
                key="Admin"
                href="/admin"
                className="text-slate-300 hover:text-cyan-400 transition-colors focus-ring rounded px-2 py-1"
              >
                Admin
              </Link>
            )}
          </nav>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-slate-300 focus-ring">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-slate-900 border-white/10">
              <div className="flex flex-col space-y-4 mt-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="text-slate-300 hover:text-cyan-400 transition-colors focus-ring rounded px-2 py-2"
                  >
                    {item.name}
                  </Link>
                ))}
                {canSeeAdmin && (
                  <Link
                    key="AdminMobile"
                    href="/admin"
                    onClick={() => setIsOpen(false)}
                    className="text-slate-300 hover:text-cyan-400 transition-colors focus-ring rounded px-2 py-2"
                  >
                    Admin
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}