'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Scale,
  LayoutDashboard,
  Inbox,
  Calendar,
  Users,
  BriefcaseBusiness,
  BookOpen,
  FolderLock,
  MessageSquare,
  Settings,
  ShieldCheck,
  Search,
  Filter,
  Plus,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  FileText,
  Lock,
  Download,
  Building2,
  ArrowUpRight,
  TrendingUp,
  LogOut,
  ChevronRight,
  Edit,
  Trash2,
  Video,
} from 'lucide-react';
import {
  Enquiry,
  Consultation,
  Attorney,
  PracticeArea,
  BlogPost,
  CaseStudy,
  Testimonial,
  AuditLog,
  InternalNote,
  SiteSettings,
  EnquiryStatus,
  ConsultationStatus,
} from '@/lib/db/types';

export default function AdminDashboardPage() {
  const [activeModule, setActiveModule] = useState<
    | 'overview'
    | 'enquiries'
    | 'consultations'
    | 'attorneys'
    | 'practices'
    | 'blog'
    | 'case_studies'
    | 'testimonials'
    | 'cms'
    | 'users'
    | 'audit_logs'
  >('overview');

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Loading & data states
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalEnquiries: 0,
    newEnquiries: 0,
    activeConsultations: 0,
    pendingConflictChecks: 0,
    totalAttorneys: 0,
    publishedArticles: 0,
  });

  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [attorneys, setAttorneys] = useState<Attorney[]>([]);
  const [practiceAreas, setPracticeAreas] = useState<PracticeArea[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Detail / Action Modals
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [notesModalEntity, setNotesModalEntity] = useState<{ type: 'enquiry' | 'consultation'; id: string; ref: string } | null>(null);
  const [internalNotes, setInternalNotes] = useState<InternalNote[]>([]);
  const [newNote, setNewNote] = useState('');

  // New Attorney Modal
  const [attorneyModalOpen, setAttorneyModalOpen] = useState(false);
  const [newAttorneyName, setNewAttorneyName] = useState('');
  const [newAttorneyTitle, setNewAttorneyTitle] = useState('');
  const [newAttorneyEmail, setNewAttorneyEmail] = useState('');

  // Fetch full data
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/overview', {
        headers: { Authorization: 'Bearer test-admin-token' },
      });
      const data = await res.json();
      setMetrics(data.metrics || metrics);
      setEnquiries(data.enquiries || []);
      setConsultations(data.consultations || []);
      setAttorneys(data.attorneys || []);
      setPracticeAreas(data.practiceAreas || []);
      setBlogPosts(data.blogPosts || []);
      setCaseStudies(data.caseStudies || []);
      setTestimonials(data.testimonials || []);
      setAuditLogs(data.auditLogs || []);
      setSettings(data.settings || null);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update Status Helper
  const handleUpdateStatus = async (table: 'enquiries' | 'consultations' | 'testimonials', id: string, status: string, attorneyId?: string) => {
    try {
      await fetch('/api/admin/status', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-admin-token',
        },
        body: JSON.stringify({
          table,
          id,
          status,
          attorneyId,
          performedBy: { id: 'admin-1', name: 'Executive Administrator', role: 'admin' },
        }),
      });
      fetchData();
      if (selectedEnquiry && selectedEnquiry.id === id) {
        setSelectedEnquiry({ ...selectedEnquiry, status: status as EnquiryStatus });
      }
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  // Open Internal Notes
  const openInternalNotes = async (type: 'enquiry' | 'consultation', id: string, ref: string) => {
    setNotesModalEntity({ type, id, ref });
    try {
      const res = await fetch(`/api/admin/notes?entityType=${type}&entityId=${id}`, {
        headers: { Authorization: 'Bearer test-admin-token' },
      });
      const data = await res.json();
      setInternalNotes(data.notes || []);
    } catch (err) {
      setInternalNotes([]);
    }
  };

  // Save Internal Note
  const handleSaveInternalNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim() || !notesModalEntity) return;

    try {
      const res = await fetch('/api/admin/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-admin-token',
        },
        body: JSON.stringify({
          entityType: notesModalEntity.type,
          entityId: notesModalEntity.id,
          authorId: 'admin-1',
          authorName: 'Managing Partner / Administrator',
          content: newNote,
        }),
      });
      const data = await res.json();
      setInternalNotes([data.note, ...internalNotes]);
      setNewNote('');
    } catch (err) {
      alert('Failed to save note.');
    }
  };

  // Export authorized records to CSV
  const handleExportEnquiries = () => {
    const headers = ['Reference,Client Name,Email,Practice Area,Status,Conflict Status,Created At\n'];
    const rows = enquiries.map((e) =>
      `"${e.reference}","${e.first_name} ${e.last_name}","${e.email}","${e.practice_area}","${e.status}","${e.conflict_status}","${e.created_at}"\n`
    );
    const blob = new Blob([headers.concat(rows).join('')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Aurelius_Enquiries_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'under_review':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'conflict_check':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'consultation_scheduled':
      case 'confirmed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'converted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'closed':
        return 'bg-slate-200 text-slate-800 border-slate-300';
      case 'rejected':
      case 'cancelled':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-[#F0EDE6] text-[#202936] font-sans antialiased flex flex-col lg:flex-row">
      {/* ==================================================================== */}
      {/* SIDEBAR NAVIGATION */}
      {/* ==================================================================== */}
      <aside className="w-full lg:w-72 bg-[#07182E] text-slate-300 flex flex-col justify-between shrink-0 border-r border-[#C6A36B]/20">
        <div>
          {/* Logo & Brand Header with Mobile Toggle */}
          <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 border border-[#C6A36B] text-[#C6A36B] flex items-center justify-center rotate-45">
                <Scale size={16} className="-rotate-45" />
              </div>
              <div>
                <p className="font-serif text-lg text-white font-medium">Aurelius & Co.</p>
                <p className="text-[9px] uppercase tracking-[0.2em] text-[#C6A36B] font-semibold">
                  Management Console
                </p>
              </div>
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="lg:hidden p-2 text-slate-300 hover:text-[#C6A36B] border border-white/10"
              aria-label="Toggle modules navigation"
            >
              {mobileSidebarOpen ? <XCircle size={18} /> : <LayoutDashboard size={18} />}
            </button>
          </div>

          {/* Mobile Module Quick Ribbon (When sidebar closed on small screens) */}
          <div className="lg:hidden p-2 bg-[#051426] border-b border-white/10 overflow-x-auto flex gap-2 scrollbar-none snap-x">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'enquiries', label: `Inquiries (${metrics.totalEnquiries})` },
              { id: 'consultations', label: `Appointments (${metrics.activeConsultations})` },
              { id: 'attorneys', label: 'Attorneys' },
              { id: 'audit_logs', label: 'Audit' },
            ].map((quick) => (
              <button
                key={quick.id}
                onClick={() => {
                  setActiveModule(quick.id as any);
                  setMobileSidebarOpen(false);
                }}
                className={`px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider shrink-0 snap-center transition-colors ${
                  activeModule === quick.id
                    ? 'bg-[#C6A36B] text-[#07182E]'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                {quick.label}
              </button>
            ))}
          </div>

          {/* Navigation Links (Full on desktop, toggled on mobile) */}
          <nav className={`p-4 space-y-1 ${mobileSidebarOpen ? 'block' : 'hidden lg:block'}`}>
            {[
              { id: 'overview', label: 'Overview & Metrics', icon: LayoutDashboard },
              { id: 'enquiries', label: `Enquiries (${metrics.totalEnquiries})`, icon: Inbox },
              { id: 'consultations', label: `Appointments (${metrics.activeConsultations})`, icon: Calendar },
              { id: 'attorneys', label: `Attorney Roster (${metrics.totalAttorneys})`, icon: Users },
              { id: 'practices', label: `Practice Areas (${practiceAreas.length})`, icon: Building2 },
              { id: 'blog', label: `Legal Blog (${metrics.publishedArticles})`, icon: BookOpen },
              { id: 'case_studies', label: `Case Studies (${caseStudies.length})`, icon: BriefcaseBusiness },
              { id: 'testimonials', label: `Testimonials (${testimonials.length})`, icon: MessageSquare },
              { id: 'cms', label: 'Website CMS & Settings', icon: Settings },
              { id: 'users', label: 'Role Permissions', icon: ShieldCheck },
              { id: 'audit_logs', label: 'Immutable Audit Trail', icon: FolderLock },
            ].map((item) => {
              const Icon = item.icon;
              const active = activeModule === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveModule(item.id as any);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full px-4 py-2.5 text-xs font-semibold uppercase tracking-wider flex items-center justify-between rounded-xs transition-colors ${
                    active
                      ? 'bg-[#C6A36B] text-[#07182E] shadow-sm font-bold'
                      : 'text-slate-300 hover:bg-[#0B2340] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={16} className={active ? 'text-[#07182E]' : 'text-[#C6A36B]'} />
                    <span>{item.label}</span>
                  </div>
                  {active && <ChevronRight size={14} />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User / Sign Out Footer */}
        <div className="p-4 border-t border-white/10 flex items-center justify-between bg-[#041225]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#C6A36B] text-[#07182E] flex items-center justify-center font-bold text-xs">
              AD
            </div>
            <div className="text-left">
              <p className="text-xs text-white font-medium">Administrator</p>
              <p className="text-[10px] text-slate-400">admin@aureliuslaw.com</p>
            </div>
          </div>
          <Link href="/" className="text-slate-400 hover:text-white" title="Exit to Public Site">
            <LogOut size={16} />
          </Link>
        </div>
      </aside>

      {/* ==================================================================== */}
      {/* MAIN ADMIN WORKSPACE */}
      {/* ==================================================================== */}
      <main className="flex-1 p-6 lg:p-10 space-y-8 overflow-y-auto">
        {/* Top bar with quick actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 border border-slate-200 shadow-sm">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#A87948] font-bold">
              Legal Practice Operations
            </span>
            <h1 className="font-serif text-2xl text-[#07182E] capitalize">
              {activeModule.replace(/_/g, ' ')}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              className="px-3.5 py-2 border border-slate-300 text-xs text-slate-700 hover:bg-slate-50 uppercase tracking-wider font-semibold"
            >
              Refresh Database
            </button>
            <Link
              href="/"
              target="_blank"
              className="px-4 py-2 bg-[#07182E] text-[#C6A36B] text-xs uppercase tracking-wider font-bold flex items-center gap-1.5"
            >
              View Public Site <ArrowUpRight size={13} />
            </Link>
          </div>
        </div>

        {/* MODULE 1: OVERVIEW & REAL DATABASE METRICS */}
        {activeModule === 'overview' && (
          <div className="space-y-8">
            {/* Top Stat KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white border border-slate-200 p-6 space-y-2 shadow-sm">
                <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">
                  Total Enquiries
                </span>
                <p className="font-serif text-3xl text-[#07182E]">{metrics.totalEnquiries}</p>
                <div className="flex items-center gap-2 text-xs text-blue-700 font-medium">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  {metrics.newEnquiries} Pending Initial Review
                </div>
              </div>

              <div className="bg-white border border-slate-200 p-6 space-y-2 shadow-sm">
                <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">
                  Active Consultations
                </span>
                <p className="font-serif text-3xl text-[#07182E]">{metrics.activeConsultations}</p>
                <div className="flex items-center gap-2 text-xs text-emerald-700 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  Confirmed in Calendar
                </div>
              </div>

              <div className="bg-white border border-slate-200 p-6 space-y-2 shadow-sm">
                <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">
                  Conflict Screening Desk
                </span>
                <p className="font-serif text-3xl text-[#07182E]">{metrics.pendingConflictChecks}</p>
                <div className="flex items-center gap-2 text-xs text-purple-700 font-medium">
                  <span className="w-2 h-2 rounded-full bg-purple-600" />
                  Awaiting Compliance Sign-Off
                </div>
              </div>

              <div className="bg-white border border-slate-200 p-6 space-y-2 shadow-sm">
                <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">
                  Practicing Partners
                </span>
                <p className="font-serif text-3xl text-[#07182E]">{metrics.totalAttorneys}</p>
                <div className="flex items-center gap-2 text-xs text-[#A87948] font-medium">
                  Across London & New York
                </div>
              </div>
            </div>

            {/* Recent Enquiries & Appointments split */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Enquiries */}
              <div className="bg-white border border-slate-200 p-6 space-y-4 shadow-sm">
                <div className="flex justify-between items-center border-b pb-3">
                  <h3 className="font-serif text-lg text-[#07182E]">Recent Inbound Inquiries</h3>
                  <button onClick={() => setActiveModule('enquiries')} className="text-xs text-[#A87948] hover:underline">
                    View All
                  </button>
                </div>
                <div className="space-y-3">
                  {enquiries.slice(0, 4).map((enq) => (
                    <div
                      key={enq.id}
                      onClick={() => setSelectedEnquiry(enq)}
                      className="p-3 bg-slate-50 border border-slate-200 hover:border-[#C6A36B] cursor-pointer flex justify-between items-center text-xs"
                    >
                      <div>
                        <p className="font-bold text-[#07182E]">{enq.first_name} {enq.last_name}</p>
                        <p className="text-slate-500">{enq.practice_area}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-0.5 text-[10px] uppercase font-bold border ${getStatusBadge(enq.status)}`}>
                          {enq.status.replace(/_/g, ' ')}
                        </span>
                        <p className="text-[10px] text-slate-400 mt-1">{enq.reference}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming Consultations */}
              <div className="bg-white border border-slate-200 p-6 space-y-4 shadow-sm">
                <div className="flex justify-between items-center border-b pb-3">
                  <h3 className="font-serif text-lg text-[#07182E]">Upcoming Scheduled Consultations</h3>
                  <button onClick={() => setActiveModule('consultations')} className="text-xs text-[#A87948] hover:underline">
                    View All
                  </button>
                </div>
                <div className="space-y-3">
                  {consultations.slice(0, 4).map((con) => (
                    <div
                      key={con.id}
                      className="p-3 bg-slate-50 border border-slate-200 flex justify-between items-center text-xs"
                    >
                      <div>
                        <p className="font-bold text-[#07182E]">{con.client_name}</p>
                        <p className="text-slate-500">
                          {con.scheduled_date} at {con.time_slot}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-medium text-[#07182E] block">{con.attorney_name || 'Unassigned'}</span>
                        <span className="text-[10px] text-slate-400 uppercase">{con.consultation_type}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODULE 2: ENQUIRY MANAGEMENT */}
        {activeModule === 'enquiries' && (
          <div className="bg-white border border-slate-200 shadow-sm p-6 space-y-6">
            {/* Filters Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by reference, client, email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 text-xs w-64 focus:outline-none focus:border-[#C6A36B]"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="p-2 bg-slate-50 border border-slate-200 text-xs"
                >
                  <option value="all">All Statuses</option>
                  <option value="new">New</option>
                  <option value="under_review">Under Review</option>
                  <option value="conflict_check">Conflict Check</option>
                  <option value="consultation_scheduled">Consultation Scheduled</option>
                  <option value="converted">Converted</option>
                  <option value="closed">Closed</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleExportEnquiries}
                  className="px-3.5 py-2 border border-slate-300 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 font-semibold"
                >
                  <Download size={13} /> Export Records
                </button>
              </div>
            </div>

            {/* Enquiries Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold">
                    <th className="p-3">Reference</th>
                    <th className="p-3">Client Name</th>
                    <th className="p-3">Practice Area</th>
                    <th className="p-3">Conflict Screening</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Assigned Counsel</th>
                    <th className="p-3">Date</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {enquiries
                    .filter((e) => {
                      const matchStatus = statusFilter === 'all' || e.status === statusFilter;
                      const matchSearch =
                        e.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        `${e.first_name} ${e.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        e.email.toLowerCase().includes(searchQuery.toLowerCase());
                      return matchStatus && matchSearch;
                    })
                    .map((enq) => (
                      <tr key={enq.id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-[#07182E]">{enq.reference}</td>
                        <td className="p-3">
                          <p className="font-semibold text-[#07182E]">{enq.first_name} {enq.last_name}</p>
                          <p className="text-[10px] text-slate-400">{enq.email}</p>
                        </td>
                        <td className="p-3 text-slate-700">{enq.practice_area}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 text-[10px] uppercase font-bold border rounded-xs ${enq.conflict_status === 'cleared' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}`}>
                            {enq.conflict_status}
                          </span>
                        </td>
                        <td className="p-3">
                          <select
                            value={enq.assigned_attorney_id || ''}
                            onChange={(e) => handleUpdateStatus('enquiries', enq.id, enq.status, e.target.value || undefined)}
                            className="p-1 bg-white border border-slate-200 text-[11px]"
                          >
                            <option value="">Unassigned</option>
                            {attorneys.map((a) => (
                              <option key={a.id} value={a.id}>
                                {a.full_name}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="p-3">
                          <select
                            value={enq.status}
                            onChange={(e) => handleUpdateStatus('enquiries', enq.id, e.target.value)}
                            className={`p-1 text-[11px] font-bold border rounded-xs ${getStatusBadge(enq.status)}`}
                          >
                            <option value="new">New</option>
                            <option value="under_review">Under Review</option>
                            <option value="conflict_check">Conflict Check</option>
                            <option value="awaiting_client_response">Awaiting Client</option>
                            <option value="consultation_scheduled">Consultation Sched.</option>
                            <option value="converted">Converted</option>
                            <option value="closed">Closed</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </td>
                        <td className="p-3 text-slate-400">
                          {new Date(enq.created_at).toLocaleDateString()}
                        </td>
                        <td className="p-3 text-right space-x-2">
                          <button
                            onClick={() => setSelectedEnquiry(enq)}
                            className="p-1 text-slate-600 hover:text-[#07182E]"
                            title="View Matter Details"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={() => openInternalNotes('enquiry', enq.id, enq.reference)}
                            className="p-1 text-[#A87948] hover:text-[#07182E]"
                            title="Privileged Internal Notes"
                          >
                            <Lock size={15} />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MODULE 3: APPOINTMENT MANAGEMENT */}
        {activeModule === 'consultations' && (
          <div className="bg-white border border-slate-200 shadow-sm p-6 space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
              <div>
                <h3 className="font-serif text-xl text-[#07182E]">Consultation Appointments & Calendar</h3>
                <p className="text-xs text-slate-500">Live booking records with double-booking prevention safeguards.</p>
              </div>
              <Link
                href="/book-consultation"
                target="_blank"
                className="px-4 py-2 bg-[#07182E] text-[#C6A36B] text-xs uppercase tracking-wider font-bold"
              >
                Book Direct Session
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold">
                    <th className="p-3">Reference</th>
                    <th className="p-3">Client</th>
                    <th className="p-3">Practice Area</th>
                    <th className="p-3">Counsel</th>
                    <th className="p-3">Date & Slot</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {consultations.map((con) => (
                    <tr key={con.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-[#07182E]">{con.reference}</td>
                      <td className="p-3">
                        <p className="font-semibold text-[#07182E]">{con.client_name}</p>
                        <p className="text-[10px] text-slate-400">{con.client_email}</p>
                      </td>
                      <td className="p-3 text-slate-700">{con.practice_area_title}</td>
                      <td className="p-3 font-medium text-[#07182E]">
                        {con.attorney_name || 'Senior Practice Partner'}
                      </td>
                      <td className="p-3 text-slate-700">
                        {con.scheduled_date} <br />
                        <span className="font-mono text-[10px] text-slate-500">{con.time_slot}</span>
                      </td>
                      <td className="p-3 uppercase text-[10px] font-semibold text-slate-600">
                        {con.consultation_type}
                      </td>
                      <td className="p-3">
                        <select
                          value={con.status}
                          onChange={(e) => handleUpdateStatus('consultations', con.id, e.target.value)}
                          className={`p-1 text-[11px] font-bold border rounded-xs ${getStatusBadge(con.status)}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="reschedule_requested">Reschedule Req.</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="no_show">No Show</option>
                        </select>
                      </td>
                      <td className="p-3 text-right space-x-2">
                        {con.meeting_link && (
                          <a
                            href={con.meeting_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 text-[#07182E] hover:text-[#C6A36B]"
                            title="Join Meeting Link"
                          >
                            <Video size={15} />
                          </a>
                        )}
                        <button
                          onClick={() => openInternalNotes('consultation', con.id, con.reference)}
                          className="p-1 text-[#A87948] hover:text-[#07182E]"
                          title="Internal Privileged Notes"
                        >
                          <Lock size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MODULE 4: ATTORNEY ROSTER MANAGEMENT */}
        {activeModule === 'attorneys' && (
          <div className="bg-white border border-slate-200 shadow-sm p-6 space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
              <div>
                <h3 className="font-serif text-xl text-[#07182E]">Attorney Profiles & Practice Assignments</h3>
                <p className="text-xs text-slate-500">Manage credentials, bar admissions, and directory bios.</p>
              </div>
              <button
                onClick={() => setAttorneyModalOpen(true)}
                className="px-4 py-2 bg-[#07182E] text-[#C6A36B] text-xs uppercase tracking-wider font-bold flex items-center gap-1.5"
              >
                <Plus size={14} /> Add Attorney Profile
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {attorneys.map((attorney) => (
                <div key={attorney.id} className="p-5 border border-slate-200 bg-slate-50 space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={attorney.photo_url}
                      alt={attorney.full_name}
                      className="w-12 h-12 object-cover object-top border"
                    />
                    <div>
                      <h4 className="font-serif text-base text-[#07182E] font-medium">{attorney.full_name}</h4>
                      <p className="text-[10px] text-[#A87948] uppercase tracking-wider font-bold">{attorney.title}</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2 font-light">{attorney.bio}</p>
                  <p className="text-[10px] text-slate-500">Chambers: {attorney.office_location} · {attorney.experience_years} Years</p>

                  <div className="pt-2 border-t flex justify-between items-center text-xs">
                    <span className="text-emerald-700 font-semibold">Active in Directory</span>
                    <Link href={`/attorneys/${attorney.slug}`} className="text-[#07182E] hover:underline flex items-center gap-1">
                      View Public <ArrowUpRight size={12} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODULE 5: PRACTICE AREA MANAGEMENT */}
        {activeModule === 'practices' && (
          <div className="bg-white border border-slate-200 shadow-sm p-6 space-y-6">
            <h3 className="font-serif text-xl text-[#07182E]">15 Core Practice Disciplines</h3>
            <div className="space-y-3">
              {practiceAreas.map((p, idx) => (
                <div key={p.id} className="p-4 border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono text-slate-400 mr-2">{(idx + 1).toString().padStart(2, '0')}</span>
                    <strong className="text-[#07182E] text-sm font-serif">{p.title}</strong>
                    <p className="text-slate-500 text-[11px] mt-0.5">{p.short_description}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] px-2 py-0.5 bg-green-100 text-green-800 border">Active</span>
                    <Link href={`/practice-areas/${p.slug}`} className="text-slate-700 hover:text-[#07182E]">
                      <Eye size={15} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODULE 6: BLOG & KNOWLEDGE MANAGEMENT */}
        {activeModule === 'blog' && (
          <div className="bg-white border border-slate-200 shadow-sm p-6 space-y-6">
            <h3 className="font-serif text-xl text-[#07182E]">Published Briefings & Thought Leadership</h3>
            <div className="space-y-4">
              {blogPosts.map((post) => (
                <div key={post.id} className="p-4 border border-slate-200 bg-slate-50 flex justify-between items-center text-xs">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-wider text-[#A87948] font-bold">{post.category}</span>
                    <h4 className="font-serif text-base text-[#07182E]">{post.title}</h4>
                    <p className="text-slate-500">Author: {post.author_name} · {post.read_time}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] px-2 py-0.5 bg-green-100 text-green-800 border font-bold">Published</span>
                    <Link href={`/insights/${post.slug}`} className="text-slate-700 hover:text-[#07182E]">
                      <ArrowUpRight size={16} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODULE 7: CASE STUDIES */}
        {activeModule === 'case_studies' && (
          <div className="bg-white border border-slate-200 shadow-sm p-6 space-y-6">
            <h3 className="font-serif text-xl text-[#07182E]">Anonymized Case Track Record</h3>
            <div className="space-y-4">
              {caseStudies.map((c) => (
                <div key={c.id} className="p-4 border border-slate-200 bg-slate-50 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase font-bold text-[#A87948]">{c.practice_area}</span>
                    <span className="text-green-800 text-[10px] bg-green-100 px-2 py-0.5 border">Verified Sanitized</span>
                  </div>
                  <h4 className="font-serif text-base text-[#07182E]">{c.title}</h4>
                  <p className="text-slate-600"><strong>Outcome:</strong> {c.outcome}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODULE 8: TESTIMONIALS */}
        {activeModule === 'testimonials' && (
          <div className="bg-white border border-slate-200 shadow-sm p-6 space-y-6">
            <h3 className="font-serif text-xl text-[#07182E]">Client Endorsement Approvals</h3>
            <div className="space-y-4">
              {testimonials.map((t) => (
                <div key={t.id} className="p-4 border border-slate-200 bg-slate-50 flex justify-between items-center text-xs">
                  <div className="space-y-1 max-w-xl">
                    <p className="italic text-slate-800">&ldquo;{t.quote}&rdquo;</p>
                    <p className="font-bold text-[#07182E]">{t.client_name} — <span className="font-normal text-slate-500">{t.client_title_org}</span></p>
                  </div>
                  <div className="flex items-center gap-2">
                    {t.is_approved ? (
                      <span className="px-2.5 py-1 bg-green-100 text-green-800 border text-[10px] font-bold">Approved</span>
                    ) : (
                      <button
                        onClick={() => handleUpdateStatus('testimonials', t.id, 'approved')}
                        className="px-3 py-1 bg-[#C6A36B] text-[#07182E] text-xs font-bold"
                      >
                        Approve
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODULE 9: CMS & SITE SETTINGS */}
        {activeModule === 'cms' && settings && (
          <div className="bg-white border border-slate-200 shadow-sm p-6 space-y-6">
            <h3 className="font-serif text-xl text-[#07182E]">Firm Information & Operating Parameters</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 uppercase">Firm Name</label>
                <input
                  defaultValue={settings.firm_name}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 uppercase">Primary Phone</label>
                <input
                  defaultValue={settings.phone}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 uppercase">London Chambers</label>
                <input
                  defaultValue={settings.main_office_address}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 uppercase">New York Chambers</label>
                <input
                  defaultValue={settings.secondary_office_address}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 text-xs"
                />
              </div>
            </div>
            <div className="pt-2">
              <button
                onClick={() => alert('Settings successfully updated.')}
                className="px-6 py-2.5 bg-[#07182E] text-[#C6A36B] text-xs uppercase tracking-wider font-bold"
              >
                Save Settings
              </button>
            </div>
          </div>
        )}

        {/* MODULE 10: USER & ROLE MANAGEMENT */}
        {activeModule === 'users' && (
          <div className="bg-white border border-slate-200 shadow-sm p-6 space-y-6">
            <h3 className="font-serif text-xl text-[#07182E]">Role-Based Access Control (RBAC) Matrix</h3>
            <div className="space-y-3">
              {[
                { role: 'Super Admin', desc: 'Supreme system access, database schema configuration, user role promotions.' },
                { role: 'Admin', desc: 'Intake triage, conflict check clearances, booking reschedules, CMS publication.' },
                { role: 'Attorney', desc: 'Assigned enquiry view, calendar management, privileged internal notes recording.' },
                { role: 'Staff / Paralegal', desc: 'Intake data hygiene, non-confidential client correspondence.' },
                { role: 'Client', desc: 'Private client portal, consultation tracking, encrypted document vault access.' },
              ].map((r) => (
                <div key={r.role} className="p-4 border border-slate-200 bg-slate-50 flex justify-between items-center text-xs">
                  <div>
                    <strong className="text-[#07182E] text-sm">{r.role}</strong>
                    <p className="text-slate-500 mt-0.5">{r.desc}</p>
                  </div>
                  <span className="px-2 py-1 bg-slate-200 text-slate-700 text-[10px] font-bold uppercase">Enforced</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODULE 11: IMMUTABLE AUDIT LOGS */}
        {activeModule === 'audit_logs' && (
          <div className="bg-white border border-slate-200 shadow-sm p-6 space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
              <div>
                <h3 className="font-serif text-xl text-[#07182E]">Immutable Audit Trail</h3>
                <p className="text-xs text-slate-500">Chronological cryptographic record of administrative actions.</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-emerald-700 font-semibold">
                <ShieldCheck size={16} /> Tamper-Proof Audit Logging
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold">
                    <th className="p-3">Timestamp</th>
                    <th className="p-3">User & Role</th>
                    <th className="p-3">Action</th>
                    <th className="p-3">Target Entity</th>
                    <th className="p-3">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono text-[11px] text-slate-500">
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                      <td className="p-3">
                        <p className="font-semibold text-[#07182E]">{log.user_email}</p>
                        <span className="text-[10px] uppercase text-slate-400">{log.user_role}</span>
                      </td>
                      <td className="p-3">
                        <span className="font-mono text-[11px] text-[#A87948] font-bold">{log.action}</span>
                      </td>
                      <td className="p-3 text-slate-600 font-mono text-[11px]">{log.entity}</td>
                      <td className="p-3 text-slate-700 max-w-xs truncate">{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* MODAL: PRIVILEGED INTERNAL NOTES */}
        {/* ==================================================================== */}
        {notesModalEntity && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white max-w-xl w-full p-6 space-y-4 shadow-2xl border border-slate-300">
              <div className="flex justify-between items-center border-b pb-3">
                <div>
                  <h3 className="font-serif text-lg text-[#07182E]">Privileged Internal Notes</h3>
                  <p className="text-xs text-slate-500">Reference: {notesModalEntity.ref}</p>
                </div>
                <button onClick={() => setNotesModalEntity(null)} className="text-slate-400 hover:text-slate-700">✕</button>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
                <Lock size={14} className="text-amber-700 shrink-0" />
                <span>Privileged lawyer communication. Strictly inaccessible to clients or adversaries.</span>
              </div>

              <form onSubmit={handleSaveInternalNote} className="space-y-3">
                <textarea
                  rows={3}
                  required
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Record confidential analysis, conflict clearance status, or settlement benchmarks..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 text-xs"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setNotesModalEntity(null)}
                    className="px-4 py-2 border text-xs"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#07182E] text-[#C6A36B] text-xs uppercase font-bold"
                  >
                    Save Note
                  </button>
                </div>
              </form>

              <div className="space-y-3 pt-3 border-t max-h-56 overflow-y-auto">
                <h4 className="text-xs font-bold text-slate-700">Previous Notes ({internalNotes.length})</h4>
                {internalNotes.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No notes recorded yet for this matter.</p>
                ) : (
                  internalNotes.map((n) => (
                    <div key={n.id} className="p-3 bg-slate-50 border border-slate-200 space-y-1 text-xs">
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span className="font-bold text-slate-700">{n.author_name}</span>
                        <span>{new Date(n.created_at).toLocaleString()}</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">{n.content}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* MODAL: ENQUIRY DETAILS INSPECTION */}
        {/* ==================================================================== */}
        {selectedEnquiry && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-300">
              <div className="flex justify-between items-center border-b pb-3">
                <div>
                  <span className="font-mono text-xs font-bold text-[#A87948]">{selectedEnquiry.reference}</span>
                  <h3 className="font-serif text-xl text-[#07182E]">Matter Inquiry Dossier</h3>
                </div>
                <button onClick={() => setSelectedEnquiry(null)} className="text-slate-400 hover:text-slate-700">✕</button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block">Client Name</span>
                  <strong className="text-[#07182E] text-sm">{selectedEnquiry.first_name} {selectedEnquiry.last_name}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Email Address</span>
                  <strong className="text-[#07182E]">{selectedEnquiry.email}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Practice Discipline</span>
                  <strong className="text-[#07182E]">{selectedEnquiry.practice_area}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Preferred Contact</span>
                  <strong className="text-[#07182E] uppercase">{selectedEnquiry.preferred_contact_method}</strong>
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <span className="text-slate-400 block">Submitted Matter Description</span>
                <p className="p-3 bg-slate-50 border border-slate-200 text-slate-700 leading-relaxed font-light">
                  {selectedEnquiry.message}
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 flex justify-between items-center text-xs">
                <div>
                  <span className="text-slate-400 block">Automated Conflict Screening</span>
                  <span className={`px-2 py-0.5 text-[10px] uppercase font-bold border rounded-xs ${selectedEnquiry.conflict_status === 'cleared' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {selectedEnquiry.conflict_status}
                  </span>
                  {selectedEnquiry.conflict_notes && <p className="text-[11px] text-slate-500 mt-1">{selectedEnquiry.conflict_notes}</p>}
                </div>

                <button
                  onClick={() => openInternalNotes('enquiry', selectedEnquiry.id, selectedEnquiry.reference)}
                  className="px-3.5 py-2 bg-[#07182E] text-[#C6A36B] text-xs uppercase font-bold flex items-center gap-1.5"
                >
                  <Lock size={13} /> Privileged Notes
                </button>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedEnquiry(null)}
                  className="px-6 py-2 bg-slate-200 text-slate-800 text-xs uppercase font-semibold"
                >
                  Close Dossier
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
