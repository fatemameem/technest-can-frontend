'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { 
  Plus, 
  Trash2, 
  Save, 
  Calendar, 
  Mic, 
  Shield,
  Users,
  BarChart3,
  Settings,
  Crown,
  UserPlus
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { API_BASE } from '@/lib/env';

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

// Tries robust payload shapes and error reporting for sheet posting
async function postToSheet(tab: "podcastInfo" | "eventsInfo" | "adminInfo" | "teamInfo", entries: any[]) {
  const batchPayloads = [
    entries,                 // [ { timestamp, title, ... } ]
    { data: entries },
    { rows: entries },
    { values: entries },
    { records: entries },
  ];

  const attempt = async (payload: any) => {
    const res = await fetch(`${API_BASE}/sheets/${tab}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const text = await res.text().catch(() => "");
    return { ok: res.ok, status: res.status, text };
  };

  // Try batch variants first
  const batchErrors: string[] = [];
  for (const payload of batchPayloads) {
    try {
      const r = await attempt(payload);
      if (r.ok) return;
      batchErrors.push(`Batch payload ${JSON.stringify(Object.keys(payload))} -> ${r.status} ${r.text?.slice(0, 300)}`);
    } catch (e: any) {
      batchErrors.push(`Batch payload ${JSON.stringify(Object.keys(payload))} -> ${String(e).slice(0, 300)}`);
    }
  }

  // If batch failed, try item-by-item fallbacks (some handlers only accept a single row per POST)
  const singlePayloads = [
    (row: any) => row,           // raw object
    (row: any) => ({ row }),     // { row: {..} }
    (row: any) => ({ data: row }),
    (row: any) => ({ values: row }),
    (row: any) => ({ record: row }),
  ];

  const perItemErrors: string[] = [];
  for (const row of entries) {
    let sent = false;
    for (const builder of singlePayloads) {
      try {
        const r = await attempt(builder(row));
        if (r.ok) { sent = true; break; }
        perItemErrors.push(`Single row keys ${JSON.stringify(Object.keys(row))} -> ${r.status} ${r.text?.slice(0, 300)}`);
      } catch (e: any) {
        perItemErrors.push(`Single row error -> ${String(e).slice(0, 300)}`);
      }
    }
    if (!sent) {
      // If one row can't be sent even after all shapes, abort early to avoid spamming
      throw new Error(`All payload shapes failed for a row.\nBatch attempts:\n- ${batchErrors.join("\n- ")}\nPer-row attempts:\n- ${perItemErrors.join("\n- ")}`);
    }
  }
}

// -------- Fetch helpers for stats --------
async function fetchSheet<T = any>(tab: "podcastInfo" | "eventsInfo" | "subscriberInfo"): Promise<T[]> {
  const res = await fetch(`${API_BASE}/sheets/${tab}?cache=force`, { cache: "no-store" });
  if (!res.ok) throw new Error(`GET ${API_BASE}/sheets/${tab} failed: ${res.status}`);
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
    // -------- Stats state for Overview --------
  const [podcastCount, setPodcastCount] = useState<number | null>(null);
  const [eventCount, setEventCount] = useState<number | null>(null);
  const [subscriberCount, setSubscriberCount] = useState<number | null>(null);
  const [lastPodcast, setLastPodcast] = useState<{ title: string; when: string } | null>(null);
  const [lastEvent, setLastEvent] = useState<{ title: string; when: string } | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  // -------- Load overview stats --------
  useEffect(() => {
    let mounted = true;
    async function run() {
      try {
        if (!session?.user) return;
        setStatsLoading(true);

        const [pods, events, subs] = await Promise.all([
          fetchSheet<any>("podcastInfo").catch(() => []),
          fetchSheet<any>("eventsInfo").catch(() => []),
          fetchSheet<any>("subscriberInfo").catch(() => []),
        ]);

        if (!mounted) return;
        setPodcastCount(pods.length);
        setEventCount(events.length);
        setSubscriberCount(subs.length);

        // derive most recent podcast by timestamp or id
        if (pods.length > 0) {
          const latestPod = [...pods].sort(
            (a, b) =>
              parseWhen(b.timestamp ?? b.Timestamp ?? b.id) -
              parseWhen(a.timestamp ?? a.Timestamp ?? a.id)
          )[0];
          setLastPodcast({
            title: String(
              latestPod.title ??
                latestPod["Title"] ??
                latestPod["Title of the Podcast"] ??
                "New podcast"
            ),
            when: formatRelative(
              parseWhen(latestPod.timestamp ?? latestPod.Timestamp ?? latestPod.id)
            ),
          });
        } else {
          setLastPodcast(null);
        }

        if (events.length > 0) {
          const latestEvt = [...events].sort(
            (a, b) =>
              parseWhen(b.timestamp ?? b.Timestamp ?? b.id) -
              parseWhen(a.timestamp ?? a.Timestamp ?? a.id)
          )[0];
          setLastEvent({
            title: String(latestEvt.title ?? latestEvt["Title"] ?? "New event"),
            when: formatRelative(
              parseWhen(latestEvt.timestamp ?? latestEvt.Timestamp ?? latestEvt.id)
            ),
          });
        } else {
          setLastEvent(null);
        }
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
      <div className="min-h-screen flex items-center justify-center">
        <div>
          <h1 className="text-2xl font-semibold mb-3">Admin Access</h1>
          <p className="mb-6">Please sign in with Google.</p>
          <button onClick={() => signIn("google", { callbackUrl: "/admin" })}>Sign in</button>
        </div>
      </div>
    );
  }

  if (role !== "admin" && role !== "moderator") {
    // Logged in but not allowlisted
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>
          <h1 className="text-2xl font-semibold mb-3">Unauthorized</h1>
          <p className="mb-6">Your account isn't on the admin allowlist.</p>
          <button onClick={() => signOut()}>Sign out</button>
        </div>
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

  // MODIFICATION: Added admin form handlers
  const addAdminForm = () => {
    setAdminForms([...adminForms, {
      name: '',
      email: '',
      role: ''
    }]);
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

      await postToSheet("podcastInfo", entries);

      toast.success(`${entries.length} podcast(s) submitted successfully!`);
      console.log("Submitted podcasts:", entries);
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

      await postToSheet("eventsInfo", entries);

      toast.success(`${entries.length} event(s) submitted successfully!`);
      console.log("Submitted events:", entries);
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

      await postToSheet("adminInfo", entries);
      toast.success(`${entries.length} ${entries.length === 1 ? "entry" : "entries"} added to adminInfo.`);
      console.log("Submitted admins:", entries);
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

      await postToSheet("teamInfo", entries);
      toast.success(`${entries.length} ${entries.length === 1 ? "member" : "members"} added to teamInfo.`);
      console.log("Submitted team members:", entries);
    } catch (err: any) {
      console.error(err);
      toast.error(`Failed to submit team members. ${err?.message ?? ""}`.trim());
    } finally {
      setIsSubmittingTeam(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="h-8 w-8 text-cyan-400" />
              <h1 className="text-3xl font-bold">TECH-NEST Admin Dashboard</h1>
            </div>
            <p className="text-slate-400">Manage podcasts, events, and content for the platform</p>
          </div>
          <Button asChild variant="outline" className={`btn-secondary cursor-pointer`} onClick={() => signOut({callbackUrl: "/"})}>
            <span>Logout</span>
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 surface">
            <TabsTrigger value="overview" className="focus-ring">
              <BarChart3 className="mr-2 h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="podcasts" className="focus-ring">
              <Mic className="mr-2 h-4 w-4" />
              Podcasts
            </TabsTrigger>
            <TabsTrigger value="events" className="focus-ring">
              <Calendar className="mr-2 h-4 w-4" />
              Events
            </TabsTrigger>
            <TabsTrigger value="settings" className="focus-ring">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="surface">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Total Podcasts</p>
                      <p className="text-2xl font-bold text-cyan-400">{podcastCount ?? (statsLoading ? "…" : 0)}</p>
                    </div>
                    <Mic className="h-8 w-8 text-cyan-400" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="surface">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Total Events</p>
                      <p className="text-2xl font-bold text-blue-400">{eventCount ?? (statsLoading ? "…" : 0)}</p>
                    </div>
                    <Calendar className="h-8 w-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="surface">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Newsletter Subscribers</p>
                      <p className="text-2xl font-bold text-green-400">{subscriberCount ?? (statsLoading ? "…" : 0)}</p>
                    </div>
                    <Users className="h-8 w-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>
              
              {/* <Card className="surface">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">This Month</p>
                      <p className="text-2xl font-bold text-purple-400">-</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-purple-400" />
                  </div>
                </CardContent>
              </Card> */}
            </div>

            <Card className="surface">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 border border-white/10 rounded-lg">
                    <Mic className="h-5 w-5 text-cyan-400" />
                    <div className="flex-1">
                      <p className="font-medium">New podcast published</p>
                      <p className="text-slate-400 text-sm">
                        {lastPodcast ? lastPodcast.title : (statsLoading ? "Loading…" : "No podcasts yet")}
                      </p>
                    </div>
                    <Badge variant="secondary">
                      {lastPodcast ? lastPodcast.when : (statsLoading ? "…" : "—")}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border border-white/10 rounded-lg">
                    <Calendar className="h-5 w-5 text-blue-400" />
                    <div className="flex-1">
                      <p className="font-medium">Event scheduled</p>
                      <p className="text-slate-400 text-sm">
                        {lastEvent ? lastEvent.title : (statsLoading ? "Loading…" : "No events yet")}
                      </p>
                    </div>
                    <Badge variant="secondary">
                      {lastEvent ? lastEvent.when : (statsLoading ? "…" : "—")}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Podcasts Tab */}
          <TabsContent value="podcasts" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Manage Podcasts</h2>
              <div className="flex gap-2">
                <Button onClick={addPodcastForm} variant="outline" className="btn-secondary">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Another Podcast
                </Button>
                <Button onClick={handlePodcastSubmit} className="btn-primary" disabled={isSubmittingPodcasts}>
                  <Save className="mr-2 h-4 w-4" />
                  Submit All ({podcastForms.length})
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              {podcastForms.map((form, index) => (
                <Card key={index} className="surface">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-2">
                        <Mic className="h-5 w-5 text-cyan-400" />
                        <span>Podcast #{index + 1}</span>
                      </CardTitle>
                      {podcastForms.length > 1 && (
                        <Button
                          onClick={() => removePodcastForm(index)}
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
                        <Label htmlFor={`podcast-title-${index}`}>Title *</Label>
                        <Input
                          id={`podcast-title-${index}`}
                          value={form.title}
                          onChange={(e) => updatePodcastForm(index, 'title', e.target.value)}
                          placeholder="Enter podcast title"
                          className="focus-ring"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`podcast-thumbnail-${index}`}>Thumbnail URL *</Label>
                        <Input
                          id={`podcast-thumbnail-${index}`}
                          type="url"
                          value={form.thumbnail}
                          onChange={(e) => updatePodcastForm(index, 'thumbnail', e.target.value)}
                          placeholder="https://example.com/thumbnail.jpg"
                          className="focus-ring"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`podcast-description-${index}`}>Description *</Label>
                      <Textarea
                        id={`podcast-description-${index}`}
                        value={form.description}
                        onChange={(e) => updatePodcastForm(index, 'description', e.target.value)}
                        placeholder="Enter podcast description"
                        rows={3}
                        className="focus-ring resize-none"
                        required
                      />
                    </div>

                    <Separator className="bg-white/10" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`podcast-drive-${index}`}>Google Drive Link *</Label>
                        <Input
                          id={`podcast-drive-${index}`}
                          type="url"
                          value={form.drive}
                          onChange={(e) => updatePodcastForm(index, 'drive', e.target.value)}
                          placeholder="https://drive.google.com/..."
                          className="focus-ring"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`podcast-linkedin-${index}`}>LinkedIn URL</Label>
                        <Input
                          id={`podcast-linkedin-${index}`}
                          type="url"
                          value={form.linkedin}
                          onChange={(e) => updatePodcastForm(index, 'linkedin', e.target.value)}
                          placeholder="https://linkedin.com/..."
                          className="focus-ring"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`podcast-instagram-${index}`}>Instagram URL</Label>
                        <Input
                          id={`podcast-instagram-${index}`}
                          type="url"
                          value={form.instagram}
                          onChange={(e) => updatePodcastForm(index, 'instagram', e.target.value)}
                          placeholder="https://instagram.com/..."
                          className="focus-ring"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`podcast-facebook-${index}`}>Facebook URL</Label>
                        <Input
                          id={`podcast-facebook-${index}`}
                          type="url"
                          value={form.facebook}
                          onChange={(e) => updatePodcastForm(index, 'facebook', e.target.value)}
                          placeholder="https://facebook.com/..."
                          className="focus-ring"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Manage Events</h2>
              <div className="flex gap-2">
                <Button onClick={addEventForm} variant="outline" className="btn-secondary">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Another Event
                </Button>
                <Button onClick={handleEventSubmit} className="btn-primary" disabled={isSubmittingEvents}>
                  <Save className="mr-2 h-4 w-4" />
                  Submit All ({eventForms.length})
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              {eventForms.map((form, index) => (
                <Card key={index} className="surface">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-2">
                        <Calendar className="h-5 w-5 text-blue-400" />
                        <span>Event #{index + 1}</span>
                      </CardTitle>
                      {eventForms.length > 1 && (
                        <Button
                          onClick={() => removeEventForm(index)}
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
                        <Label htmlFor={`event-title-${index}`}>Title *</Label>
                        <Input
                          id={`event-title-${index}`}
                          value={form.title}
                          onChange={(e) => updateEventForm(index, 'title', e.target.value)}
                          placeholder="Enter event title"
                          className="focus-ring"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`event-topic-${index}`}>Topic *</Label>
                        <Input
                          id={`event-topic-${index}`}
                          value={form.topic}
                          onChange={(e) => updateEventForm(index, 'topic', e.target.value)}
                          placeholder="Enter event topic"
                          className="focus-ring"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`event-description-${index}`}>Description *</Label>
                      <Textarea
                        id={`event-description-${index}`}
                        value={form.description}
                        onChange={(e) => updateEventForm(index, 'description', e.target.value)}
                        placeholder="Enter event description"
                        rows={3}
                        className="focus-ring resize-none"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`event-date-${index}`}>Date *</Label>
                        <Input
                          id={`event-date-${index}`}
                          type="date"
                          value={form.date}
                          onChange={(e) => updateEventForm(index, 'date', e.target.value)}
                          className="focus-ring"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`event-time-${index}`}>Time *</Label>
                        <Input
                          id={`event-time-${index}`}
                          type="time"
                          value={form.time}
                          onChange={(e) => updateEventForm(index, 'time', e.target.value)}
                          className="focus-ring"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`event-location-${index}`}>Location *</Label>
                        <Input
                          id={`event-location-${index}`}
                          value={form.location}
                          onChange={(e) => updateEventForm(index, 'location', e.target.value)}
                          placeholder="Enter location"
                          className="focus-ring"
                          required
                        />
                      </div>
                    </div>

                    <Separator className="bg-white/10" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`event-luma-${index}`}>Lu.ma Link</Label>
                        <Input
                          id={`event-luma-${index}`}
                          type="url"
                          value={form.lumaLink}
                          onChange={(e) => updateEventForm(index, 'lumaLink', e.target.value)}
                          placeholder="https://lu.ma/..."
                          className="focus-ring"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`event-zoom-${index}`}>Zoom Link</Label>
                        <Input
                          id={`event-zoom-${index}`}
                          type="url"
                          value={form.zoomLink}
                          onChange={(e) => updateEventForm(index, 'zoomLink', e.target.value)}
                          placeholder="https://zoom.us/..."
                          className="focus-ring"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Sponsors</Label>
                        <Button
                          onClick={() => addSponsor(index)}
                          variant="ghost"
                          size="sm"
                          className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10"
                        >
                          <Plus className="mr-1 h-3 w-3" />
                          Add Sponsor
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {form.sponsors.map((sponsor, sponsorIndex) => (
                          <div key={sponsorIndex} className="flex gap-2">
                            <Input
                              value={sponsor}
                              onChange={(e) => updateSponsor(index, sponsorIndex, e.target.value)}
                              placeholder="Enter sponsor name"
                              className="focus-ring flex-1"
                            />
                            {form.sponsors.length > 1 && (
                              <Button
                                onClick={() => removeSponsor(index, sponsorIndex)}
                                variant="ghost"
                                size="icon"
                                className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            {/* MODIFICATION: Added comprehensive settings with admin and team management */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Admin Management Section */}
              {canManageAdmins && (
                <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Crown className="h-6 w-6 text-amber-400" />
                    <h2 className="text-xl font-bold">Admin Management</h2>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={addAdminForm} variant="outline" size="sm" className="btn-secondary">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Another
                    </Button>
                    <Button disabled={!canManageAdmins || isSubmittingAdmins} onClick={handleAdminSubmit} size="sm" className="btn-primary">
                      <Save className="mr-2 h-4 w-4" />
                      Submit ({adminForms.length})
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  {adminForms.map((form, index) => (
                    <Card key={index} className="surface">
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
                            onValueChange={(value) => updateAdminForm(index, 'role', value)}
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
              )
              }
              {/* Team Member Management Section */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Users className="h-6 w-6 text-cyan-400" />
                    <h2 className="text-xl font-bold">Team Management</h2>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={addTeamMemberForm} variant="outline" size="sm" className="btn-secondary">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Another
                    </Button>
                    <Button onClick={handleTeamMemberSubmit} size="sm" className="btn-primary" disabled={isSubmittingTeam}>
                      <Save className="mr-2 h-4 w-4" />
                      Submit ({teamMemberForms.length})
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  {teamMemberForms.map((form, index) => (
                    <Card key={index} className="surface">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center space-x-2 text-lg">
                            <Users className="h-5 w-5 text-cyan-400" />
                            <span>Team Member #{index + 1}</span>
                          </CardTitle>
                          {teamMemberForms.length > 1 && (
                            <Button
                              onClick={() => removeTeamMemberForm(index)}
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
                        {/* Basic Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`team-name-${index}`}>Name *</Label>
                            <Input
                              id={`team-name-${index}`}
                              value={form.name}
                              onChange={(e) => updateTeamMemberForm(index, 'name', e.target.value)}
                              placeholder="Enter full name"
                              className="focus-ring"
                              required
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor={`team-email-${index}`}>Email *</Label>
                            <Input
                              id={`team-email-${index}`}
                              type="email"
                              value={form.email}
                              onChange={(e) => updateTeamMemberForm(index, 'email', e.target.value)}
                              placeholder="member@tech-nest.org"
                              className="focus-ring"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`team-designation-${index}`}>Designation *</Label>
                          <Input
                            id={`team-designation-${index}`}
                            value={form.designation}
                            onChange={(e) => updateTeamMemberForm(index, 'designation', e.target.value)}
                            placeholder="e.g., Senior Security Consultant"
                            className="focus-ring"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`team-description-${index}`}>Description</Label>
                          <Textarea
                            id={`team-description-${index}`}
                            value={form.description}
                            onChange={(e) => updateTeamMemberForm(index, 'description', e.target.value)}
                            placeholder="Brief bio and expertise..."
                            rows={3}
                            className="focus-ring resize-none"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`team-image-${index}`}>Profile Image URL *</Label>
                          <Input
                            id={`team-image-${index}`}
                            type="url"
                            value={form.imageLink}
                            onChange={(e) => updateTeamMemberForm(index, 'imageLink', e.target.value)}
                            placeholder="https://example.com/profile.jpg"
                            className="focus-ring"
                            required
                          />
                        </div>

                        <Separator className="bg-white/10" />

                        {/* Social Links */}
                        <div className="space-y-4">
                          <h4 className="font-medium text-slate-300">Social Links</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`team-linkedin-${index}`}>LinkedIn</Label>
                              <Input
                                id={`team-linkedin-${index}`}
                                type="url"
                                value={form.linkedin}
                                onChange={(e) => updateTeamMemberForm(index, 'linkedin', e.target.value)}
                                placeholder="https://linkedin.com/in/..."
                                className="focus-ring"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor={`team-twitter-${index}`}>Twitter</Label>
                              <Input
                                id={`team-twitter-${index}`}
                                type="url"
                                value={form.twitter}
                                onChange={(e) => updateTeamMemberForm(index, 'twitter', e.target.value)}
                                placeholder="https://twitter.com/..."
                                className="focus-ring"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`team-github-${index}`}>GitHub</Label>
                              <Input
                                id={`team-github-${index}`}
                                type="url"
                                value={form.github}
                                onChange={(e) => updateTeamMemberForm(index, 'github', e.target.value)}
                                placeholder="https://github.com/..."
                                className="focus-ring"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor={`team-website-${index}`}>Website</Label>
                              <Input
                                id={`team-website-${index}`}
                                type="url"
                                value={form.website}
                                onChange={(e) => updateTeamMemberForm(index, 'website', e.target.value)}
                                placeholder="https://example.com"
                                className="focus-ring"
                              />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";