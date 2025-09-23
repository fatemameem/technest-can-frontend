import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { signOut } from 'next-auth/react';

type SidebarProps = {
  activeTab: string;
  onTabChange: (tab: string) => void;
  session: any;
  items: Array<{ id: string; label: string; icon: any }>;
};

export default function Sidebar({
  activeTab,
  onTabChange,
  session,
  items
}: SidebarProps) {
  return (
    <div className="w-64 flex flex-col">
      <div className="p-6">
        <h1 className="text-xl font-bold text-white">Admin Panel</h1>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    isActive 
                      ? 'bg-blue-600 text-white' 
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="p-4">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback>{session?.user?.name?.split(' ').map((n: string) => n?.[0] || '').join('') || 'U'}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{session?.user?.name || 'User'}</p>
            <button 
              onClick={() => signOut({ callbackUrl: '/' })}
              className="text-slate-400 hover:text-white text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}