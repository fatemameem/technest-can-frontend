// export { default } from '../userAdmin/page'
'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { 
  Plus, 
  Trash2, 
  Save, 
  Calendar, 
  Mic, 
  Users, 
  BarChart3,
  UserPlus, 
  Shield, 
  Crown,
  Search,
  Mail,
  FileText,
  ChevronLeft,
  ChevronRight,
  Edit
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { signIn, signOut, useSession } from 'next-auth/react';
import PodcastFormCard from '@/components/admin/forms/PodcastFormCard';
import EventFormCard from '@/components/admin/forms/EventFormCard';
import TeamMemberFormCard from '@/components/admin/forms/TeamMemberFormCard';
import OverviewSection from '@/components/admin/OverviewSection';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface PodcastForm {
  title: string;
  description: string;
  linkedin: string;
  instagram: string;
  drive: string;
  facebook: string;
  thumbnail: string;
}


interface EventForm {
  title: string;
  topic: string;
  description: string;
  date: string;
  time: string;
  location: string;
  lumaLink: string;
  zoomLink: string;
  sponsors: string[];
}

interface AdminForm {
  name: string;
  email: string;
  role: 'admin' | 'moderator' | '';
}

interface Blog {
  title: string;
  content: string;
  coverImage: string;
  author: string;
  publishDate: string;
  status: 'draft' | 'published' | 'archived' | '';
}

interface TeamMemberForm {
  name: string;
  email: string;
  designation: string;
  description: string;
  linkedin: string;
  twitter: string;
  github: string;
  website: string;
  imageLink: string;
}

// -------- Helper utilities (validation, timestamp, posting) --------
const isNonEmpty = (s: string | undefined | null) => !!s && s.trim().length > 0;

