import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { signOut } from 'next-auth/react';
import { 
  Search,
  BarChart3,
  Mic,
  Calendar,
  FileText,
  Users,
  Shield,
  Plus
} from 'lucide-react';
import Link from 'next/link';
import HeaderActions from './HeaderActions';
import Sidebar from './Sidebar';

type DashboardLayoutProps = {
  activeTab: string;
  onTabChange: (tab: string) => void;
  session: any;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  showSearchBar: boolean;
  getPageTitle: () => string;
  children: React.ReactNode;
  sidebarItems?: Array<{ id: string; label: string; icon: any }>;
  headerActionHandlers?: any;
};

export default function DashboardLayout({
  activeTab,
  onTabChange,
  session,
  searchQuery,
  onSearchChange,
  showSearchBar,
  getPageTitle,
  children,
  headerActionHandlers,
  sidebarItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'podcasts', label: 'Podcasts', icon: Mic },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'blogs', label: 'Blogs', icon: FileText },
    { id: 'team-members', label: 'Team Members', icon: Users },
    { id: 'admins', label: 'Admins', icon: Shield },
  ],
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen flex mx-auto container">
      {/* Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={onTabChange} 
        items={sidebarItems}
        session={session}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">{getPageTitle()}</h1>
            <HeaderActions 
              activeTab={activeTab}
              handlers={headerActionHandlers}
              sidebarItems={sidebarItems}
            />
          </div>
          
          {/* Search Bar */}
          {showSearchBar && (
            <div className="mt-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder={`Search ${sidebarItems.find(item => item.id === activeTab)?.label.toLowerCase()}...`}
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-10 bg-slate-800 border-slate-700 text-white placeholder-slate-400 focus:border-blue-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 px-6 pb-6">
          {children}
        </div>
      </div>
    </div>
  );
}