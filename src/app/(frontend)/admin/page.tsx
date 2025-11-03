// // export { default } from '../userAdmin/page'
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';
import { signIn, signOut } from 'next-auth/react';
import { useAdminDashboard } from '@/hooks/useAdminDashboard';
import DashboardLayout from '@/components/admin/dashboard/DashboardLayout';
import OverviewTab from '@/components/admin/dashboard/tabs/Overview';
import PodcastsTab from '@/components/admin/dashboard/tabs/Podcasts';
import EventsTab from '@/components/admin/dashboard/tabs/Events';
import BlogsTab from '@/components/admin/dashboard/tabs/Blogs';
import TeamTab from '@/components/admin/dashboard/tabs/Team';
import AdminsTab from '@/components/admin/dashboard/tabs/Admins';

export default function AdminDashboard() {
  const { state, actions } = useAdminDashboard();

  if (state.loading) return null;

  if (!state.session?.user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Card className="w-[400px] bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Admin Access</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-slate-400">Please sign in with Google to access the admin dashboard.</p>
            <Button 
              onClick={() => signIn("google", { callbackUrl: "/admin" })}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white"
            >
              Sign in with Google
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!state.canManageContent) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Card className="w-[400px] bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-2xl text-white flex items-center space-x-2">
              <Shield className="h-5 w-5 text-red-400" />
              <span>Unauthorized</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-slate-400">Your account isn't on the admin allowlist.</p>
            <Button 
              onClick={() => signOut({ callbackUrl: '/' })}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white"
            >
              Sign out
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Prepare header action handlers object
  const headerActionHandlers = {
    cancelPodcastEdit: actions.cancelPodcastEdit,
    setShowPodcastForm: actions.setShowPodcastForm,
    cancelEventEdit: actions.cancelEventEdit,
    setShowEventForm: actions.setShowEventForm,
    cancelTeamMemberEdit: actions.cancelTeamMemberEdit,
    setShowTeamMemberForm: actions.setShowTeamMemberForm,
    cancelAdminEdit: actions.cancelAdminEdit,
    setShowAdminForm: actions.setShowAdminForm,
  };

  return (
    <DashboardLayout
      activeTab={state.activeTab}
      onTabChange={actions.setActiveTab}
      session={state.session}
      searchQuery={state.searchQuery}
      onSearchChange={actions.setSearchQuery}
      showSearchBar={state.showSearchBar}
      getPageTitle={actions.getPageTitle}
      headerActionHandlers={headerActionHandlers}
    >
      {state.activeTab === 'overview' && (
        <OverviewTab
          podcastCount={state.podcastCount}
          eventCount={state.eventCount}
          subscriberCount={state.subscriberCount}
          lastPodcast={state.lastPodcast}
          lastEvent={state.lastEvent}
          statsLoading={state.statsLoading}
          blogCount={state.blogCount}
          lastBlog={state.lastBlog}
        />
      )}

      {state.activeTab === 'podcasts' && (
        <PodcastsTab
          podcastForms={state.podcastForms}
          showPodcastForm={state.showPodcastForm}
          editMode={state.editMode}
          isSubmittingPodcasts={state.isSubmittingPodcasts}
          podcasts={state.podcasts}
          loadingPodcasts={state.loadingPodcasts}
          deletingItemId={state.deletingItemId}
          actions={{
            addPodcastForm: actions.addPodcastForm,
            removePodcastForm: actions.removePodcastForm,
            updatePodcastForm: actions.updatePodcastForm,
            handleEditPodcast: actions.handleEditPodcast,
            cancelPodcastEdit: actions.cancelPodcastEdit,
            handlePodcastSubmit: actions.handlePodcastSubmit,
            deletePodcast: actions.deletePodcast,
            addLearnMoreLink: actions.addLearnMoreLink,
            removeLearnMoreLink: actions.removeLearnMoreLink,
            updateLearnMoreLink: actions.updateLearnMoreLink as (podcastIndex: number, linkIndex: number, field: string, value: string) => void,
            addResourceLink: actions.addResourceLink,
            removeResourceLink: actions.removeResourceLink,
            updateResourceLink: actions.updateResourceLink as (podcastIndex: number, linkIndex: number, field: string, value: string) => void,
          }}
        />
      )}

      {state.activeTab === 'events' && (
        <EventsTab
          eventForms={state.eventForms}
          showEventForm={state.showEventForm}
          editMode={state.editMode}
          isSubmittingEvents={state.isSubmittingEvents}
          events={state.events}
          loadingEvents={state.loadingEvents}
          deletingItemId={state.deletingItemId}
          actions={{
            addEventForm: actions.addEventForm,
            removeEventForm: actions.removeEventForm,
            updateEventForm: actions.updateEventForm,
            handleEditEvent: actions.handleEditEvent,
            cancelEventEdit: actions.cancelEventEdit,
            handleEventSubmit: actions.handleEventSubmit,
            addSponsor: actions.addSponsor,
            removeSponsor: actions.removeSponsor,
            updateSponsor: actions.updateSponsor,
            deleteEvent: actions.deleteEvent,
          }}
        />
      )}

      {state.activeTab === 'blogs' && (
        <BlogsTab
          blogForms={state.blogForms}
          showBlogForm={state.showBlogForm}
          editMode={state.editMode}
          isSubmittingBlogs={state.isSubmittingBlogs}
          blogs={state.blogs}
          loadingBlogs={state.loadingBlogs}
          deletingItemId={state.deletingItemId}
          actions={{
            addBlogForm: actions.addBlogForm,
            removeBlogForm: actions.removeBlogForm,
            updateBlogForm: actions.updateBlogForm,
            handleEditBlog: actions.handleEditBlog,
            cancelBlogEdit: actions.cancelBlogEdit,
            handleBlogSubmit: actions.handleBlogSubmit,
            deleteBlog: actions.deleteBlog,
          }}
        />
      )}

      {state.activeTab === 'team-members' && (
        <TeamTab
          teamMemberForms={state.teamMemberForms}
          showTeamMemberForm={state.showTeamMemberForm}
          editMode={state.editMode}
          isSubmittingTeam={state.isSubmittingTeam}
          teamMembers={state.teamMembers}
          loadingTeamMembers={state.loadingTeamMembers}
          deletingItemId={state.deletingItemId}
          actions={{
            addTeamMemberForm: actions.addTeamMemberForm,
            removeTeamMemberForm: actions.removeTeamMemberForm,
            updateTeamMemberForm: actions.updateTeamMemberForm,
            handleEditTeamMember: actions.handleEditTeamMember,
            cancelTeamMemberEdit: actions.cancelTeamMemberEdit,
            handleTeamMemberSubmit: actions.handleTeamMemberSubmit,
            deleteTeamMember: actions.deleteTeamMember,
          }}
        />
      )}

      {state.activeTab === 'admins' && (
        <AdminsTab
          adminForms={state.adminForms}
          showAdminForm={state.showAdminForm}
          editMode={state.editMode}
          isSubmittingAdmins={state.isSubmittingAdmins}
          canManageAdmins={state.canManageAdmins}
          users={state.users}
          loadingUsers={state.loadingUsers}
          deletingItemId={state.deletingItemId}
          actions={{
            addAdminForm: actions.addAdminForm,
            removeAdminForm: actions.removeAdminForm,
            updateAdminForm: actions.updateAdminForm,
            handleEditAdmin: actions.handleEditAdmin,
            cancelAdminEdit: actions.cancelAdminEdit,
            handleAdminSubmit: actions.handleAdminSubmit,
            deleteUser: actions.deleteUser,
          }}
        />
      )}
    </DashboardLayout>
  );
}

// // export const dynamic = "force-dynamic";
