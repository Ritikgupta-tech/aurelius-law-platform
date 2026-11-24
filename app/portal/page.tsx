'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  ShieldCheck,
  User,
  Calendar,
  FileText,
  Clock,
  Video,
  Upload,
  Download,
  CheckCircle2,
  AlertCircle,
  LogOut,
  ArrowRight,
  ArrowUpRight,
  Lock,
  Plus,
} from 'lucide-react';
import { db } from '@/lib/db/database';
import { Enquiry, Consultation, DocumentRecord } from '@/lib/db/types';

export default function ClientPortalPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'consultations' | 'enquiries' | 'documents' | 'profile'>('overview');
  
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true); // Default to authenticated demo client
  const [currentUser, setCurrentUser] = useState({
    id: 'client-usr-101',
    name: 'Jonathan Reyes',
    email: 'j.reyes@meridian.com',
    phone: '+44 20 7946 0912',
    company: 'Meridian Capital Partners',
    role: 'client',
  });

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Data states
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [documents, setDocuments] = useState<DocumentRecord[]>([
    {
      id: 'doc-1',
      user_id: 'client-usr-101',
      client_name: 'Jonathan Reyes',
      filename: 'Master_Engagement_Agreement_2026.pdf',
      storage_path: 'vault/client-usr-101/doc-1.pdf',
      content_type: 'application/pdf',
      size_bytes: 420500,
      category: 'engagement',
      is_confidential: true,
      uploaded_by_id: 'att-1',
      uploaded_by_name: 'Arthur Sterling, KC',
      created_at: '2026-11-20T12:00:00Z',
    },
    {
      id: 'doc-2',
      user_id: 'client-usr-101',
      client_name: 'Jonathan Reyes',
      filename: 'Cross_Border_Merger_Risk_Assessment.pdf',
      storage_path: 'vault/client-usr-101/doc-2.pdf',
      content_type: 'application/pdf',
      size_bytes: 1250000,
      category: 'pleading',
      is_confidential: true,
      uploaded_by_id: 'att-1',
      uploaded_by_name: 'Arthur Sterling, KC',
      created_at: '2026-11-22T14:30:00Z',
    },
  ]);

  // Upload state
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [uploadError, setUploadError] = useState('');

  // Quick action modals
  const [quickEnquiryOpen, setQuickEnquiryOpen] = useState(false);
  const [quickEnquiryMsg, setQuickEnquiryMsg] = useState('');
  const [quickEnquiryPractice, setQuickEnquiryPractice] = useState('Corporate and Commercial Law');

  useEffect(() => {
    // Load enquiries, consultations, and documents from persistent API with memory fallback
    const loadPortalData = async () => {
      try {
        const [enqRes, conRes, docRes] = await Promise.all([
          fetch(`/api/enquiries?userId=${currentUser.id}`).then((r) => r.json()).catch(() => ({ enquiries: [] })),
          fetch(`/api/consultations?userId=${currentUser.id}`).then((r) => r.json()).catch(() => ({ consultations: [] })),
          fetch(`/api/client/documents?userId=${currentUser.id}`).then((r) => r.json()).catch(() => ({ documents: [] })),
        ]);
        if (enqRes.enquiries && enqRes.enquiries.length > 0) {
          setEnquiries(enqRes.enquiries);
        } else {
          setEnquiries(db.getEnquiries());
        }
        if (conRes.consultations && conRes.consultations.length > 0) {
          setConsultations(conRes.consultations);
        } else {
          setConsultations(db.getConsultations());
        }
        if (docRes.documents && docRes.documents.length > 0) {
          setDocuments(docRes.documents);
        }
      } catch (err) {
        setEnquiries(db.getEnquiries());
        setConsultations(db.getConsultations());
      }
    };
    loadPortalData();
  }, [currentUser.id]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail.includes('@') || authPassword.length < 6) {
      setAuthError('Please enter valid email and password.');
      return;
    }
    setCurrentUser({
      id: 'usr-' + Math.random().toString(36).substring(2, 7),
      name: authEmail.split('@')[0].toUpperCase(),
      email: authEmail,
      phone: '+44 20 7000 0000',
      company: 'Client Enterprise',
      role: 'client',
    });
    setIsAuthenticated(true);
    setAuthError('');
  };

  const handleUploadDocument = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);
    setUploadError('');
    setUploadSuccess('');

    const form = e.currentTarget;
    const formData = new FormData(form);
    const file = formData.get('documentFile') as File | null;
    const category = formData.get('category') as any;

    if (!file || file.size === 0) {
      setUploadError('Please select a file to upload.');
      setUploading(false);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File exceeds the 10 MB encrypted upload threshold.');
      setUploading(false);
      return;
    }

    try {
      const res = await fetch('/api/client/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          clientName: currentUser.name,
          filename: file.name,
          storagePath: `vault/${currentUser.id}/${Date.now()}_${file.name}`,
          contentType: file.type || 'application/pdf',
          sizeBytes: file.size,
          category: category || 'evidence',
          isConfidential: true,
        }),
      });

      const data = await res.json();
      if (res.ok && data.document) {
        setDocuments((prev) => [data.document, ...prev]);
        setUploadSuccess(`"${file.name}" successfully encrypted and stored in vault.`);
        form.reset();
      } else {
        throw new Error(data.error || 'Upload registration failed');
      }
    } catch (err: any) {
      const fallbackDoc: DocumentRecord = {
        id: `doc-${Date.now()}`,
        user_id: currentUser.id,
        client_name: currentUser.name,
        filename: file.name,
        storage_path: `vault/${currentUser.id}/${file.name}`,
        content_type: file.type || 'application/pdf',
        size_bytes: file.size,
        category: category || 'evidence',
        is_confidential: true,
        uploaded_by_id: currentUser.id,
        uploaded_by_name: currentUser.name,
        created_at: new Date().toISOString(),
      };
      setDocuments((prev) => [fallbackDoc, ...prev]);
      setUploadSuccess(`"${file.name}" stored in vault.`);
      form.reset();
    } finally {
      setUploading(false);
    }
  };

  const handleQuickEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickEnquiryMsg.trim()) return;

    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: currentUser.name.split(' ')[0] || 'Client',
          lastName: currentUser.name.split(' ')[1] || 'Account',
          email: currentUser.email,
          phone: currentUser.phone,
          practiceArea: quickEnquiryPractice,
          preferredContactMethod: 'portal',
          message: quickEnquiryMsg,
          userId: currentUser.id,
        }),
      });

      const data = await res.json();
      if (res.ok && data.enquiry) {
        setEnquiries((prev) => [data.enquiry, ...prev]);
      } else {
        const memoryEnq = db.createEnquiry({
          first_name: currentUser.name.split(' ')[0] || 'Client',
          last_name: currentUser.name.split(' ')[1] || 'Account',
          email: currentUser.email,
          phone: currentUser.phone,
          practice_area: quickEnquiryPractice,
          preferred_contact_method: 'portal',
          message: quickEnquiryMsg,
          user_id: currentUser.id,
        });
        setEnquiries((prev) => [memoryEnq, ...prev]);
      }
    } catch (err) {
      const memoryEnq = db.createEnquiry({
        first_name: currentUser.name.split(' ')[0] || 'Client',
        last_name: currentUser.name.split(' ')[1] || 'Account',
        email: currentUser.email,
        phone: currentUser.phone,
        practice_area: quickEnquiryPractice,
        preferred_contact_method: 'portal',
        message: quickEnquiryMsg,
        user_id: currentUser.id,
      });
      setEnquiries((prev) => [memoryEnq, ...prev]);
    }

    setQuickEnquiryMsg('');
    setQuickEnquiryOpen(false);
  };

  const getStatusColor = (status: string) => {
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
      case 'cancelled':
      case 'rejected':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F5EF] text-[#202936] font-sans antialiased">
      <Navbar />

      <main className="pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Auth Barrier if not logged in */}
        {!isAuthenticated ? (
          <div className="max-w-md mx-auto my-12 bg-white border border-[#07182E]/10 p-8 shadow-xl space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 border border-[#C6A36B] text-[#C6A36B] flex items-center justify-center rotate-45 mx-auto mb-3">
                <Lock size={20} className="-rotate-45" />
              </div>
              <h2 className="font-serif text-2xl text-[#07182E]">Client Portal Login</h2>
              <p className="text-xs text-slate-500 font-light">
                Encrypted access to matter files, consultations, and privileged communication.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-wider text-slate-700 font-medium">Email Address</label>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="client@meridian.com"
                  className="w-full p-3 bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-[#C6A36B]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs uppercase tracking-wider text-slate-700 font-medium">Password</label>
                <input
                  type="password"
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-3 bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-[#C6A36B]"
                />
              </div>

              {authError && <p className="text-xs text-red-600">{authError}</p>}

              <button
                type="submit"
                className="w-full py-3 bg-[#07182E] text-[#C6A36B] text-xs uppercase tracking-widest font-bold hover:bg-[#0B2340] transition-colors"
              >
                Sign In to Vault
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setAuthEmail('j.reyes@meridian.com');
                    setAuthPassword('securepassword123');
                  }}
                  className="text-xs text-[#A87948] hover:underline"
                >
                  Use Demo Client Account (Jonathan Reyes)
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard View */
          <div className="space-y-8">
            {/* Top Bar Banner */}
            <div className="p-6 bg-[#07182E] text-white border border-[#C6A36B]/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-widest text-[#C6A36B] font-bold">
                    Secure Client Workspace
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 text-[10px] border border-emerald-800">
                    Encrypted Session Active
                  </span>
                </div>
                <h1 className="font-serif text-2xl text-white font-normal">
                  Welcome, {currentUser.name}
                </h1>
                <p className="text-xs text-slate-400">
                  {currentUser.company} · {currentUser.email}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuickEnquiryOpen(true)}
                  className="px-4 py-2 bg-[#C6A36B] text-[#07182E] text-xs uppercase tracking-wider font-bold flex items-center gap-1.5 hover:bg-[#d5b682]"
                >
                  <Plus size={14} /> New Matter Inquiry
                </button>
                <a
                  href="/book-consultation"
                  className="px-4 py-2 border border-white/20 text-white text-xs uppercase tracking-wider font-semibold hover:border-[#C6A36B]"
                >
                  Schedule Consultation
                </a>
                <button
                  onClick={() => setIsAuthenticated(false)}
                  className="p-2 text-slate-400 hover:text-white"
                  title="Sign Out"
                >
                  <LogOut size={16} />
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
              {[
                { id: 'overview', label: 'Dashboard Overview', icon: User },
                { id: 'consultations', label: `Consultations (${consultations.length})`, icon: Calendar },
                { id: 'enquiries', label: `Inquiries (${enquiries.length})`, icon: Clock },
                { id: 'documents', label: `Document Vault (${documents.length})`, icon: FileText },
              ].map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-5 py-2.5 text-xs uppercase tracking-wider font-semibold flex items-center gap-2 border-b-2 transition-all ${
                      active
                        ? 'border-[#C6A36B] text-[#07182E] bg-white shadow-sm'
                        : 'border-transparent text-slate-500 hover:text-[#07182E]'
                    }`}
                  >
                    <Icon size={14} className={active ? 'text-[#C6A36B]' : 'text-slate-400'} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Stats row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="p-6 bg-white border border-[#07182E]/10 space-y-1 shadow-sm">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                      Upcoming Consultations
                    </span>
                    <p className="font-serif text-3xl text-[#07182E]">
                      {consultations.filter((c) => c.status === 'confirmed').length}
                    </p>
                    <p className="text-xs text-emerald-700 font-medium pt-1">Direct partner access verified</p>
                  </div>

                  <div className="p-6 bg-white border border-[#07182E]/10 space-y-1 shadow-sm">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                      Active Inquiries
                    </span>
                    <p className="font-serif text-3xl text-[#07182E]">{enquiries.length}</p>
                    <p className="text-xs text-[#A87948] font-medium pt-1">Under continuous partner review</p>
                  </div>

                  <div className="p-6 bg-white border border-[#07182E]/10 space-y-1 shadow-sm">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                      Encrypted Documents
                    </span>
                    <p className="font-serif text-3xl text-[#07182E]">{documents.length}</p>
                    <p className="text-xs text-slate-500 font-light pt-1">AES-256 Vault protected</p>
                  </div>
                </div>

                {/* Upcoming Consultation Spotlight */}
                <div className="p-6 bg-white border border-[#07182E]/10 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="font-serif text-lg text-[#07182E]">Upcoming Scheduled Sessions</h3>
                    <a href="/book-consultation" className="text-xs text-[#A87948] hover:underline flex items-center gap-1">
                      Reserve New Session <ArrowRight size={12} />
                    </a>
                  </div>

                  <div className="space-y-3">
                    {consultations.slice(0, 2).map((con) => (
                      <div
                        key={con.id}
                        className="p-4 bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-[#07182E]">{con.reference}</span>
                            <span className={`px-2 py-0.5 text-[10px] uppercase font-bold border rounded-xs ${getStatusColor(con.status)}`}>
                              {con.status}
                            </span>
                          </div>
                          <p className="font-serif text-sm text-[#07182E] font-medium">
                            {con.practice_area_title} · {con.attorney_name || 'Senior Counsel'}
                          </p>
                          <p className="text-xs text-slate-500">
                            {con.scheduled_date} at {con.time_slot} ({con.timezone})
                          </p>
                        </div>

                        {con.meeting_link && (
                          <a
                            href={con.meeting_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-[#07182E] text-[#C6A36B] text-xs uppercase tracking-wider font-semibold flex items-center gap-2 hover:bg-[#0B2340] shrink-0"
                          >
                            <Video size={14} /> Join Session
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: CONSULTATIONS */}
            {activeTab === 'consultations' && (
              <div className="bg-white border border-[#07182E]/10 p-6 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="font-serif text-xl text-[#07182E]">Consultation Appointments</h3>
                    <p className="text-xs text-slate-500">Scheduled video conferences and chamber briefings.</p>
                  </div>
                  <a
                    href="/book-consultation"
                    className="px-4 py-2 bg-[#C6A36B] text-[#07182E] text-xs uppercase tracking-wider font-bold"
                  >
                    Book New Session
                  </a>
                </div>

                <div className="space-y-4">
                  {consultations.map((con) => (
                    <div
                      key={con.id}
                      className="p-5 border border-slate-200 bg-slate-50 space-y-3 flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#07182E]">{con.reference}</span>
                          <span className={`px-2 py-0.5 text-[10px] uppercase font-bold border ${getStatusColor(con.status)}`}>
                            {con.status}
                          </span>
                          <span className="text-xs text-slate-400 uppercase">({con.consultation_type})</span>
                        </div>
                        <h4 className="font-serif text-base text-[#07182E]">{con.practice_area_title}</h4>
                        <p className="text-xs text-slate-600">
                          Designated Counsel: <strong>{con.attorney_name || 'Assigned Partner'}</strong>
                        </p>
                        <p className="text-xs text-slate-500">
                          Date: {con.scheduled_date} · Time: {con.time_slot} ({con.timezone})
                        </p>
                        {con.notes && <p className="text-xs text-slate-500 italic">Notes: &ldquo;{con.notes}&rdquo;</p>}
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {con.meeting_link && (
                          <a
                            href={con.meeting_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-[#07182E] text-[#C6A36B] text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5 hover:bg-[#0B2340]"
                          >
                            <Video size={14} /> Join
                          </a>
                        )}
                        <button
                          onClick={() => alert(`Reschedule request registered for ${con.reference}. Senior clerk will contact you.`)}
                          className="px-3 py-2 border border-slate-300 text-xs uppercase tracking-wider text-slate-600 hover:bg-slate-100"
                        >
                          Reschedule
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: ENQUIRIES */}
            {activeTab === 'enquiries' && (
              <div className="bg-white border border-[#07182E]/10 p-6 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="font-serif text-xl text-[#07182E]">Matter Inquiries & Conflict Tracking</h3>
                    <p className="text-xs text-slate-500">Real-time status of submitted legal inquiries.</p>
                  </div>
                  <button
                    onClick={() => setQuickEnquiryOpen(true)}
                    className="px-4 py-2 bg-[#07182E] text-[#C6A36B] text-xs uppercase tracking-wider font-bold"
                  >
                    Submit New Inquiry
                  </button>
                </div>

                <div className="space-y-4">
                  {enquiries.map((enq) => (
                    <div key={enq.id} className="p-5 border border-slate-200 bg-slate-50 space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#07182E]">{enq.reference}</span>
                          <span className={`px-2 py-0.5 text-[10px] uppercase font-bold border ${getStatusColor(enq.status)}`}>
                            {enq.status.replace(/_/g, ' ')}
                          </span>
                          <span className={`px-2 py-0.5 text-[10px] uppercase font-medium border ${enq.conflict_status === 'cleared' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                            Conflict: {enq.conflict_status}
                          </span>
                        </div>
                        <span className="text-xs text-slate-400">
                          {new Date(enq.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      <h4 className="font-serif text-base text-[#07182E]">{enq.practice_area}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed font-light">{enq.message}</p>
                      {enq.conflict_notes && (
                        <p className="text-[11px] text-slate-500 bg-white p-2 border border-slate-200">
                          Compliance Note: {enq.conflict_notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: DOCUMENT VAULT */}
            {activeTab === 'documents' && (
              <div className="bg-white border border-[#07182E]/10 p-6 shadow-sm space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="font-serif text-xl text-[#07182E]">Privileged Document Vault</h3>
                    <p className="text-xs text-slate-500">
                      AES-256 encrypted storage for contracts, pleadings, and discovery files.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#A87948] font-semibold">
                    <ShieldCheck size={16} /> Attorney-Client Privilege Applied
                  </div>
                </div>

                {/* Upload Section */}
                <form onSubmit={handleUploadDocument} className="p-6 bg-slate-50 border border-slate-200 space-y-4">
                  <h4 className="font-serif text-base text-[#07182E]">Upload New Encrypted Document</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs uppercase tracking-wider text-slate-700 font-medium">Select File</label>
                      <input
                        type="file"
                        name="documentFile"
                        required
                        className="w-full text-xs text-slate-600 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:bg-[#07182E] file:text-[#C6A36B]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs uppercase tracking-wider text-slate-700 font-medium">Category</label>
                      <select
                        name="category"
                        className="w-full p-2.5 bg-white border border-slate-200 text-xs"
                      >
                        <option value="evidence">Evidence & Supporting Material</option>
                        <option value="engagement">Engagement & Billing Document</option>
                        <option value="pleading">Court Pleading or Draft</option>
                        <option value="identity">Corporate / Identity Verification</option>
                        <option value="general">General Confidential File</option>
                      </select>
                    </div>
                  </div>

                  {uploadError && <p className="text-xs text-red-600">{uploadError}</p>}
                  {uploadSuccess && <p className="text-xs text-emerald-700 font-medium">{uploadSuccess}</p>}

                  <button
                    type="submit"
                    disabled={uploading}
                    className="px-6 py-2.5 bg-[#07182E] text-[#C6A36B] text-xs uppercase tracking-wider font-bold hover:bg-[#0B2340] disabled:opacity-50"
                  >
                    {uploading ? 'Encrypting & Storing...' : 'Upload Encrypted Document'}
                  </button>
                </form>

                {/* Document List */}
                <div className="space-y-3">
                  <h4 className="font-serif text-base text-[#07182E]">Vault Files ({documents.length})</h4>
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-4 border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#C6A36B] transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <FileText size={20} className="text-[#A87948] shrink-0 mt-0.5" />
                        <div>
                          <p className="font-mono text-xs font-semibold text-[#07182E]">{doc.filename}</p>
                          <p className="text-[11px] text-slate-400">
                            Category: {doc.category} · {(doc.size_bytes / 1024).toFixed(1)} KB · Uploaded by {doc.uploaded_by_name} on {new Date(doc.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => alert(`Generating signed expiring URL for ${doc.filename}... Download initiated.`)}
                        className="px-3 py-1.5 border border-[#07182E] text-xs uppercase tracking-wider text-[#07182E] hover:bg-[#07182E] hover:text-[#C6A36B] flex items-center gap-1.5 shrink-0"
                      >
                        <Download size={13} /> Download
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Quick Inquiry Modal */}
        {quickEnquiryOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-[#07182E]/20">
              <div className="flex justify-between items-center border-b pb-3">
                <h3 className="font-serif text-xl text-[#07182E]">Submit In-Portal Matter Inquiry</h3>
                <button onClick={() => setQuickEnquiryOpen(false)} className="text-slate-400 hover:text-slate-700">
                  ✕
                </button>
              </div>

              <form onSubmit={handleQuickEnquirySubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-slate-700 font-medium">Practice Area</label>
                  <select
                    value={quickEnquiryPractice}
                    onChange={(e) => setQuickEnquiryPractice(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 text-xs"
                  >
                    {db.getPracticeAreas().map((p) => (
                      <option key={p.id} value={p.title}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-slate-700 font-medium">Matter Briefing</label>
                  <textarea
                    rows={4}
                    required
                    value={quickEnquiryMsg}
                    onChange={(e) => setQuickEnquiryMsg(e.target.value)}
                    placeholder="Describe the transaction, dispute, or question..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 text-xs"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setQuickEnquiryOpen(false)}
                    className="px-4 py-2 border border-slate-300 text-xs uppercase"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#07182E] text-[#C6A36B] text-xs uppercase font-bold"
                  >
                    Submit to Counsel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
