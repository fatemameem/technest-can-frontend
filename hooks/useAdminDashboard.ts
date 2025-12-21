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
    thumbnail: '',
    // Add these
    learnMoreLinks: [{ label: '', url: '' }],
    resourcesLinks: [{ label: '', url: '' }],
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
    sponsors: [''],
    // Add these fields
    thumbnail: '',
    thumbnailUrl: '',
    thumbnailFile: null,
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
    // Remove: imageLink: '',
    image: '',
    imageUrl: '',
    imageFile: null,
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

  // Delete confirmation state
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    itemId: string | null;
    itemType: 'podcast' | 'event' | 'blog' | 'team-member' | 'user' | null;
  }>({
    isOpen: false,
    itemId: null,
    itemType: null,
  });

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
      thumbnailFile: null,
      learnMoreLinks: [{ label: '', url: '' }],
      resourcesLinks: [{ label: '', url: '' }]
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

  const handleEditPodcast = useCallback((podcastId: string, podcastData: any) => {
    setEditMode(prev => ({ ...prev, podcasts: true }));
    setCurrentEditId(podcastId);

    // Extract thumbnail data correctly
    const thumbnailId = typeof podcastData.thumbnail === 'object' && podcastData.thumbnail?.id
      ? podcastData.thumbnail.id
      : typeof podcastData.thumbnail === 'string'
        ? podcastData.thumbnail
        : '';

    const thumbnailUrl = typeof podcastData.thumbnail === 'object' && podcastData.thumbnail?.cloudinary?.secureUrl
      ? podcastData.thumbnail.cloudinary.secureUrl
      : '';

    setPodcastForms([{
      title: podcastData.title || '',
      description: podcastData.description || '',
      linkedin: podcastData.socialLinks?.linkedin || '',
      instagram: podcastData.socialLinks?.instagram || '',
      drive: podcastData.driveLink || '',
      facebook: podcastData.socialLinks?.facebook || '',
      thumbnail: thumbnailId, // Media ID for database
      thumbnailUrl: thumbnailUrl, // URL for preview
      thumbnailFile: null,
      learnMoreLinks: podcastData.learnMoreLinks?.length
        ? podcastData.learnMoreLinks
        : [{ label: '', url: '' }],
      resourcesLinks: podcastData.resourcesLinks?.length
        ? podcastData.resourcesLinks
        : [{ label: '', url: '' }],
    }]);

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
      thumbnail: '',
      learnMoreLinks: [{ label: '', url: '' }],
      resourcesLinks: [{ label: '', url: '' }],
      thumbnailFile: null
    }]);
    setShowPodcastForm(false);
  }, []);

  // Fetch podcasts
  const fetchPodcasts = useCallback(async () => {
    try {
      setLoadingPodcasts(true);
      const response = await fetch('/api/admin/podcasts');
      if (response.ok) {
        const data = await response.json();
        setPodcasts(data.docs || []);
        // Note: No need to transform the data - keep the full thumbnail object
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

  const handlePodcastSubmit = useCallback(async () => {
    // Basic field validation
    for (let i = 0; i < podcastForms.length; i++) {
      const form = podcastForms[i];

      if (!isNonEmpty(form.title)) {
        toast?.error(`Podcast ${i + 1}: Title is required`);
        return;
      }

      if (!isNonEmpty(form.description)) {
        toast?.error(`Podcast ${i + 1}: Description is required`);
        return;
      }

      // Validate social links (optional but must be valid URLs if provided)
      if (form.linkedin && !isValidUrl(form.linkedin)) {
        toast?.error(`Podcast ${i + 1}: Invalid LinkedIn URL`);
        return;
      }
      if (form.instagram && !isValidUrl(form.instagram)) {
        toast?.error(`Podcast ${i + 1}: Invalid Instagram URL`);
        return;
      }
      if (form.facebook && !isValidUrl(form.facebook)) {
        toast?.error(`Podcast ${i + 1}: Invalid Facebook URL`);
        return;
      }
      if (form.drive && !isValidUrl(form.drive)) {
        toast?.error(`Podcast ${i + 1}: Invalid Drive URL`);
        return;
      }

      // Validate learnMoreLinks array
      for (let j = 0; j < form.learnMoreLinks.length; j++) {
        const link = form.learnMoreLinks[j];

        // Only validate if at least one field is filled (partial entry = error)
        const hasLabel = link.label?.trim();
        const hasUrl = link.url?.trim();

        if (hasLabel || hasUrl) {
          if (!hasLabel) {
            toast?.error(`Podcast ${i + 1}, Learn More Link ${j + 1}: Label is required`);
            return;
          }
          if (!hasUrl) {
            toast?.error(`Podcast ${i + 1}, Learn More Link ${j + 1}: URL is required`);
            return;
          }
          if (!isValidUrl(link.url)) {
            toast?.error(`Podcast ${i + 1}, Learn More Link ${j + 1}: Invalid URL`);
            return;
          }
        }
      }

      // Validate resourcesLinks array
      for (let j = 0; j < form.resourcesLinks.length; j++) {
        const link = form.resourcesLinks[j];

        const hasLabel = link.label?.trim();
        const hasUrl = link.url?.trim();

        if (hasLabel || hasUrl) {
          if (!hasLabel) {
            toast?.error(`Podcast ${i + 1}, Resource Link ${j + 1}: Label is required`);
            return;
          }
          if (!hasUrl) {
            toast?.error(`Podcast ${i + 1}, Resource Link ${j + 1}: URL is required`);
            return;
          }
          if (!isValidUrl(link.url)) {
            toast?.error(`Podcast ${i + 1}, Resource Link ${j + 1}: Invalid URL`);
            return;
          }
        }
      }
    }

    setIsSubmittingPodcasts(true);

    try {
      const podcastsData = podcastForms.map((form) => ({
        title: sanitize(form.title),
        description: sanitize(form.description),
        thumbnail: form.thumbnail, // Media ID
        linkedin: sanitize(form.linkedin),
        instagram: sanitize(form.instagram),
        facebook: sanitize(form.facebook),
        drive: sanitize(form.drive),
        // Filter out empty links and sanitize
        learnMoreLinks: form.learnMoreLinks
          .filter(link => link.label?.trim() && link.url?.trim())
          .map(link => ({
            label: sanitize(link.label),
            url: sanitize(link.url),
          })),
        resourcesLinks: form.resourcesLinks
          .filter(link => link.label?.trim() && link.url?.trim())
          .map(link => ({
            label: sanitize(link.label),
            url: sanitize(link.url),
          })),
      }));

      let response;
      if (editMode.podcasts && currentEditId) {
        // Update existing podcast
        response = await fetch(`/api/admin/podcasts/${currentEditId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(podcastsData[0]),
        });
      } else {
        // Create new podcasts (bulk)
        response = await fetch('/api/admin/podcasts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ podcasts: podcastsData }),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit podcasts');
      }

      toast?.success(
        editMode.podcasts
          ? 'Podcast updated successfully!'
          : `${podcastsData.length} podcast(s) created successfully!`
      );

      // Reset form
      setPodcastForms([{
        title: '',
        description: '',
        linkedin: '',
        instagram: '',
        drive: '',
        facebook: '',
        thumbnail: '',
        learnMoreLinks: [{ label: '', url: '' }],
        resourcesLinks: [{ label: '', url: '' }],
      }]);
      setShowPodcastForm(false);
      setEditMode({ ...editMode, podcasts: false });
      setCurrentEditId(null);

      // Refresh podcast list
      await fetchPodcasts();
    } catch (error) {
      console.error('Error submitting podcasts:', error);
      toast?.error(error instanceof Error ? error.message : 'Failed to submit podcasts');
    } finally {
      setIsSubmittingPodcasts(false);
    }
  }, [podcastForms, editMode, currentEditId, toast, fetchPodcasts]);

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
      sponsors: [''],
      // Add these fields
      thumbnail: '',
      thumbnailUrl: '',
      thumbnailFile: null,
    }]);
  }, [eventForms]);

  const removeEventForm = useCallback((index: number) => {
    if (eventForms.length > 1) {
      setEventForms(eventForms.filter((_, i) => i !== index));
    }
  }, [eventForms]);

  const updateEventForm = useCallback((index: number, field: keyof EventForm, value: string | string[] | File | null) => {
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
      sponsors: [''],
      // Add these fields
      thumbnail: '',
      thumbnailUrl: '',
      thumbnailFile: null,
    }]);
    setShowEventForm(false);
  }, []);

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

  const handleEventSubmit = useCallback(async () => {
    try {
      setIsSubmittingEvents(true);

      for (let i = 0; i < eventForms.length; i++) {
        const f = eventForms[i];
        // Updated validation - thumbnail is now optional but recommended
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
      console.log("Submitting events with timestamp:", ts);
      const entries: any[] = eventForms.map((f) => ({
        timestamp: String(ts),
        title: String(sanitize(f.title)),
        topic: String(sanitize(f.topic)),
        description: String(sanitize(f.description)),
        date: f.date,
        time: String(sanitize(f.time)),
        location: String(sanitize(f.location)),
        lumaLink: String(sanitize(f.lumaLink)),
        zoomLink: String(sanitize(f.zoomLink)),
        sponsors: (f.sponsors || [])
          .map(sanitize)
          .filter((s) => s.length > 0)
          .join(", "),
        // ✅ Fix: Only include thumbnail if it's a string (Media ID)
        // Don't try to sanitize if it's a File object
        ...(typeof f.thumbnail === 'string' && f.thumbnail
          ? { thumbnail: String(sanitize(f.thumbnail)) }
          : {}),
        // Don't include thumbnailFile or thumbnailUrl - they're client-side only
      }));
      console.log("Prepared event entries:", entries);

      let apiUrl = '/api/admin/events';
      let method = 'POST';

      if (editMode.events && currentEditId) {
        apiUrl = `/api/admin/events/${currentEditId}`;
        method = 'PUT';
        // Remove any potential _id field to avoid BSON errors
        const entryToUpdate = { ...entries[0] };
        delete entryToUpdate._id;

        const response = await fetch(apiUrl, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(entryToUpdate)
        });

        if (response.ok) {
          toast.success("Event updated successfully!");
          fetchEvents(); // Refresh the list
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to update event');
        }
      } else {
        const response = await fetch(apiUrl, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: entries })
        });

        if (response.ok) {
          toast.success(`${entries.length} event(s) submitted successfully!`);
          fetchEvents(); // Refresh the list
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create event(s)');
        }
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
        sponsors: [''],
        thumbnail: '',
        thumbnailUrl: '',
        thumbnailFile: null,
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
  }, [eventForms, editMode.events, currentEditId, fetchEvents]);

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

  // Team member handlers
  const addTeamMemberForm = useCallback(() => {
    setTeamMemberForms([...teamMemberForms, {
      name: '',
      email: '',
      designation: '',
      description: '',
      linkedin: '',
      twitter: '',
      github: '',
      website: '',
      // Remove: imageLink: '',
      image: '',
      imageUrl: '',
      imageFile: null,
    }]);
  }, [teamMemberForms]);

  const removeTeamMemberForm = useCallback((index: number) => {
    if (teamMemberForms.length > 1) {
      setTeamMemberForms(teamMemberForms.filter((_, i) => i !== index));
    }
  }, [teamMemberForms]);

  const updateTeamMemberForm = useCallback((
    index: number,
    field: keyof TeamMemberForm,
    value: string | File | null // Add File | null
  ) => {
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
      // Remove: imageLink: '',
      image: '',
      imageUrl: '',
      imageFile: null,
    }]);
    setShowTeamMemberForm(false);
  }, []);

  const handleTeamMemberSubmit = useCallback(async () => {
    try {
      setIsSubmittingTeam(true);

      for (let i = 0; i < teamMemberForms.length; i++) {
        const f = teamMemberForms[i];

        // Updated validation - only check for image (Media ID)
        if (
          !isNonEmpty(f.name) ||
          !isNonEmpty(f.email) ||
          !isNonEmpty(f.designation) ||
          !isNonEmpty(f.image) // Only require the new image field
        ) {
          toast.error(`Team member #${i + 1}: Name, Email, Designation, and Image are required.`);
          setIsSubmittingTeam(false);
          return;
        }

        const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim());
        if (!emailOk) {
          toast.error(`Team member #${i + 1}: Email is invalid.`);
          setIsSubmittingTeam(false);
          return;
        }

        // Validate optional URLs
        const optionalUrls: Array<[string, string]> = [
          [f.linkedin, "LinkedIn"],
          [f.twitter, "Twitter"],
          [f.github, "GitHub"],
          [f.website, "Website"],
        ];
        for (const [val, label] of optionalUrls) {
          if (isNonEmpty(val) && !isValidUrl(val)) {
            toast.error(`Team member #${i + 1}: ${label} must be a valid URL (http/https).`);
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
        // Only send Media ID
        image: String(sanitize(f.image)),
        // Don't include imageFile or imageUrl - they're client-side only
      }));

      let apiUrl = '/api/admin/team-members';
      let method = 'POST';

      if (editMode.teamMembers && currentEditId) {
        apiUrl = `/api/admin/team-members/${currentEditId}`;
        method = 'PUT';

        const response = await fetch(apiUrl, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(entries[0])
        });

        if (response.ok) {
          toast.success("Team member updated successfully!");
          fetchTeamMembers();
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to update team member');
        }
      } else {
        const response = await fetch(apiUrl, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(entries)
        });

        if (response.ok) {
          toast.success(`${entries.length} ${entries.length === 1 ? "member" : "members"} added successfully!`);
          fetchTeamMembers();
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create team member(s)');
        }
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
        // Remove: imageLink: '',
        image: '',
        imageUrl: '',
        imageFile: null,
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
  }, [teamMemberForms, editMode.teamMembers, currentEditId, fetchTeamMembers]);

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

  // Delete podcast
  const deletePodcast = useCallback((id: string) => {
    setDeleteConfirmation({
      isOpen: true,
      itemId: id,
      itemType: 'podcast',
    });
  }, []);

  // Delete event
  const deleteEvent = useCallback((id: string) => {
    setDeleteConfirmation({
      isOpen: true,
      itemId: id,
      itemType: 'event',
    });
  }, []);

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
  const deleteBlog = useCallback((id: string) => {
    setDeleteConfirmation({
      isOpen: true,
      itemId: id,
      itemType: 'blog',
    });
  }, []);

  // Delete team member
  const deleteTeamMember = useCallback((id: string) => {
    setDeleteConfirmation({
      isOpen: true,
      itemId: id,
      itemType: 'team-member',
    });
  }, []);

  // Delete user
  const deleteUser = useCallback((id: string) => {
    setDeleteConfirmation({
      isOpen: true,
      itemId: id,
      itemType: 'user',
    });
  }, []);

  // Confirm delete
  const confirmDelete = useCallback(async () => {
    const { itemId, itemType } = deleteConfirmation;
    if (!itemId || !itemType) return;

    setDeletingItemId(itemId);

    try {
      let url = '';
      let successMsg = '';
      let errorMsg = '';
      let refreshFn: () => void = () => { };

      switch (itemType) {
        case 'podcast':
          url = `/api/admin/podcasts/${itemId}`;
          successMsg = 'Podcast deleted successfully';
          errorMsg = 'Failed to delete podcast';
          refreshFn = fetchPodcasts;
          break;
        case 'event':
          url = `/api/admin/events/${itemId}`;
          successMsg = 'Event deleted successfully';
          errorMsg = 'Failed to delete event';
          refreshFn = fetchEvents;
          break;
        case 'blog':
          url = `/api/admin/blogs/${itemId}`;
          successMsg = 'Blog deleted successfully';
          errorMsg = 'Failed to delete blog';
          refreshFn = fetchBlogs;
          break;
        case 'team-member':
          url = `/api/admin/team-members/${itemId}`;
          successMsg = 'Team member deleted successfully';
          errorMsg = 'Failed to delete team member';
          refreshFn = fetchTeamMembers;
          break;
        case 'user':
          url = `/api/admin/users/${itemId}`;
          successMsg = 'User deleted successfully';
          errorMsg = 'Failed to delete user';
          refreshFn = fetchUsers;
          break;
      }

      if (url) {
        const response = await fetch(url, { method: 'DELETE' });

        if (response.ok) {
          toast.success(successMsg);
          refreshFn();
        } else {
          toast.error(errorMsg);
        }
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('An error occurred while deleting');
    } finally {
      setDeletingItemId(null);
      setDeleteConfirmation({ isOpen: false, itemId: null, itemType: null });
    }
  }, [deleteConfirmation, fetchPodcasts, fetchEvents, fetchBlogs, fetchTeamMembers, fetchUsers]);

  const cancelDelete = useCallback(() => {
    setDeleteConfirmation({ isOpen: false, itemId: null, itemType: null });
  }, []);

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

  // Add link to learnMoreLinks array
  const addLearnMoreLink = (podcastIndex: number) => {
    const updated = [...podcastForms];
    updated[podcastIndex].learnMoreLinks.push({ label: '', url: '' });
    setPodcastForms(updated);
  };

  // Remove link from learnMoreLinks array
  const removeLearnMoreLink = (podcastIndex: number, linkIndex: number) => {
    const updated = [...podcastForms];
    if (updated[podcastIndex].learnMoreLinks.length > 1) {
      updated[podcastIndex].learnMoreLinks.splice(linkIndex, 1);
      setPodcastForms(updated);
    }
  };

  // Update link in learnMoreLinks array
  const updateLearnMoreLink = (
    podcastIndex: number,
    linkIndex: number,
    field: 'label' | 'url',
    value: string
  ) => {
    const updated = [...podcastForms];
    updated[podcastIndex].learnMoreLinks[linkIndex][field] = value;
    setPodcastForms(updated);
  };

  // Same for resourcesLinks
  const addResourceLink = (podcastIndex: number) => {
    const updated = [...podcastForms];
    updated[podcastIndex].resourcesLinks.push({ label: '', url: '' });
    setPodcastForms(updated);
  };

  const removeResourceLink = (podcastIndex: number, linkIndex: number) => {
    const updated = [...podcastForms];
    if (updated[podcastIndex].resourcesLinks.length > 1) {
      updated[podcastIndex].resourcesLinks.splice(linkIndex, 1);
      setPodcastForms(updated);
    }
  };

  const updateResourceLink = (
    podcastIndex: number,
    linkIndex: number,
    field: 'label' | 'url',
    value: string
  ) => {
    const updated = [...podcastForms];
    updated[podcastIndex].resourcesLinks[linkIndex][field] = value;
    setPodcastForms(updated);
  };

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
      deleteConfirmation,
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
      getPageTitle,
      // Link handlers
      addLearnMoreLink,
      removeLearnMoreLink,
      updateLearnMoreLink,
      addResourceLink,
      removeResourceLink,
      updateResourceLink,
      confirmDelete,
      cancelDelete,
    }
  };
}