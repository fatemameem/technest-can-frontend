"use client";
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function AdminHeader() {
  return (
    <div className="flex justify-between items-center">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <Shield className="h-8 w-8 text-cyan-400" />
          <h1 className="text-3xl font-bold">TECH-NEST Admin Dashboard</h1>
        </div>
        <p className="text-slate-400">Manage podcasts, events, and content for the platform</p>
      </div>
      <Button asChild variant="outline" className="btn-secondary cursor-pointer" onClick={() => signOut({ callbackUrl: '/' })}>
        <span>Logout</span>
      </Button>
    </div>
  );
}