const isValidUrl = (s: string | undefined | null) => {
  if (!isNonEmpty(s || "")) return true; // treat empty as valid for optional fields
  try {
    const u = new URL((s || "").trim());
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
};

const sanitize = (s: string | undefined | null) => (s || "").trim();

const buildTimestamp = () => new Date().toISOString();

// -------- Payload-backed admin API helpers --------
async function createPodcasts(entries: any | any[]) {
  const items = Array.isArray(entries) ? entries : [entries];
  const res = await fetch('/api/admin/podcasts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(items) });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function createEvents(entries: any | any[]) {
  const items = Array.isArray(entries) ? entries : [entries];
  const res = await fetch('/api/admin/events', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(items) });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function createTeamMembers(entries: any | any[]) {
  const items = Array.isArray(entries) ? entries : [entries];
  const res = await fetch('/api/admin/team-members', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(items) });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function upsertUsers(entries: any | any[]) {
  const items = Array.isArray(entries) ? entries : [entries];
  const res = await fetch('/api/admin/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(items) });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function createBlogs(entries: any | any[]) {
  const items = Array.isArray(entries) ? entries : [entries];
  const res = await fetch('/api/admin/blogs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(items) });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function fetchStats() {
  const res = await fetch('/api/admin/stats', { cache: 'no-store' });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function fetchPodcasts(params: any) {
  const res = await fetch(`/api/admin/podcasts?${new URLSearchParams(params)}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

const parseWhen = (v: any): number => {
  // try ISO/date first, then numeric id fallback
  const s = String(v ?? "");
  const t = Date.parse(s);
  if (!Number.isNaN(t)) return t;
  const n = Number(s);
  if (!Number.isNaN(n)) return n;
  return 0;
};

// Human-readable "time ago" formatter
const formatRelative = (ms: number): string => {
  if (!ms) return "—";
  const diff = Date.now() - ms;
  if (diff < 0) return "Just now";
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < minute) return "Just now";
  if (diff < hour) {
    const mins = Math.floor(diff / minute);
    return mins === 1 ? "1 min ago" : `${mins} mins ago`;
  }
  if (diff < day) {
    const hrs = Math.floor(diff / hour);
    return hrs === 1 ? "1 hour ago" : `${hrs} hours ago`;
  }
  const days = Math.floor(diff / day);
  return days === 1 ? "1 day ago" : `${days} days ago`;
};


export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const role = (session?.user as any)?.role;

  // All state hooks must be declared before any conditional returns (Rules of Hooks)
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

  const [activeTab, setActiveTab] = useState('overview');
  const [isSubmittingPodcasts, setIsSubmittingPodcasts] = useState(false);
  const [isSubmittingEvents, setIsSubmittingEvents] = useState(false);
  const [isSubmittingAdmins, setIsSubmittingAdmins] = useState(false);
  const [isSubmittingTeam, setIsSubmittingTeam] = useState(false);
  
  // Form visibility state
  const [showPodcastForm, setShowPodcastForm] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [showTeamMemberForm, setShowTeamMemberForm] = useState(false);
  const [showAdminForm, setShowAdminForm] = useState(false);
  
  // Edit mode state 
  const [editMode, setEditMode] = useState({
    podcasts: false,
    events: false,
    teamMembers: false,
    admins: false
  });
  
  // Current item being edited
  const [currentEditId, setCurrentEditId] = useState<string | null>(null);
  
  // -------- Stats state for Overview --------
  const [podcastCount, setPodcastCount] = useState<number | null>(null);
  const [eventCount, setEventCount] = useState<number | null>(null);
  const [subscriberCount, setSubscriberCount] = useState<number | null>(null);
  const [lastPodcast, setLastPodcast] = useState<{ title: string; when: string } | null>(null);
  const [lastEvent, setLastEvent] = useState<{ title: string; when: string } | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  // Define searchQuery state for search functionality
  const [searchQuery, setSearchQuery] = useState('');
  
  // Blog state
  const [blogForms, setBlogForms] = useState<Blog[]>([{ title: '', content: '', coverImage: '', author: '', publishDate: '', status: 'draft' }]);
  const [isSubmittingBlogs, setIsSubmittingBlogs] = useState(false);

  // Newsletter state
  const [newsletterSettings, setNewsletterSettings] = useState({
    includePodcasts: true,
    includeEvents: true,
    includeReading: false,
    scheduleType: 'default' // 'default' or 'custom'
  });

  // Pagination state
  const [pagination, setPagination] = useState({
    podcasts: { currentPage: 1, itemsPerPage: 10 },
    events: { currentPage: 1, itemsPerPage: 10 },
    teamMembers: { currentPage: 1, itemsPerPage: 10 },
    admins: { currentPage: 1, itemsPerPage: 10 }
  });

  // -------- Load overview stats --------
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
        setSubscriberCount(stats.subscriberCount ?? 0);
        setLastPodcast(stats.lastPodcast ? { title: stats.lastPodcast.title, when: formatRelative(Date.parse(stats.lastPodcast.when)) } : null);
        setLastEvent(stats.lastEvent ? { title: stats.lastEvent.title, when: formatRelative(Date.parse(stats.lastEvent.when)) } : null);
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


  const canManageAdmins = role === "admin";      // only admins
  const canManageContent = role === "admin" || role === "moderator"; // both

  const loading = status === "loading";

  if (loading) return null; // or a tiny spinner

  if (!session?.user) {
    // Not logged in → show your login screen
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

  if (role !== "admin" && role !== "moderator") {
    // Logged in but not allowlisted
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


  // Podcast form handlers
  const addPodcastForm = () => {
    setPodcastForms([...podcastForms, {
      title: '',
      description: '',
      linkedin: '',
      instagram: '',
      drive: '',
      facebook: '',
      thumbnail: ''
    }]);
  };

  const removePodcastForm = (index: number) => {
    if (podcastForms.length > 1) {
      setPodcastForms(podcastForms.filter((_, i) => i !== index));
    }
  };

  const updatePodcastForm = (index: number, field: keyof PodcastForm, value: string) => {
    const updated = [...podcastForms];
    updated[index] = { ...updated[index], [field]: value };
    setPodcastForms(updated);
  };
  
  // Function to handle edit podcast
  const handleEditPodcast = (podcastId: string, podcastData: PodcastForm) => {
    // Set edit mode
    setEditMode(prev => ({ ...prev, podcasts: true }));
    setCurrentEditId(podcastId);
    
    // Populate form with existing data
    setPodcastForms([podcastData]);
    
    // Show the form
    setShowPodcastForm(true);
    
    // Scroll to form
    setTimeout(() => {
      document.querySelector('#podcast-form-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };
  
  // Function to cancel edit mode
  const cancelPodcastEdit = () => {
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
  };

  // Event form handlers
  const addEventForm = () => {
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
  };

  const removeEventForm = (index: number) => {
    if (eventForms.length > 1) {
      setEventForms(eventForms.filter((_, i) => i !== index));
    }
  };

  const updateEventForm = (index: number, field: keyof EventForm, value: string | string[]) => {
    const updated = [...eventForms];
    updated[index] = { ...updated[index], [field]: value };
    setEventForms(updated);
  };

  const addSponsor = (eventIndex: number) => {
    const updated = [...eventForms];
    updated[eventIndex].sponsors.push('');
    setEventForms(updated);
  };

  const removeSponsor = (eventIndex: number, sponsorIndex: number) => {
    const updated = [...eventForms];
    if (updated[eventIndex].sponsors.length > 1) {
      updated[eventIndex].sponsors.splice(sponsorIndex, 1);
      setEventForms(updated);
    }
  };

  const updateSponsor = (eventIndex: number, sponsorIndex: number, value: string) => {
    const updated = [...eventForms];
    updated[eventIndex].sponsors[sponsorIndex] = value;
    setEventForms(updated);
  };
  
  // Function to handle edit event
  const handleEditEvent = (eventId: string, eventData: EventForm) => {
    // Set edit mode
    setEditMode(prev => ({ ...prev, events: true }));
    setCurrentEditId(eventId);
    
    // Populate form with existing data
    setEventForms([eventData]);
    
    // Show the form
    setShowEventForm(true);
    
    // Scroll to form
    setTimeout(() => {
      document.querySelector('#event-form-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };
  
  // Function to cancel edit mode
  const cancelEventEdit = () => {
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
  };

  // MODIFICATION: Added admin form handlers
  const addAdminForm = () => {
    if (!showAdminForm) {
      // Reset the form if showing for the first time
      setAdminForms([{
        name: '',
        email: '',
        role: ''
      }]);
    } else {
      // Add another form field if form is already visible
      setAdminForms([...adminForms, {
        name: '',
        email: '',
        role: ''
      }]);
    }
    
    // Make sure edit mode is off when adding
    setEditMode(prev => ({ ...prev, admins: false }));
    setCurrentEditId(null);
    
    // Show the form
    setShowAdminForm(true);
  };

  const removeAdminForm = (index: number) => {
    if (adminForms.length > 1) {
      setAdminForms(adminForms.filter((_, i) => i !== index));
    }
  };

  const updateAdminForm = (index: number, field: keyof AdminForm, value: string) => {
    const updated = [...adminForms];
    updated[index] = { ...updated[index], [field]: value };
    setAdminForms(updated);
  };

  // MODIFICATION: Added team member form handlers
  const addTeamMemberForm = () => {
    if (!showTeamMemberForm) {
      // Reset the form if showing for the first time
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
      // Add another form field if form is already visible
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
    
    // Make sure edit mode is off when adding
    setEditMode(prev => ({ ...prev, teamMembers: false }));
    setCurrentEditId(null);
    
    // Show the form
    setShowTeamMemberForm(true);
  };

  const removeTeamMemberForm = (index: number) => {
    if (teamMemberForms.length > 1) {
      setTeamMemberForms(teamMemberForms.filter((_, i) => i !== index));
    }
  };

  const updateTeamMemberForm = (index: number, field: keyof TeamMemberForm, value: string) => {
    const updated = [...teamMemberForms];
    updated[index] = { ...updated[index], [field]: value };
    setTeamMemberForms(updated);
  };
  
  // Function to handle edit team member
  const handleEditTeamMember = (teamMemberId: string, teamMemberData: TeamMemberForm) => {
    // Set edit mode
    setEditMode(prev => ({ ...prev, teamMembers: true }));
    setCurrentEditId(teamMemberId);
    
    // Populate form with existing data
    setTeamMemberForms([teamMemberData]);
    
    // Show the form
    setShowTeamMemberForm(true);
    
    // Scroll to form
    setTimeout(() => {
      document.querySelector('#team-member-form-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };
  
  // Function to cancel edit mode
  const cancelTeamMemberEdit = () => {
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
  };

  // Function to handle edit admin
  const handleEditAdmin = (adminId: string, adminData: AdminForm) => {
    // Set edit mode
    setEditMode(prev => ({ ...prev, admins: true }));
    setCurrentEditId(adminId);
    
    // Populate form with existing data
    setAdminForms([adminData]);
    
    // Show the form
    setShowAdminForm(true);
    
    // Scroll to form
    setTimeout(() => {
      document.querySelector('#admin-form-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };
  
  // Function to cancel edit mode for admin
  const cancelAdminEdit = () => {
    setEditMode(prev => ({ ...prev, admins: false }));
    setCurrentEditId(null);
    setAdminForms([{
      name: '',
      email: '',
      role: ''
    }]);
    setShowAdminForm(false);
  };

  // Blog form handlers
  const addBlogForm = () => {
    setBlogForms([...blogForms, {
      title: '',
      content: '',
      coverImage: '',
      author: '',
      publishDate: '',
      status: 'draft'
    }]);
  };

  const removeBlogForm = (index: number) => {
    if (blogForms.length > 1) {
      setBlogForms(blogForms.filter((_, i) => i !== index));
    }
  };

  const updateBlogForm = (index: number, field: keyof Blog, value: string) => {
    const updated = [...blogForms];
    updated[index] = { ...updated[index], [field]: value };
    setBlogForms(updated);
  };

  const handleBlogSubmit = async () => {
    try {
      setIsSubmittingBlogs(true);

      // Validate each blog form
      for (let i = 0; i < blogForms.length; i++) {
        const f = blogForms[i];

        // Required fields
        if (!isNonEmpty(f.title) || !isNonEmpty(f.content) || !isNonEmpty(f.author)) {
          toast.error(`Blog #${i + 1}: Title, Content, and Author are required.`);
          setIsSubmittingBlogs(false);
          return;
        }

        // Cover image URL validation if provided
        if (isNonEmpty(f.coverImage) && !isValidUrl(f.coverImage)) {
          toast.error(`Blog #${i + 1}: Cover Image must be a valid URL (http/https).`);
          setIsSubmittingBlogs(false);
          return;
        }
      }

      // Build entries with canonical, API-friendly camelCase keys
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

      await fetch('/api/admin/blogs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(entries) });

      toast.success(`${entries.length} blog(s) submitted successfully!`);
      // console.log("Submitted blogs:", entries);
    } catch (err: any) {
      console.error(err);
      toast.error(`Failed to submit blogs. ${err?.message ?? ""}`.trim());
    } finally {
      setIsSubmittingBlogs(false);
    }
  };

  const handlePodcastSubmit = async () => {
    try {
      setIsSubmittingPodcasts(true);

      // Validate each podcast form
      for (let i = 0; i < podcastForms.length; i++) {
        const f = podcastForms[i];

        // Required fields
        if (!isNonEmpty(f.title) || !isNonEmpty(f.description) || !isNonEmpty(f.drive) || !isNonEmpty(f.thumbnail)) {
          toast.error(`Podcast #${i + 1}: Title, Description, Drive, and Thumbnail are required.`);
          setIsSubmittingPodcasts(false);
          return;
        }

        // URL validations (Drive & Thumbnail required to be valid; socials optional but must be valid if present)
        const urlChecks: Array<[string, string, boolean]> = [
          [f.drive, "Drive", true],
          [f.thumbnail, "Thumbnail", true],
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

      // Build entries with canonical, API-friendly camelCase keys
      const ts = buildTimestamp();
      const entries: any[] = podcastForms.map((f) => ({
        timestamp: String(ts),
        title: String(sanitize(f.title)),
        description: String(sanitize(f.description)),
        linkedin: String(sanitize(f.linkedin)),
        instagram: String(sanitize(f.instagram)),
        drive: String(sanitize(f.drive)),
        facebook: String(sanitize(f.facebook)),
        thumbnail: String(sanitize(f.thumbnail)),
      }));
      
      let apiUrl = '/api/admin/podcasts';
      let method = 'POST';
      
      // If in edit mode, update the existing podcast
      if (editMode.podcasts && currentEditId) {
        apiUrl = `/api/admin/podcasts/${currentEditId}`;
        method = 'PUT';
        // For single item update
        await fetch(apiUrl, { 
          method, 
          headers: { 'Content-Type': 'application/json' }, 
          body: JSON.stringify(entries[0]) 
        });
        
        toast.success("Podcast updated successfully!");
      } else {
        // For creating new podcasts
        await fetch(apiUrl, { 
          method, 
          headers: { 'Content-Type': 'application/json' }, 
          body: JSON.stringify(entries) 
        });
        
        toast.success(`${entries.length} podcast(s) submitted successfully!`);
      }
      
      // Reset form and hide after submission
      setPodcastForms([{
        title: '',
        description: '',
        linkedin: '',
        instagram: '',
        drive: '',
        facebook: '',
        thumbnail: ''
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
  };

  const handleEventSubmit = async () => {
    try {
      setIsSubmittingEvents(true);

      // Validate each event form
      for (let i = 0; i < eventForms.length; i++) {
        const f = eventForms[i];

        // Required fields
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

        // Optional URL fields must be valid if provided
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

      // Build entries with canonical, API-friendly camelCase keys
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
      
      // If in edit mode, update the existing event
      if (editMode.events && currentEditId) {
        apiUrl = `/api/admin/events/${currentEditId}`;
        method = 'PUT';
        // For single item update
        await fetch(apiUrl, { 
          method, 
          headers: { 'Content-Type': 'application/json' }, 
          body: JSON.stringify(entries[0]) 
        });
        
        toast.success("Event updated successfully!");
      } else {
        // For creating new events
        await fetch(apiUrl, { 
          method, 
          headers: { 'Content-Type': 'application/json' }, 
          body: JSON.stringify(entries) 
        });
        
        toast.success(`${entries.length} event(s) submitted successfully!`);
      }
      
      // Reset form and hide after submission
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
  };

  // MODIFICATION: Added submit handlers for admin and team member forms
  const handleAdminSubmit = async () => {
    try {
      if (!canManageAdmins) {
        toast.error("Only admins can add admins or moderators.");
        return;
      }
      setIsSubmittingAdmins(true);

      // Validate each admin form
      for (let i = 0; i < adminForms.length; i++) {
        const f = adminForms[i];
        if (!isNonEmpty(f.name) || !isNonEmpty(f.email) || !isNonEmpty(f.role)) {
          toast.error(`Admin #${i + 1}: Name, Email, and Role are required.`);
          setIsSubmittingAdmins(false);
          return;
        }
        // Basic email format check
        const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim());
        if (!emailOk) {
          toast.error(`Admin #${i + 1}: Email is invalid.`);
          setIsSubmittingAdmins(false);
          return;
        }
      }

      // Build entries for API schema { timestamp?, name, email, accessLevel }
      const ts = buildTimestamp();
      const entries = adminForms.map((f) => ({
        timestamp: String(ts),
        name: String(sanitize(f.name)),
        email: String(sanitize(f.email)).toLowerCase(),
        accessLevel: String(sanitize(f.role)), // "admin" | "moderator"
      }));

      let apiUrl = '/api/admin/users';
      let method = 'POST';
      
      // If in edit mode, update the existing admin
      if (editMode.admins && currentEditId) {
        apiUrl = `/api/admin/users/${currentEditId}`;
        method = 'PUT';
        
        // For single item update
        await fetch(apiUrl, { 
          method, 
          headers: { 'Content-Type': 'application/json' }, 
          body: JSON.stringify(entries[0]) 
        });
        
        toast.success("Admin updated successfully!");
      } else {
        // For creating new admins
        await fetch(apiUrl, { 
          method, 
          headers: { 'Content-Type': 'application/json' }, 
          body: JSON.stringify(entries) 
        });
        
        toast.success(`${entries.length} ${entries.length === 1 ? "entry" : "entries"} added to adminInfo.`);
      }
      
      // Reset form and hide after submission
      setAdminForms([{
        name: '',
        email: '',
        role: ''
      }]);
      
      // Reset edit mode and hide form
      setEditMode(prev => ({ ...prev, admins: false }));
      setCurrentEditId(null);
      setShowAdminForm(false);
    } catch (err: any) {
      console.error(err);
      toast.error(`Failed to submit admins. ${err?.message ?? ""}`.trim());
    } finally {
      setIsSubmittingAdmins(false);
    }
  };

  const handleTeamMemberSubmit = async () => {
    try {
      setIsSubmittingTeam(true);

      for (let i = 0; i < teamMemberForms.length; i++) {
        const f = teamMemberForms[i];

        // Required: name, email, designation, imageLink
        if (!isNonEmpty(f.name) || !isNonEmpty(f.email) || !isNonEmpty(f.designation) || !isNonEmpty(f.imageLink)) {
          toast.error(`Team member #${i + 1}: Name, Email, Designation, and Profile Image URL are required.`);
          setIsSubmittingTeam(false);
          return;
        }
        // Email format
        const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim());
        if (!emailOk) {
          toast.error(`Team member #${i + 1}: Email is invalid.`);
          setIsSubmittingTeam(false);
          return;
        }

        // Optional URL fields must be valid if provided; imageLink must be valid
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

      // Build entries in API schema with capital I for linkedIn
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
      
      // If in edit mode, update the existing team member
      if (editMode.teamMembers && currentEditId) {
        apiUrl = `/api/admin/team-members/${currentEditId}`;
        method = 'PUT';
        // For single item update
        await fetch(apiUrl, { 
          method, 
          headers: { 'Content-Type': 'application/json' }, 
          body: JSON.stringify(entries[0]) 
        });
        
        toast.success("Team member updated successfully!");
      } else {
        // For creating new team members
        await fetch(apiUrl, { 
          method, 
          headers: { 'Content-Type': 'application/json' }, 
          body: JSON.stringify(entries) 
        });
        
        toast.success(`${entries.length} ${entries.length === 1 ? "member" : "members"} added to teamInfo.`);
      }
      
      // Reset form and hide after submission
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
      
      // Reset edit mode and hide form
      setEditMode(prev => ({ ...prev, teamMembers: false }));
      setCurrentEditId(null);
      setShowTeamMemberForm(false);
      setEditMode(prev => ({ ...prev, teamMembers: false }));
      setCurrentEditId(null);
      setShowTeamMemberForm(false);
      
    } catch (err: any) {
      console.error(err);
      toast.error(`Failed to submit team members. ${err?.message ?? ""}`.trim());
    } finally {
      setIsSubmittingTeam(false);
    }
  };

  // Define sidebar items for the admin dashboard
  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'podcasts', label: 'Podcasts', icon: Mic },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'blogs', label: 'Blogs', icon: FileText },
    { id: 'newsletter', label: 'Newsletter', icon: Mail },
    { id: 'team-members', label: 'Team Members', icon: Users },
    { id: 'admins', label: 'Admins', icon: Shield },
  ];

  // Helper function to get the page title based on active tab
  const getPageTitle = () => {
    const item = sidebarItems.find(item => item.id === activeTab);
    return item ? `Manage ${item.label}` : 'Admin Dashboard';
  };

  // Determine if the search bar should be shown (not on overview tab)
  const showSearchBar = activeTab !== 'overview' && activeTab !== 'newsletter' && activeTab !== 'settings';

  return (
    <div className="min-h-screen flex mx-auto container">
      {/* Sidebar */}
      <div className="w-64 flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-bold text-white">Admin Panel</h1>
        </div>
        
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id)}
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
              <AvatarFallback>{session?.user?.name?.split(' ').map(n => n?.[0] || '').join('') || 'U'}</AvatarFallback>
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">{getPageTitle()}</h1>
            {activeTab === 'podcasts' && (
              <Button 
                className="bg-blue-600 hover:bg-blue-500 text-white"
                onClick={() => {
                  // Reset any edit mode
                  setEditMode(prev => ({ ...prev, podcasts: false }));
                  setCurrentEditId(null);
                  // Reset form
                  setPodcastForms([{
                    title: '',
                    description: '',
                    linkedin: '',
                    instagram: '',
                    drive: '',
                    facebook: '',
                    thumbnail: ''
                  }]);
                  // Show form
                  setShowPodcastForm(true);
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
                  // Reset any edit mode
                  setEditMode(prev => ({ ...prev, events: false }));
                  setCurrentEditId(null);
                  // Reset form
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
                  // Show form
                  setShowEventForm(true);
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
                  // Reset any edit mode
                  setEditMode(prev => ({ ...prev, teamMembers: false }));
                  setCurrentEditId(null);
                  // Reset form
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
                  // Show form
                  setShowTeamMemberForm(true);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add a new team member
              </Button>
            )}
            {activeTab === 'blogs' && (
              <Button 
                className="bg-blue-600 hover:bg-blue-500 text-white"
                onClick={addBlogForm}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add a new blog post
              </Button>
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
          </div>
          
          {/* Search Bar */}
          {showSearchBar && (
            <div className="mt-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder={`Search ${sidebarItems.find(item => item.id === activeTab)?.label.toLowerCase()}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-800 border-slate-700 text-white placeholder-slate-400 focus:border-blue-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 px-6 pb-6">
          {/* Overview Tab Content */}
          {activeTab === 'overview' && (
            <OverviewSection
              podcastCount={podcastCount}
              eventCount={eventCount}
              subscriberCount={subscriberCount}
              lastPodcast={lastPodcast}
              lastEvent={lastEvent}
              statsLoading={statsLoading}
            />
          )}

          {/* Podcasts Tab Content */}
          {activeTab === 'podcasts' && (
            <div className="space-y-6">
              <Card className="bg-slate-900 border-slate-800">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b border-slate-800">
                        <tr>
                          <th className="text-left p-4 text-slate-400 font-medium">Title</th>
                          <th className="text-left p-4 text-slate-400 font-medium">Description</th>
                          <th className="text-left p-4 text-slate-400 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* This will be populated with real data later */}
                        <tr className="border-b border-slate-800 hover:bg-slate-800/50">
                          <td className="p-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-cover bg-center rounded-lg bg-slate-800"
                                    style={{ backgroundImage: "url(https://example.com/podcast1.jpg)" }}></div>
                              <div>
                                <p className="text-white font-medium">Example Podcast</p>
                                <p className="text-slate-400 text-sm line-clamp-1">Example podcast description</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-slate-300">Example topic</td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-blue-400 hover:text-blue-300 hover:bg-blue-600/20"
                                onClick={() => handleEditPodcast("podcast1", {
                                  title: "Example Podcast",
                                  description: "Example podcast description",
                                  linkedin: "https://linkedin.com/example",
                                  instagram: "https://instagram.com/example",
                                  drive: "https://drive.google.com/example",
                                  facebook: "https://facebook.com/example",
                                  thumbnail: "https://example.com/podcast1.jpg"
                                })}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-600/20">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
              {/* Pagination */}
              <div className="flex items-center justify-center">
                {/* <Button 
                  onClick={addTeamMemberForm} 
                  variant="outline" 
                  className="bg-blue-600/10 border-blue-600/30 hover:bg-blue-600/20 text-blue-400"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Team Member
                </Button> */}
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="bg-blue-600 text-white">1</Button>
                  <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">2</Button>
                  <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Podcast Form Section */}
              {showPodcastForm && (
                <div id="podcast-form-section" className="mt-8 pt-8 border-t border-slate-800">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">
                      {editMode.podcasts ? "Edit Podcast" : "Add New Podcasts"}
                    </h2>
                    <div className="flex gap-2">
                      {!editMode.podcasts && (
                        <Button onClick={addPodcastForm} variant="outline" className="btn-secondary">
                          <Plus className="mr-2 h-4 w-4" />
                          Add Another Podcast
                        </Button>
                      )}
                      <Button onClick={handlePodcastSubmit} className="btn-primary" disabled={isSubmittingPodcasts}>
                        <Save className="mr-2 h-4 w-4" />
                        {editMode.podcasts ? "Save Changes" : `Submit All (${podcastForms.length})`}
                      </Button>
                      <Button 
                        onClick={cancelPodcastEdit} 
                        variant="outline" 
                        className="border-slate-600 text-slate-400 hover:bg-slate-800"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-6 mt-6">
                    {podcastForms.map((form, index) => (
                      <PodcastFormCard
                        key={index}
                        index={index}
                        form={form}
                        canRemove={podcastForms.length > 1 && !editMode.podcasts}
                        onRemove={() => removePodcastForm(index)}
                        onChange={(field, value) => updatePodcastForm(index, field, value)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Events Tab Content */}
          {activeTab === 'events' && (
            <div className="space-y-6">
              <Card className="bg-slate-900 border-slate-800">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b border-slate-800">
                        <tr>
                          <th className="text-left p-4 text-slate-400 font-medium">Title</th>
                          <th className="text-left p-4 text-slate-400 font-medium">Location</th>
                          <th className="text-left p-4 text-slate-400 font-medium">Date</th>
                          <th className="text-left p-4 text-slate-400 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* This will be populated with real data later */}
                        <tr className="border-b border-slate-800 hover:bg-slate-800/50">
                          <td className="p-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-cover bg-center rounded-lg bg-slate-800"
                                   style={{ backgroundImage: "url(https://example.com/event1.jpg)" }}></div>
                              <div>
                                <p className="text-white font-medium">Example Event</p>
                                <p className="text-slate-400 text-sm line-clamp-1">Example event description</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-slate-300">Toronto, ON</td>
                          <td className="p-4 text-slate-300">2025-10-15</td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-blue-400 hover:text-blue-300 hover:bg-blue-600/20"
                                onClick={() => handleEditEvent("event1", {
                                  title: "Example Event",
                                  topic: "Example Topic",
                                  description: "Example event description",
                                  date: "2025-10-15",
                                  time: "18:00",
                                  location: "Toronto, ON",
                                  lumaLink: "https://lu.ma/example",
                                  zoomLink: "https://zoom.us/j/example",
                                  sponsors: ['Sponsor 1', 'Sponsor 2']
                                })}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-600/20">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            {/* Pagination */}
              <div className="flex items-center justify-center">
                {/* <Button 
                  onClick={addTeamMemberForm} 
                  variant="outline" 
                  className="bg-blue-600/10 border-blue-600/30 hover:bg-blue-600/20 text-blue-400"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Team Member
                </Button> */}
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="bg-blue-600 text-white">1</Button>
                  <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">2</Button>
                  <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Event Form Section */}
              {showEventForm && (
                <div id="event-form-section" className="mt-8 pt-8 border-t border-slate-800">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">
                      {editMode.events ? "Edit Event" : "Add New Events"}
                    </h2>
                    <div className="flex gap-2">
                      {!editMode.events && (
                        <Button onClick={addEventForm} variant="outline" className="btn-secondary">
                          <Plus className="mr-2 h-4 w-4" />
                          Add Another Event
                        </Button>
                      )}
                      <Button onClick={handleEventSubmit} className="btn-primary" disabled={isSubmittingEvents}>
                        <Save className="mr-2 h-4 w-4" />
                        {editMode.events ? "Save Changes" : `Submit All (${eventForms.length})`}
                      </Button>
                      <Button 
                        onClick={cancelEventEdit} 
                        variant="outline" 
                        className="border-slate-600 text-slate-400 hover:bg-slate-800"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-6 mt-6">
                    {eventForms.map((form, index) => (
                      <EventFormCard
                        key={index}
                        index={index}
                        form={form}
                        canRemove={eventForms.length > 1 && !editMode.events}
                        onRemove={() => removeEventForm(index)}
                        onChange={(field, value) => updateEventForm(index, field, value)}
                        onAddSponsor={() => addSponsor(index)}
                        onRemoveSponsor={(sponsorIndex) => removeSponsor(index, sponsorIndex)}
                        onChangeSponsor={(sponsorIndex, value) => updateSponsor(index, sponsorIndex, value)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Blogs Tab Content */}
          {activeTab === 'blogs' && (
            <div className="space-y-6">
              <Card className="bg-slate-900 border-slate-800">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b border-slate-800">
                        <tr>
                          <th className="text-left p-4 text-slate-400 font-medium">Title</th>
                          <th className="text-left p-4 text-slate-400 font-medium">Author</th>
                          <th className="text-left p-4 text-slate-400 font-medium">Date</th>
                          <th className="text-left p-4 text-slate-400 font-medium">Status</th>
                          <th className="text-left p-4 text-slate-400 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Example data - will be replaced with real data */}
                        <tr className="border-b border-slate-800 hover:bg-slate-800/50">
                          <td className="p-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-cover bg-center rounded-lg" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=400&q=80)" }}></div>
                              <div>
                                <p className="text-white font-medium">Exploring the Wonders of Nature</p>
                                <p className="text-slate-400 text-sm line-clamp-1">A journey through natural landscapes</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-slate-300">Sophia Clark</td>
                          <td className="p-4 text-slate-300">2025-08-15</td>
                          <td className="p-4">
                            <Badge 
                              variant="secondary" 
                              className="bg-green-600/20 text-green-400 border-green-600/30"
                            >
                              Published
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300 hover:bg-blue-600/20">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-600/20">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                        <tr className="border-b border-slate-800 hover:bg-slate-800/50">
                          <td className="p-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-cover bg-center rounded-lg" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1574285013029-28bf9740a35e?w=400&q=80)" }}></div>
                              <div>
                                <p className="text-white font-medium">The Art of Photography</p>
                                <p className="text-slate-400 text-sm line-clamp-1">Techniques and composition guidelines</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-slate-300">Ethan Bennett</td>
                          <td className="p-4 text-slate-300">2025-07-22</td>
                          <td className="p-4">
                            <Badge 
                              variant="secondary" 
                              className="bg-amber-600/20 text-amber-400 border-amber-600/30"
                            >
                              Draft
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300 hover:bg-blue-600/20">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-600/20">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                        <tr className="border-b border-slate-800 hover:bg-slate-800/50">
                          <td className="p-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-cover bg-center rounded-lg" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&q=80)" }}></div>
                              <div>
                                <p className="text-white font-medium">The Latest in Tech Innovations</p>
                                <p className="text-slate-400 text-sm line-clamp-1">Exploring cutting-edge technologies</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-slate-300">Ava Reynolds</td>
                          <td className="p-4 text-slate-300">2025-06-18</td>
                          <td className="p-4">
                            <Badge 
                              variant="secondary" 
                              className="bg-green-600/20 text-green-400 border-green-600/30"
                            >
                              Published
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300 hover:bg-blue-600/20">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-600/20">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Pagination */}
              <div className="flex items-center justify-center space-x-2">
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="bg-blue-600 text-white">1</Button>
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">2</Button>
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">3</Button>
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Newsletter Tab Content */}
          {activeTab === 'newsletter' && (
            <div className="space-y-8">
              {/* Newsletter Configuration Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Mail className="h-6 w-6 text-purple-400" />
                  <h2 className="text-2xl font-bold text-white">Newsletter Configuration</h2>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2">
                  <Mail className="h-4 w-4 mr-2" />
                  Save Configuration
                </Button>
              </div>

              {/* Newsletter Structure Section */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white">Newsletter Structure</h3>
                
                <Card className="bg-slate-900 border-slate-800">
                  <CardContent className="p-6 space-y-6">
                    {/* Include Recent Podcasts */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-medium text-white mb-1">Include Recent Podcasts</h4>
                        <p className="text-slate-400 text-sm">Show podcasts published in the last week</p>
                      </div>
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={newsletterSettings.includePodcasts}
                          onChange={(e) => setNewsletterSettings(prev => ({ ...prev, includePodcasts: e.target.checked }))}
                          className="sr-only peer"
                          id="include-podcasts"
                        />
                        <label
                          htmlFor="include-podcasts"
                          className="relative flex h-6 w-11 cursor-pointer items-center rounded-full bg-slate-700 px-0.5 outline-none transition-colors peer-checked:bg-blue-600 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue-600"
                        >
                          <span className="h-5 w-5 rounded-full bg-white shadow-sm transition-all peer-checked:translate-x-5"></span>
                        </label>
                      </div>
                    </div>

                    {/* Include Upcoming Events */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-medium text-white mb-1">Include Upcoming Events</h4>
                        <p className="text-slate-400 text-sm">Show upcoming events and workshops</p>
                      </div>
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={newsletterSettings.includeEvents}
                          onChange={(e) => setNewsletterSettings(prev => ({ ...prev, includeEvents: e.target.checked }))}
                          className="sr-only peer"
                          id="include-events"
                        />
                        <label
                          htmlFor="include-events"
                          className="relative flex h-6 w-11 cursor-pointer items-center rounded-full bg-slate-700 px-0.5 outline-none transition-colors peer-checked:bg-blue-600 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue-600"
                        >
                          <span className="h-5 w-5 rounded-full bg-white shadow-sm transition-all peer-checked:translate-x-5"></span>
                        </label>
                      </div>
                    </div>

                    {/* Include Further Reading */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-medium text-white mb-1">Include Further Reading</h4>
                        <p className="text-slate-400 text-sm">Add curated links and resources</p>
                      </div>
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={newsletterSettings.includeReading}
                          onChange={(e) => setNewsletterSettings(prev => ({ ...prev, includeReading: e.target.checked }))}
                          className="sr-only peer"
                          id="include-reading"
                        />
                        <label
                          htmlFor="include-reading"
                          className="relative flex h-6 w-11 cursor-pointer items-center rounded-full bg-slate-700 px-0.5 outline-none transition-colors peer-checked:bg-blue-600 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue-600"
                        >
                          <span className="h-5 w-5 rounded-full bg-white shadow-sm transition-all peer-checked:translate-x-5"></span>
                        </label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Publishing Schedule Section */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white">Publishing Schedule</h3>
                
                <Card className="bg-slate-900 border-slate-800">
                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          id="default-schedule"
                          name="schedule"
                          checked={newsletterSettings.scheduleType === 'default'}
                          onChange={() => setNewsletterSettings(prev => ({ ...prev, scheduleType: 'default' }))}
                          className="h-4 w-4 text-blue-600 bg-slate-700 border-slate-600 focus:ring-blue-500"
                        />
                        <label htmlFor="default-schedule" className="text-white font-medium">
                          Default Schedule (Every Friday at 9:00 AM)
                        </label>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          id="custom-schedule"
                          name="schedule"
                          checked={newsletterSettings.scheduleType === 'custom'}
                          onChange={() => setNewsletterSettings(prev => ({ ...prev, scheduleType: 'custom' }))}
                          className="h-4 w-4 text-blue-600 bg-slate-700 border-slate-600 focus:ring-blue-500"
                        />
                        <label htmlFor="custom-schedule" className="text-white font-medium">
                          Custom Schedule
                        </label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Newsletter Preview Section */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white">Newsletter Preview</h3>
                
                <Card className="bg-slate-900 border-slate-800">
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      {/* Preview Header */}
                      <div className="flex items-center space-x-3 pb-4 border-b border-slate-700">
                        <Mail className="h-5 w-5 text-purple-400" />
                        <h4 className="text-lg font-medium text-purple-400">TECH-NEST Weekly Digest</h4>
                      </div>
                      
                      {/* Latest Podcasts Section */}
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Mic className="h-4 w-4 text-cyan-400" />
                          <h5 className="font-medium text-white">Latest Podcasts</h5>
                        </div>
                        <p className="text-slate-400 text-sm ml-6">Recent podcast episodes will appear here</p>
                      </div>
                      
                      {/* Upcoming Events Section */}
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-blue-400" />
                          <h5 className="font-medium text-white">Upcoming Events</h5>
                        </div>
                        <p className="text-slate-400 text-sm ml-6">Upcoming events and workshops will appear here</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <Button className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 flex-1">
                  Preview Newsletter
                </Button>
                <Button variant="outline" className="border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10 px-8 py-3 flex-1">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Test Email
                </Button>
              </div>
            </div>
          )}

          {/* Admins section */}
          {activeTab === 'admins' && (
            <div className="space-y-6">
              {canManageAdmins ? (
                <>
                  <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="border-b border-slate-800">
                            <tr>
                              <th className="text-left p-4 text-slate-400 font-medium">Name</th>
                              <th className="text-left p-4 text-slate-400 font-medium">Email</th>
                              <th className="text-left p-4 text-slate-400 font-medium">Role</th>
                              <th className="text-left p-4 text-slate-400 font-medium">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {/* Example data - will be populated with real admin data later */}
                            <tr className="border-b border-slate-800 hover:bg-slate-800/50">
                              <td className="p-4">
                                <div className="flex items-center space-x-3">
                                  <Avatar className="h-10 w-10">
                                    <AvatarFallback>FM</AvatarFallback>
                                  </Avatar>
                                  <span className="text-white font-medium">Fatema Meem</span>
                                </div>
                              </td>
                              <td className="p-4 text-slate-300">fatema@tech-nest.org</td>
                              <td className="p-4">
                                <Badge 
                                  variant="secondary" 
                                  className="bg-amber-600/20 text-amber-400 border-amber-600/30"
                                >
                                  Admin
                                </Badge>
                              </td>
                              <td className="p-4">
                                <div className="flex items-center space-x-2">
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-blue-400 hover:text-blue-300 hover:bg-blue-600/20"
                                    onClick={() => handleEditAdmin("admin1", {
                                      name: "Fatema Meem",
                                      email: "fatema@tech-nest.org",
                                      role: "admin"
                                    })}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-600/20">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                            <tr className="border-b border-slate-800 hover:bg-slate-800/50">
                              <td className="p-4">
                                <div className="flex items-center space-x-3">
                                  <Avatar className="h-10 w-10">
                                    <AvatarFallback>JS</AvatarFallback>
                                  </Avatar>
                                  <span className="text-white font-medium">John Smith</span>
                                </div>
                              </td>
                              <td className="p-4 text-slate-300">john@tech-nest.org</td>
                              <td className="p-4">
                                <Badge 
                                  variant="secondary" 
                                  className="bg-blue-600/20 text-blue-400 border-blue-600/30"
                                >
                                  Moderator
                                </Badge>
                              </td>
                              <td className="p-4">
                                <div className="flex items-center space-x-2">
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-blue-400 hover:text-blue-300 hover:bg-blue-600/20"
                                    onClick={() => handleEditAdmin("admin2", {
                                      name: "John Smith",
                                      email: "john@tech-nest.org",
                                      role: "moderator"
                                    })}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-600/20">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Pagination */}
                  <div className="flex items-center justify-center">
                    {/* <Button 
                      onClick={addAdminForm} 
                      variant="outline" 
                      className="bg-amber-600/10 border-amber-600/30 hover:bg-amber-600/20 text-amber-400"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add New Admin
                    </Button> */}
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="bg-blue-600 text-white">1</Button>
                      <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Admin Form Section */}
                  {showAdminForm && (
                    <div id="admin-form-section" className="mt-8 pt-8 border-t border-slate-800">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Crown className="h-6 w-6 text-amber-400" />
                          <h2 className="text-xl font-bold text-white">
                            {editMode.admins ? "Edit Administrator" : "Add New Administrator"}
                          </h2>
                        </div>
                        <div className="flex gap-2">
                          {!editMode.admins && (
                            <Button onClick={addAdminForm} variant="outline" size="sm" className="btn-secondary">
                              <Plus className="mr-2 h-4 w-4" />
                              Add Another
                            </Button>
                          )}
                          <Button 
                            disabled={!canManageAdmins || isSubmittingAdmins} 
                            onClick={handleAdminSubmit} 
                            size="sm" 
                            className="btn-primary"
                          >
                            <Save className="mr-2 h-4 w-4" />
                            {editMode.admins ? "Save Changes" : `Submit (${adminForms.length})`}
                          </Button>
                          <Button 
                            onClick={cancelAdminEdit} 
                            variant="outline" 
                            size="sm"
                            className="border-slate-600 text-slate-400 hover:bg-slate-800"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    
                      <div className="space-y-4 mt-6">
                      {adminForms.map((form, index) => (
                        <Card key={index} className="bg-slate-900 border-slate-800">
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <CardTitle className="flex items-center space-x-2 text-lg">
                                <UserPlus className="h-5 w-5 text-amber-400" />
                                <span>Admin #{index + 1}</span>
                              </CardTitle>
                              {adminForms.length > 1 && (
                                <Button
                                  onClick={() => removeAdminForm(index)}
                                  variant="ghost"
                                  size="icon"
                                  className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor={`admin-name-${index}`}>Name *</Label>
                                <Input
                                  id={`admin-name-${index}`}
                                  value={form.name}
                                  onChange={(e) => updateAdminForm(index, 'name', e.target.value)}
                                  placeholder="Enter full name"
                                  className="focus-ring"
                                  required
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor={`admin-email-${index}`}>Email *</Label>
                                <Input
                                  id={`admin-email-${index}`}
                                  type="email"
                                  value={form.email}
                                  onChange={(e) => updateAdminForm(index, 'email', e.target.value)}
                                  placeholder="admin@tech-nest.org"
                                  className="focus-ring"
                                  required
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor={`admin-role-${index}`}>Role *</Label>
                              <Select 
                                value={form.role} 
                                onValueChange={(value: any) => updateAdminForm(index, 'role', value)}
                              >
                                <SelectTrigger className="focus-ring">
                                  <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="admin">
                                    <div className="flex items-center">
                                      <Crown className="mr-2 h-4 w-4 text-amber-400" />
                                      Admin
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="moderator">
                                    <div className="flex items-center">
                                      <Shield className="mr-2 h-4 w-4 text-blue-400" />
                                      Moderator
                                    </div>
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Shield className="h-16 w-16 text-slate-500 mb-6" />
                  <h3 className="text-2xl font-bold text-white mb-2">Admin Access Required</h3>
                  <p className="text-slate-400 max-w-md">
                    Only users with administrative privileges can manage other admins and moderators.
                  </p>
                </div>
              )}
            </div>
          )}
          
          {/* Team members tab content */}
          {activeTab === 'team-members' && (
            <div className="space-y-6">
              <Card className="bg-slate-900 border-slate-800">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b border-slate-800">
                        <tr>
                          <th className="text-left p-4 text-slate-400 font-medium">Name</th>
                          <th className="text-left p-4 text-slate-400 font-medium">Role</th>
                          <th className="text-left p-4 text-slate-400 font-medium">Email</th>
                          <th className="text-left p-4 text-slate-400 font-medium">Social</th>
                          <th className="text-left p-4 text-slate-400 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Example data - will be populated with real team data later */}
                        <tr className="border-b border-slate-800 hover:bg-slate-800/50">
                          <td className="p-4">
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src="https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop" />
                                <AvatarFallback>FM</AvatarFallback>
                              </Avatar>
                              <span className="text-white font-medium">Fatema Meem</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge variant="secondary" className="bg-cyan-600/20 text-cyan-400 border-cyan-600/30">
                              Developer
                            </Badge>
                          </td>
                          <td className="p-4 text-slate-300">fatema@tech-nest.org</td>
                          <td className="p-4">
                            <div className="flex space-x-2">
                              <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center text-blue-500">in</div>
                              <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center text-cyan-500">gh</div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-blue-400 hover:text-blue-300 hover:bg-blue-600/20"
                                onClick={() => handleEditTeamMember("member1", {
                                  name: "Fatema Meem",
                                  email: "fatema@tech-nest.org",
                                  designation: "Developer",
                                  description: "Software developer with experience in React and Node.js",
                                  linkedin: "https://linkedin.com/in/fatemameem",
                                  twitter: "",
                                  github: "https://github.com/fatemameem",
                                  website: "",
                                  imageLink: "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
                                })}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-600/20">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                        <tr className="border-b border-slate-800 hover:bg-slate-800/50">
                          <td className="p-4">
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback>JD</AvatarFallback>
                              </Avatar>
                              <span className="text-white font-medium">John Doe</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge variant="secondary" className="bg-amber-600/20 text-amber-400 border-amber-600/30">
                              Designer
                            </Badge>
                          </td>
                          <td className="p-4 text-slate-300">john@tech-nest.org</td>
                          <td className="p-4">
                            <div className="flex space-x-2">
                              <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center text-blue-500">in</div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-blue-400 hover:text-blue-300 hover:bg-blue-600/20"
                                onClick={() => handleEditTeamMember("member2", {
                                  name: "John Doe",
                                  email: "john@tech-nest.org",
                                  designation: "Designer",
                                  description: "UI/UX designer with 5 years of experience",
                                  linkedin: "https://linkedin.com/in/johndoe",
                                  twitter: "",
                                  github: "",
                                  website: "",
                                  imageLink: ""
                                })}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-600/20">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Pagination */}
              <div className="flex items-center justify-center">
                {/* <Button 
                  onClick={addTeamMemberForm} 
                  variant="outline" 
                  className="bg-blue-600/10 border-blue-600/30 hover:bg-blue-600/20 text-blue-400"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Team Member
                </Button> */}
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="bg-blue-600 text-white">1</Button>
                  <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">2</Button>
                  <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Team Member Form Section */}
              {showTeamMemberForm && (
                <div id="team-member-form-section" className="mt-8 pt-8 border-t border-slate-800">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">
                      {editMode.teamMembers ? "Edit Team Member" : "Add New Team Member"}
                    </h2>
                    <div className="flex gap-2">
                      {!editMode.teamMembers && (
                        <Button onClick={addTeamMemberForm} variant="outline" className="btn-secondary">
                          <Plus className="mr-2 h-4 w-4" />
                          Add Another Team Member
                        </Button>
                      )}
                      <Button onClick={handleTeamMemberSubmit} className="btn-primary" disabled={isSubmittingTeam}>
                        <Save className="mr-2 h-4 w-4" />
                        {editMode.teamMembers ? "Save Changes" : `Submit (${teamMemberForms.length})`}
                      </Button>
                      <Button 
                        onClick={cancelTeamMemberEdit} 
                        variant="outline" 
                        className="border-slate-600 text-slate-400 hover:bg-slate-800"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4 mt-6">
                    {teamMemberForms.map((form, index) => (
                      <TeamMemberFormCard
                        key={index}
                        index={index}
                        form={form}
                        canRemove={teamMemberForms.length > 1 && !editMode.teamMembers}
                        onRemove={() => removeTeamMemberForm(index)}
                        onChange={(field, value) => updateTeamMemberForm(index, field, value)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// // export const dynamic = "force-dynamic";
