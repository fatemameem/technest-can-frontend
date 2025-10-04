'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { PodcastForm, EventForm, AdminForm, TeamMemberForm, Blog } from '@/types';
import { isNonEmpty, isValidUrl, sanitize, buildTimestamp, formatRelative } from '@/lib/admin/validation';
import { fetchStats } from '@/lib/admin/api';

export function useAdminDashboard() {
  const { data: session, status } = useSession();
  const role = (session?.user as any)?.role;

  // Form state
  const [podcastForms, setPodcastForms] = useState<PodcastForm[]>([{
    title: '',
    description: '',
    linkedin: '',
    instagram: '',
    drive: '',
    facebook: '',
    thumbnail: ''
  }]);

  const [eventForms, setEventForms] = useState<EventForm[]>([{
    title: '',
    topic: '',
    description: '',
    date: '',
    time: '',
    location: '',
    lumaLink: '',
    zoomLink: '',
    sponsors: ['']
  }]);

  const [adminForms, setAdminForms] = useState<AdminForm[]>([{
    name: '',
    email: '',
    role: ''
  }]);

  const [teamMemberForms, setTeamMemberForms] = useState<TeamMemberForm[]>([{
    name: '',
    email: '',
    designation: '',
    description: '',
    linkedin: '',
    twitter: '',
    github: '',
    website: '',
    imageLink: ''
  }]);

  const [blogForms, setBlogForms] = useState<Blog[]>([{ 
    title: '', 
    content: '', 
    coverImage: '', 
    author: '', 
    publishDate: '', 
    status: 'draft' 
  }]);

  // UI state
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form visibility state
  const [showPodcastForm, setShowPodcastForm] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [showTeamMemberForm, setShowTeamMemberForm] = useState(false);
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [showBlogForm, setShowBlogForm] = useState(false);
  
  // Edit mode state 
  const [editMode, setEditMode] = useState({
    podcasts: false,
    events: false,
    teamMembers: false,
    admins: false,
    blogs: false
  });
  
  // Current item being edited
  const [currentEditId, setCurrentEditId] = useState<string | null>(null);
  
  // Loading states
  const [isSubmittingPodcasts, setIsSubmittingPodcasts] = useState(false);
  const [isSubmittingEvents, setIsSubmittingEvents] = useState(false);
  const [isSubmittingAdmins, setIsSubmittingAdmins] = useState(false);
  const [isSubmittingTeam, setIsSubmittingTeam] = useState(false);
  const [isSubmittingBlogs, setIsSubmittingBlogs] = useState(false);
  
  // Stats state
  const [podcastCount, setPodcastCount] = useState<number | null>(null);
  const [eventCount, setEventCount] = useState<number | null>(null);
  const [blogCount, setBlogCount] = useState<number | null>(null);
  const [subscriberCount, setSubscriberCount] = useState<number | null>(null);
  const [lastPodcast, setLastPodcast] = useState<{ title: string; when: string } | null>(null);
  const [lastEvent, setLastEvent] = useState<{ title: string; when: string } | null>(null);
  const [lastBlog, setLastBlog] = useState<{ title: string; when: string } | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  // Newsletter state
  const [newsletterSettings, setNewsletterSettings] = useState({
    includePodcasts: true,
    includeEvents: true,
    includeReading: false,
    scheduleType: 'default'
  });

  // Pagination state
  const [pagination, setPagination] = useState({
    podcasts: { currentPage: 1, itemsPerPage: 10 },
    events: { currentPage: 1, itemsPerPage: 10 },
    teamMembers: { currentPage: 1, itemsPerPage: 10 },
    admins: { currentPage: 1, itemsPerPage: 10 }
  });

  // Podcasts state
  const [podcasts, setPodcasts] = useState<any[]>([]);
  const [loadingPodcasts, setLoadingPodcasts] = useState(false);

  // Events state
  const [events, setEvents] = useState<any[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);

  // Blogs state
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loadingBlogs, setLoadingBlogs] = useState(false);

  // Team members state
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [loadingTeamMembers, setLoadingTeamMembers] = useState(false);

  // Users state
  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Deleting state
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);

  // Derived state
  const canManageAdmins = role === "admin";
  const canManageContent = role === "admin" || role === "moderator";
  const loading = status === "loading";
  const showSearchBar = activeTab !== 'overview' && activeTab !== 'newsletter' && activeTab !== 'settings';

  // Load overview stats
  useEffect(() => {
    let mounted = true;
    async function run() {
      try {
        if (!session?.user) return;
        setStatsLoading(true);

        const stats = await fetchStats();
        if (!mounted) return;
        setPodcastCount(stats.podcastCount ?? 0);
        setEventCount(stats.eventCount ?? 0);
        setBlogCount(stats.blogCount ?? 0);
        setSubscriberCount(stats.subscriberCount ?? 0);
        setLastPodcast(stats.lastPodcast ? { 
          title: stats.lastPodcast.title, 
          when: formatRelative(Date.parse(stats.lastPodcast.when)) 
        } : null);
        setLastEvent(stats.lastEvent ? { 
          title: stats.lastEvent.title, 
          when: formatRelative(Date.parse(stats.lastEvent.when)) 
        } : null);
        setLastBlog(stats.lastBlog ? { 
          title: stats.lastBlog.title, 
          when: formatRelative(Date.parse(stats.lastBlog.when)) 
        } : null);
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted) setStatsLoading(false);
      }
    }
    run();
    return () => {
      mounted = false;
    };
  }, [session?.user]);

  // Podcast handlers
  const addPodcastForm = useCallback(() => {
    setPodcastForms(prev => [...prev, {
      title: '',
      description: '',
      linkedin: '',
      instagram: '',
      drive: '',
      facebook: '',
      thumbnail: '',
      thumbnailFile: null
    }]);
    setShowPodcastForm(true);
  }, []);

  const removePodcastForm = useCallback((index: number) => {
    if (podcastForms.length > 1) {
      setPodcastForms(podcastForms.filter((_, i) => i !== index));
    }
  }, [podcastForms]);

  const updatePodcastForm = useCallback((index: number, field: keyof PodcastForm, value: string) => {
    const updated = [...podcastForms];
    updated[index] = { ...updated[index], [field]: value };
    setPodcastForms(updated);
  }, [podcastForms]);

  const handleEditPodcast = useCallback((podcastId: string, podcastData: PodcastForm) => {
    setEditMode(prev => ({ ...prev, podcasts: true }));
    setCurrentEditId(podcastId);
    setPodcastForms([podcastData]);
    setShowPodcastForm(true);
    
    setTimeout(() => {
      document.querySelector('#podcast-form-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, []);

  const cancelPodcastEdit = useCallback(() => {
    setEditMode(prev => ({ ...prev, podcasts: false }));
    setCurrentEditId(null);
    setPodcastForms([{
      title: '',
      description: '',
      linkedin: '',
      instagram: '',
      drive: '',
      facebook: '',
      thumbnail: ''
    }]);
    setShowPodcastForm(false);
  }, []);

  const handlePodcastSubmit = useCallback(async () => {
    try {
      setIsSubmittingPodcasts(true);

      // Validation
      for (let i = 0; i < podcastForms.length; i++) {
        const f = podcastForms[i];

        // //cloudinary- modified validation to check thumbnail exists
        if (!isNonEmpty(f.title) || !isNonEmpty(f.description) || !isNonEmpty(f.thumbnail)) {
          toast.error(`Podcast #${i + 1}: Title, Description, and Thumbnail are required.`);
          setIsSubmittingPodcasts(false);
          return;
        }

        // //cloudinary- modified URL checks (removed thumbnail required validation)
        const urlChecks: Array<[string, string, boolean]> = [
          [f.drive, "Drive", false], // //cloudinary- made optional as upload creates a drive link
          [f.linkedin, "LinkedIn", false],
          [f.instagram, "Instagram", false],
          [f.facebook, "Facebook", false],
        ];

        for (const [val, label, requiredValid] of urlChecks) {
          if (requiredValid && !isValidUrl(val)) {
            toast.error(`Podcast #${i + 1}: ${label} must be a valid URL (http/https).`);
            setIsSubmittingPodcasts(false);
            return;
          }
          if (!requiredValid && isNonEmpty(val) && !isValidUrl(val)) {
            toast.error(`Podcast #${i + 1}: ${label} URL is invalid.`);
            setIsSubmittingPodcasts(false);
            return;
          }
        }
      }

      const ts = buildTimestamp();
      // //cloudinary- create entries without _id field to prevent BSON errors
      const entries: any[] = podcastForms.map((f) => ({
        timestamp: String(ts),
        title: String(sanitize(f.title)),
        description: String(sanitize(f.description)),
        linkedin: String(sanitize(f.linkedin)),
        instagram: String(sanitize(f.instagram)),
        drive: String(sanitize(f.drive)),
        facebook: String(sanitize(f.facebook)),
        thumbnail: String(sanitize(f.thumbnail)),
        // Don't include thumbnailFile as it's not needed in the DB
      }));
      
      let apiUrl = '/api/admin/podcasts';
      let method = 'POST';
      
      if (editMode.podcasts && currentEditId) {
        apiUrl = `/api/admin/podcasts/${currentEditId}`;
        method = 'PUT';
        // //cloudinary- remove any potential _id field to avoid BSON errors
        const entryToUpdate = { ...entries[0] };
        delete entryToUpdate._id;
        await fetch(apiUrl, { 
          method, 
          headers: { 'Content-Type': 'application/json' }, 
          body: JSON.stringify(entryToUpdate) 
        });
        toast.success("Podcast updated successfully!");
      } else {
        console.log('Submitting podcasts:', entries);
        await fetch(apiUrl, { 
          method, 
          headers: { 'Content-Type': 'application/json' }, 
          body: JSON.stringify(entries) 
        });
        toast.success(`${entries.length} podcast(s) submitted successfully!`);
      }
      
      setPodcastForms([{
        title: '',
        description: '',
        linkedin: '',
        instagram: '',
        drive: '',
        facebook: '',
        thumbnail: '',
        // //cloudinary- reset the thumbnailFile
        thumbnailFile: null
      }]);
      setEditMode(prev => ({ ...prev, podcasts: false }));
      setCurrentEditId(null);
      setShowPodcastForm(false);
      
    } catch (err: any) {
      console.error(err);
      toast.error(`Failed to submit podcasts. ${err?.message ?? ""}`.trim());
    } finally {
      setIsSubmittingPodcasts(false);
    }
  }, [podcastForms, editMode.podcasts, currentEditId]);

  // Event handlers
  const addEventForm = useCallback(() => {
    setEventForms([...eventForms, {
      title: '',
      topic: '',
      description: '',
      date: '',
      time: '',
      location: '',
      lumaLink: '',
      zoomLink: '',
      sponsors: ['']
    }]);
  }, [eventForms]);

  const removeEventForm = useCallback((index: number) => {
    if (eventForms.length > 1) {
      setEventForms(eventForms.filter((_, i) => i !== index));
    }
  }, [eventForms]);

  const updateEventForm = useCallback((index: number, field: keyof EventForm, value: string | string[]) => {
    const updated = [...eventForms];
    updated[index] = { ...updated[index], [field]: value };
    setEventForms(updated);
  }, [eventForms]);

  const addSponsor = useCallback((eventIndex: number) => {
    const updated = [...eventForms];
    updated[eventIndex].sponsors.push('');
    setEventForms(updated);
  }, [eventForms]);

  const removeSponsor = useCallback((eventIndex: number, sponsorIndex: number) => {
    const updated = [...eventForms];
    if (updated[eventIndex].sponsors.length > 1) {
      updated[eventIndex].sponsors.splice(sponsorIndex, 1);
      setEventForms(updated);
    }
  }, [eventForms]);

  const updateSponsor = useCallback((eventIndex: number, sponsorIndex: number, value: string) => {
    const updated = [...eventForms];
    updated[eventIndex].sponsors[sponsorIndex] = value;
    setEventForms(updated);
  }, [eventForms]);

  const handleEditEvent = useCallback((eventId: string, eventData: EventForm) => {
    setEditMode(prev => ({ ...prev, events: true }));
    setCurrentEditId(eventId);
    setEventForms([eventData]);
    setShowEventForm(true);
    
    setTimeout(() => {
      document.querySelector('#event-form-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, []);

  const cancelEventEdit = useCallback(() => {
    setEditMode(prev => ({ ...prev, events: false }));
    setCurrentEditId(null);
    setEventForms([{
      title: '',
      topic: '',
      description: '',
      date: '',
      time: '',
      location: '',
      lumaLink: '',
      zoomLink: '',
      sponsors: ['']
    }]);
    setShowEventForm(false);
  }, []);

  const handleEventSubmit = useCallback(async () => {
    try {
      setIsSubmittingEvents(true);

      for (let i = 0; i < eventForms.length; i++) {
        const f = eventForms[i];

        if (
          !isNonEmpty(f.title) ||
          !isNonEmpty(f.topic) ||
          !isNonEmpty(f.description) ||
          !isNonEmpty(f.date) ||
          !isNonEmpty(f.time) ||
          !isNonEmpty(f.location)
        ) {
          toast.error(`Event #${i + 1}: Title, Topic, Description, Date, Time, and Location are required.`);
          setIsSubmittingEvents(false);
          return;
        }

        const optionalUrls: Array<[string, string]> = [
          [f.lumaLink, "Lu.ma Link"],
          [f.zoomLink, "Zoom Link"],
        ];
        for (const [val, label] of optionalUrls) {
          if (isNonEmpty(val) && !isValidUrl(val)) {
            toast.error(`Event #${i + 1}: ${label} must be a valid URL (http/https).`);
            setIsSubmittingEvents(false);
            return;
          }
        }
      }

      const ts = buildTimestamp();
      const entries: any[] = eventForms.map((f) => ({
        timestamp: String(ts),
        title: String(sanitize(f.title)),
        topic: String(sanitize(f.topic)),
        description: String(sanitize(f.description)),
        date: String(sanitize(f.date)),
        time: String(sanitize(f.time)),
        location: String(sanitize(f.location)),
        lumaLink: String(sanitize(f.lumaLink)),
        zoomLink: String(sanitize(f.zoomLink)),
        sponsors: (f.sponsors || [])
          .map(sanitize)
          .filter((s) => s.length > 0)
          .join(", "),
      }));

      let apiUrl = '/api/admin/events';
      let method = 'POST';
      
      if (editMode.events && currentEditId) {
        apiUrl = `/api/admin/events/${currentEditId}`;
        method = 'PUT';
        await fetch(apiUrl, { 
          method, 
          headers: { 'Content-Type': 'application/json' }, 
          body: JSON.stringify(entries[0]) 
        });
        toast.success("Event updated successfully!");
      } else {
        await fetch(apiUrl, { 
          method, 
          headers: { 'Content-Type': 'application/json' }, 
          body: JSON.stringify(entries) 
        });
        toast.success(`${entries.length} event(s) submitted successfully!`);
      }
      
      setEventForms([{
        title: '',
        topic: '',
        description: '',
        date: '',
        time: '',
        location: '',
        lumaLink: '',
        zoomLink: '',
        sponsors: ['']
      }]);
      setEditMode(prev => ({ ...prev, events: false }));
      setCurrentEditId(null);
      setShowEventForm(false);
      
    } catch (err: any) {
      console.error(err);
      toast.error(`Failed to submit events. ${err?.message ?? ""}`.trim());
    } finally {
      setIsSubmittingEvents(false);
    }
  }, [eventForms, editMode.events, currentEditId]);

  // Admin handlers
  const addAdminForm = useCallback(() => {
    if (!showAdminForm) {
      setAdminForms([{
        name: '',
        email: '',
        role: ''
      }]);
    } else {
      setAdminForms([...adminForms, {
        name: '',
        email: '',
        role: ''
      }]);
    }
    
    setEditMode(prev => ({ ...prev, admins: false }));
    setCurrentEditId(null);
    setShowAdminForm(true);
  }, [showAdminForm, adminForms]);

  const removeAdminForm = useCallback((index: number) => {
    if (adminForms.length > 1) {
      setAdminForms(adminForms.filter((_, i) => i !== index));
    }
  }, [adminForms]);

  const updateAdminForm = useCallback((index: number, field: keyof AdminForm, value: string) => {
    const updated = [...adminForms];
    updated[index] = { ...updated[index], [field]: value };
    setAdminForms(updated);
  }, [adminForms]);

  const handleEditAdmin = useCallback((adminId: string, adminData: AdminForm) => {
    setEditMode(prev => ({ ...prev, admins: true }));
    setCurrentEditId(adminId);
    setAdminForms([adminData]); // Set the form data to the admin being edited
    setShowAdminForm(true); // Show the form
    
    setTimeout(() => {
      document.querySelector('#admin-form-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, []);

  const cancelAdminEdit = useCallback(() => {
    setEditMode(prev => ({ ...prev, admins: false }));
    setCurrentEditId(null);
    setAdminForms([{ name: '', email: '', role: '' }]);
    setShowAdminForm(false);
  }, []);

  // Fetch users
  const fetchUsers = useCallback(async () => {
    try {
      setLoadingUsers(true);
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.docs || []);
      } else {
        console.error('Failed to fetch users:', response.status);
        toast.error('Failed to load users');
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  const handleAdminSubmit = useCallback(async () => {
    try {
      if (!canManageAdmins) {
        toast.error("Only admins can add admins or moderators.");
        return;
      }
      
      setIsSubmittingAdmins(true);
      
      // Validate form fields
      for (let i = 0; i < adminForms.length; i++) {
        const f = adminForms[i];
        if (!f.name || !f.email || !f.role) {
          toast.error(`Admin #${i + 1}: Name, Email, and Role are required.`);
          setIsSubmittingAdmins(false);
          return;
        }
        
        // Basic email format check
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) {
          toast.error(`Admin #${i + 1}: Email is invalid.`);
          setIsSubmittingAdmins(false);
          return;
        }
      }
      
      if (editMode.admins && currentEditId) {
        // Update existing admin
        const response = await fetch(`/api/admin/users/${currentEditId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(adminForms[0]),
        });
        
        if (response.ok) {
          toast.success('Admin updated successfully');
          fetchUsers(); // Refresh the list
          setShowAdminForm(false); // Hide the form
          setEditMode(prev => ({ ...prev, admins: false }));
          setCurrentEditId(null);
          setAdminForms([{ name: '', email: '', role: '' }]); // Reset form
        } else {
          toast.error('Failed to update admin');
        }
      } else {
        // Create new admin(s)
        const response = await fetch('/api/admin/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(adminForms),
        });
        
        if (response.ok) {
          toast.success(`${adminForms.length} admin(s) added successfully`);
          fetchUsers(); // Refresh the list
          setShowAdminForm(false); // Hide the form
          setAdminForms([{ name: '', email: '', role: '' }]); // Reset form
        } else {
          toast.error('Failed to add admin(s)');
        }
      }
    } catch (error) {
      console.error('Error submitting admin form:', error);
      toast.error('An error occurred while saving admin data');
    } finally {
      setIsSubmittingAdmins(false);
    }
  }, [adminForms, canManageAdmins, currentEditId, editMode.admins, fetchUsers]);

  // Team member handlers
  const addTeamMemberForm = useCallback(() => {
    if (!showTeamMemberForm) {
      setTeamMemberForms([{
        name: '',
        email: '',
        designation: '',
        description: '',
        linkedin: '',
        twitter: '',
        github: '',
        website: '',
        imageLink: ''
      }]);
    } else {
      setTeamMemberForms([...teamMemberForms, {
        name: '',
        email: '',
        designation: '',
        description: '',
        linkedin: '',
        twitter: '',
        github: '',
        website: '',
        imageLink: ''
      }]);
    }
    
    setEditMode(prev => ({ ...prev, teamMembers: false }));
    setCurrentEditId(null);
    setShowTeamMemberForm(true);
  }, [showTeamMemberForm, teamMemberForms]);

  const removeTeamMemberForm = useCallback((index: number) => {
    if (teamMemberForms.length > 1) {
      setTeamMemberForms(teamMemberForms.filter((_, i) => i !== index));
    }
  }, [teamMemberForms]);

  const updateTeamMemberForm = useCallback((index: number, field: keyof TeamMemberForm, value: string) => {
    const updated = [...teamMemberForms];
    updated[index] = { ...updated[index], [field]: value };
    setTeamMemberForms(updated);
  }, [teamMemberForms]);

  const handleEditTeamMember = useCallback((teamMemberId: string, teamMemberData: TeamMemberForm) => {
    setEditMode(prev => ({ ...prev, teamMembers: true }));
    setCurrentEditId(teamMemberId);
    setTeamMemberForms([teamMemberData]);
    setShowTeamMemberForm(true);
    
    setTimeout(() => {
      document.querySelector('#team-member-form-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, []);

  const cancelTeamMemberEdit = useCallback(() => {
    setEditMode(prev => ({ ...prev, teamMembers: false }));
    setCurrentEditId(null);
    setTeamMemberForms([{
      name: '',
      email: '',
      designation: '',
      description: '',
      linkedin: '',
      twitter: '',
      github: '',
      website: '',
      imageLink: ''
    }]);
    setShowTeamMemberForm(false);
  }, []);

  const handleTeamMemberSubmit = useCallback(async () => {
    try {
      setIsSubmittingTeam(true);

      for (let i = 0; i < teamMemberForms.length; i++) {
        const f = teamMemberForms[i];

        if (!isNonEmpty(f.name) || !isNonEmpty(f.email) || !isNonEmpty(f.designation) || !isNonEmpty(f.imageLink)) {
          toast.error(`Team member #${i + 1}: Name, Email, Designation, and Profile Image URL are required.`);
          setIsSubmittingTeam(false);
          return;
        }
        const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim());
        if (!emailOk) {
          toast.error(`Team member #${i + 1}: Email is invalid.`);
          setIsSubmittingTeam(false);
          return;
        }

        const urlChecks: Array<[string, string, boolean]> = [
          [f.imageLink, "Profile Image URL", true],
          [f.linkedin, "LinkedIn", false],
          [f.twitter, "Twitter", false],
          [f.github, "GitHub", false],
          [f.website, "Website", false],
        ];
        for (const [val, label, requiredValid] of urlChecks) {
          if (requiredValid && !isValidUrl(val)) {
            toast.error(`Team member #${i + 1}: ${label} must be a valid URL (http/https).`);
            setIsSubmittingTeam(false);
            return;
          }
          if (!requiredValid && isNonEmpty(val) && !isValidUrl(val)) {
            toast.error(`Team member #${i + 1}: ${label} URL is invalid.`);
            setIsSubmittingTeam(false);
            return;
          }
        }
      }

      const ts = buildTimestamp();
      const entries = teamMemberForms.map((f) => ({
        timestamp: String(ts),
        name: String(sanitize(f.name)),
        email: String(sanitize(f.email)).toLowerCase(),
        designation: String(sanitize(f.designation)),
        description: String(sanitize(f.description)),
        linkedIn: String(sanitize(f.linkedin)),
        twitter: String(sanitize(f.twitter)),
        github: String(sanitize(f.github)),
        website: String(sanitize(f.website)),
        imageLink: String(sanitize(f.imageLink)),
      }));

      let apiUrl = '/api/admin/team-members';
      let method = 'POST';
      
      if (editMode.teamMembers && currentEditId) {
        apiUrl = `/api/admin/team-members/${currentEditId}`;
        method = 'PUT';
        await fetch(apiUrl, { 
          method, 
          headers: { 'Content-Type': 'application/json' }, 
          body: JSON.stringify(entries[0]) 
        });
        toast.success("Team member updated successfully!");
      } else {
        await fetch(apiUrl, { 
          method, 
          headers: { 'Content-Type': 'application/json' }, 
          body: JSON.stringify(entries) 
        });
        toast.success(`${entries.length} ${entries.length === 1 ? "member" : "members"} added to teamInfo.`);
      }
      
      setTeamMemberForms([{
        name: '',
        email: '',
        designation: '',
        description: '',
        linkedin: '',
        twitter: '',
        github: '',
        website: '',
        imageLink: ''
      }]);
      setEditMode(prev => ({ ...prev, teamMembers: false }));
      setCurrentEditId(null);
      setShowTeamMemberForm(false);
      
    } catch (err: any) {
      console.error(err);
      toast.error(`Failed to submit team members. ${err?.message ?? ""}`.trim());
    } finally {
      setIsSubmittingTeam(false);
    }
  }, [teamMemberForms, editMode.teamMembers, currentEditId]);

  // Blog handlers
  const addBlogForm = useCallback(() => {
    setBlogForms([...blogForms, {
      title: '',
      content: '',
      coverImage: '',
      author: '',
      publishDate: '',
      status: 'draft'
    }]);
  }, [blogForms]);

  const removeBlogForm = useCallback((index: number) => {
    if (blogForms.length > 1) {
      setBlogForms(blogForms.filter((_, i) => i !== index));
    }
  }, [blogForms]);

  const updateBlogForm = useCallback((index: number, field: keyof Blog, value: string) => {
    const updated = [...blogForms];
    updated[index] = { ...updated[index], [field]: value };
    setBlogForms(updated);
  }, [blogForms]);

  const handleBlogSubmit = useCallback(async () => {
    try {
      setIsSubmittingBlogs(true);

      for (let i = 0; i < blogForms.length; i++) {
        const f = blogForms[i];

        if (!isNonEmpty(f.title) || !isNonEmpty(f.content) || !isNonEmpty(f.author)) {
          toast.error(`Blog #${i + 1}: Title, Content, and Author are required.`);
          setIsSubmittingBlogs(false);
          return;
        }

        if (isNonEmpty(f.coverImage) && !isValidUrl(f.coverImage)) {
          toast.error(`Blog #${i + 1}: Cover Image must be a valid URL (http/https).`);
          setIsSubmittingBlogs(false);
          return;
        }
      }

      const ts = buildTimestamp();
      const entries: any[] = blogForms.map((f) => ({
        timestamp: String(ts),
        title: String(sanitize(f.title)),
        content: String(sanitize(f.content)),
        coverImage: String(sanitize(f.coverImage)),
        author: String(sanitize(f.author)),
        publishDate: String(sanitize(f.publishDate)),
        status: String(sanitize(f.status)),
      }));

      await fetch('/api/admin/blogs', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(entries) 
      });

      toast.success(`${entries.length} blog(s) submitted successfully!`);
    } catch (err: any) {
      console.error(err);
      toast.error(`Failed to submit blogs. ${err?.message ?? ""}`.trim());
    } finally {
      setIsSubmittingBlogs(false);
    }
  }, [blogForms]);

  const handleEditBlog = useCallback((blogId: string, blogData: Blog) => {
    setEditMode(prev => ({ ...prev, blogs: true }));
    setCurrentEditId(blogId);
    setBlogForms([blogData]);
    setShowBlogForm(true);
    
    setTimeout(() => {
      document.querySelector('#blog-form-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, []);

  const cancelBlogEdit = useCallback(() => {
    setEditMode(prev => ({ ...prev, blogs: false }));
    setCurrentEditId(null);
    setBlogForms([{
      title: '',
      content: '',
      coverImage: '',
      author: '',
      publishDate: '',
      status: 'draft'
    }]);
    setShowBlogForm(false);
  }, []);

  // Fetch podcasts
  const fetchPodcasts = useCallback(async () => {
    try {
      setLoadingPodcasts(true);
      const response = await fetch('/api/admin/podcasts');
      if (response.ok) {
        const data = await response.json();
        setPodcasts(data.docs || []);
      } else {
        console.error('Failed to fetch podcasts:', response.status);
        toast.error('Failed to load podcasts');
      }
    } catch (error) {
      console.error('Failed to fetch podcasts:', error);
      toast.error('Failed to load podcasts');
    } finally {
      setLoadingPodcasts(false);
    }
  }, []);

  // Delete podcast
  const deletePodcast = useCallback(async (id: string) => {
    if (!confirm('Are you sure you want to delete this podcast?')) return;
    
    try {
      setDeletingItemId(id);
      const response = await fetch(`/api/admin/podcasts/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        toast.success('Podcast deleted successfully');
        fetchPodcasts(); // Refresh the list
      } else {
        toast.error('Failed to delete podcast');
      }
    } catch (error) {
      console.error('Failed to delete podcast:', error);
      toast.error('Failed to delete podcast');
    } finally {
      setDeletingItemId(null);
    }
  }, [fetchPodcasts]);

  // Fetch events
  const fetchEvents = useCallback(async () => {
    try {
      setLoadingEvents(true);
      const response = await fetch('/api/admin/events');
      if (response.ok) {
        const data = await response.json();
        setEvents(data.docs || []);
      } else {
        console.error('Failed to fetch events:', response.status);
        toast.error('Failed to load events');
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
      toast.error('Failed to load events');
    } finally {
      setLoadingEvents(false);
    }
  }, []);

  // Delete event
  const deleteEvent = useCallback(async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    
    try {
      setDeletingItemId(id);
      const response = await fetch(`/api/admin/events/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        toast.success('Event deleted successfully');
        fetchEvents(); // Refresh the list
      } else {
        toast.error('Failed to delete event');
      }
    } catch (error) {
      console.error('Failed to delete event:', error);
      toast.error('Failed to delete event');
    } finally {
      setDeletingItemId(null);
    }
  }, [fetchEvents]);

  // Fetch blogs
  const fetchBlogs = useCallback(async () => {
    try {
      setLoadingBlogs(true);
      const response = await fetch('/api/admin/blogs');
      if (response.ok) {
        const data = await response.json();
        setBlogs(data.docs || []);
      } else {
        console.error('Failed to fetch blogs:', response.status);
        toast.error('Failed to load blogs');
      }
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
      toast.error('Failed to load blogs');
    } finally {
      setLoadingBlogs(false);
    }
  }, []);

  // Delete blog
  const deleteBlog = useCallback(async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog?')) return;
    
    try {
      setDeletingItemId(id);
      const response = await fetch(`/api/admin/blogs/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        toast.success('Blog deleted successfully');
        fetchBlogs(); // Refresh the list
      } else {
        toast.error('Failed to delete blog');
      }
    } catch (error) {
      console.error('Failed to delete blog:', error);
      toast.error('Failed to delete blog');
    } finally {
      setDeletingItemId(null);
    }
  }, [fetchBlogs]);

  // Fetch team members
  const fetchTeamMembers = useCallback(async () => {
    try {
      setLoadingTeamMembers(true);
      const response = await fetch('/api/admin/team-members');
      if (response.ok) {
        const data = await response.json();
        setTeamMembers(data.docs || []);
      } else {
        console.error('Failed to fetch team members:', response.status);
        toast.error('Failed to load team members');
      }
    } catch (error) {
      console.error('Failed to fetch team members:', error);
      toast.error('Failed to load team members');
    } finally {
      setLoadingTeamMembers(false);
    }
  }, []);

  // Delete team member
  const deleteTeamMember = useCallback(async (id: string) => {
    if (!confirm('Are you sure you want to delete this team member?')) return;
    
    try {
      setDeletingItemId(id);
      const response = await fetch(`/api/admin/team-members/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        toast.success('Team member deleted successfully');
        fetchTeamMembers(); // Refresh the list
      } else {
        toast.error('Failed to delete team member');
      }
    } catch (error) {
      console.error('Failed to delete team member:', error);
      toast.error('Failed to delete team member');
    } finally {
      setDeletingItemId(null);
    }
  }, [fetchTeamMembers]);

  // Delete user
  const deleteUser = useCallback(async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      setDeletingItemId(id);
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        toast.success('User deleted successfully');
        fetchUsers(); // Refresh the list
      } else {
        toast.error('Failed to delete user');
      }
    } catch (error) {
      console.error('Failed to delete user:', error);
      toast.error('Failed to delete user');
    } finally {
      setDeletingItemId(null);
    }
  }, [fetchUsers]);

  // Effects
  useEffect(() => {
    if (activeTab === 'podcasts') {
      fetchPodcasts();
    } else if (activeTab === 'events') {
      fetchEvents();
    } else if (activeTab === 'blogs') {
      fetchBlogs();
    } else if (activeTab === 'team-members') {
      fetchTeamMembers();
    } else if (activeTab === 'admins') {
      fetchUsers();
    }
  }, [activeTab, fetchPodcasts, fetchEvents, fetchBlogs, fetchTeamMembers, fetchUsers]);

  // Utility
  const getPageTitle = useCallback(() => {
    const sidebarItems = [
      { id: 'overview', label: 'Overview' },
      { id: 'podcasts', label: 'Podcasts' },
      { id: 'events', label: 'Events' },
      { id: 'blogs', label: 'Blogs' },
      { id: 'team-members', label: 'Team Members' },
      { id: 'admins', label: 'Admins' },
    ];
    const item = sidebarItems.find(item => item.id === activeTab);
    return item ? `Manage ${item.label}` : 'Admin Dashboard';
  }, [activeTab]);

  return {
    state: {
      session,
      status,
      role,
      canManageAdmins,
      canManageContent,
      loading,
      activeTab,
      searchQuery,
      showSearchBar,
      showPodcastForm,
      showEventForm,
      showTeamMemberForm,
      showAdminForm,
      showBlogForm,
      editMode,
      currentEditId,
      podcastForms,
      eventForms,
      adminForms,
      teamMemberForms,
      blogForms,
      isSubmittingPodcasts,
      isSubmittingEvents,
      isSubmittingAdmins,
      isSubmittingTeam,
      isSubmittingBlogs,
      podcastCount,
      eventCount,
      blogCount,
      subscriberCount,
      lastPodcast,
      lastEvent,
      lastBlog,
      statsLoading,
      newsletterSettings,
      pagination,
      podcasts,
      loadingPodcasts,
      events,
      loadingEvents,
      blogs,
      loadingBlogs,
      teamMembers,
      loadingTeamMembers,
      users,
      loadingUsers,
      deletingItemId,
    },
    actions: {
      setActiveTab,
      setSearchQuery,
      setShowPodcastForm,
      setShowEventForm,
      setShowTeamMemberForm,
      setShowAdminForm,
      setShowBlogForm,
      addPodcastForm,
      removePodcastForm,
      updatePodcastForm,
      handleEditPodcast,
      cancelPodcastEdit,
      handlePodcastSubmit,
      addEventForm,
      removeEventForm,
      updateEventForm,
      addSponsor,
      removeSponsor,
      updateSponsor,
      handleEditEvent,
      cancelEventEdit,
      handleEventSubmit,
      addAdminForm,
      removeAdminForm,
      updateAdminForm,
      handleEditAdmin,
      cancelAdminEdit,
      handleAdminSubmit,
      addTeamMemberForm,
      removeTeamMemberForm,
      updateTeamMemberForm,
      handleEditTeamMember,
      cancelTeamMemberEdit,
      handleTeamMemberSubmit,
      addBlogForm,
      removeBlogForm,
      updateBlogForm,
      handleBlogSubmit,
      handleEditBlog,
      cancelBlogEdit,
      setNewsletterSettings: (settings: any) => setNewsletterSettings(settings),
      fetchPodcasts,
      deletePodcast,
      fetchEvents,
      deleteEvent,
      fetchBlogs,
      deleteBlog,
      fetchTeamMembers,
      deleteTeamMember,
      fetchUsers,
      deleteUser,
      getPageTitle
    }
  };
}