import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

type HeaderActionsProps = {
  activeTab: string;
  handlers: any;
  sidebarItems: Array<{ id: string; label: string; icon: any }>;
};

export default function HeaderActions({
  activeTab,
  handlers,
  sidebarItems
}: HeaderActionsProps) {
  if (!handlers) return null;
  
  return (
    <>
      {activeTab === 'podcasts' && (
        <Button 
          className="bg-blue-600 hover:bg-blue-500 text-white"
          onClick={() => {
            handlers.cancelPodcastEdit();
            handlers.setShowPodcastForm(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add a new podcast
        </Button>
      )}
      {activeTab === 'events' && (
        <Button 
          className="bg-blue-600 hover:bg-blue-500 text-white"
          onClick={() => {
            handlers.cancelEventEdit();
            handlers.setShowEventForm(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add a new event
        </Button>
      )}
      {activeTab === 'team-members' && (
        <Button 
          className="bg-blue-600 hover:bg-blue-500 text-white"
          onClick={() => {
            handlers.cancelTeamMemberEdit();
            handlers.setShowTeamMemberForm(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add a new team member
        </Button>
      )}
      {activeTab === 'blogs' && (
        <Link href="/admin/blogs/new">
        <Button 
          className="bg-blue-600 hover:bg-blue-500 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add a new blog post
        </Button>
        </Link>
      )}
      {(activeTab !== 'overview' && activeTab !== 'settings' && 
        activeTab !== 'podcasts' && activeTab !== 'events' && 
        activeTab !== 'team-members' && activeTab !== 'blogs' &&
        activeTab !== 'newsletter') && (
        <Button className="bg-blue-600 hover:bg-blue-500 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add a new {sidebarItems.find(item => item.id === activeTab)?.label.toLowerCase().slice(0, -1)}
        </Button>
      )}
    </>
  );
}