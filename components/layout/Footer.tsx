import { Shield } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Shield className="h-6 w-6 text-cyan-400" />
            <span className="text-lg font-semibold">TECH-NEST</span>
          </div>
          <p className="text-slate-400 text-sm text-center md:text-right">
            Advancing cybersecurity and ethical AI for a safer digital future.
          </p>
        </div>
        <div className="mt-4 pt-4 border-t border-white/5 text-center">
          <p className="text-slate-500 text-xs">
            © {new Date().getFullYear()} TECH-NEST. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}