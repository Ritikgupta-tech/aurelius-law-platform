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
  CreditCard,
  Receipt,
  FileCheck2,
  Landmark,
  Check,
  ExternalLink,
} from 'lucide-react';
import { db } from '@/lib/db/database';
import { Enquiry, Consultation, DocumentRecord, InvoiceRecord, EngagementLetter } from '@/lib/db/types';

export default function ClientPortalPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'consultations' | 'enquiries' | 'documents' | 'billing' | 'engagement' | 'profile'>('overview');
  
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

  // Billing & Invoices state
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceRecord | null>(null);
  const [payingInvoice, setPayingInvoice] = useState<InvoiceRecord | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState<string | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Engagement Mandates & E-Signature state
  const [engagementLetters, setEngagementLetters] = useState<EngagementLetter[]>([]);
  const [signingLetter, setSigningLetter] = useState<EngagementLetter | null>(null);
  const [signatureText, setSignatureText] = useState('');
  const [signingLoading, setSigningLoading] = useState(false);
  const [signingSuccess, setSigningSuccess] = useState<string | null>(null);

  // Upload state
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [uploadError, setUploadError] = useState('');

  // Quick action modals
  const [quickEnquiryOpen, setQuickEnquiryOpen] = useState(false);
  const [quickEnquiryMsg, setQuickEnquiryMsg] = useState('');
  const [quickEnquiryPractice, setQuickEnquiryPractice] = useState('Corporate and Commercial Law');

  useEffect(() => {
    // Load enquiries, consultations, documents, invoices, and engagement letters
    const loadPortalData = async () => {
      try {
        const [enqRes, conRes, docRes, invRes, engRes] = await Promise.all([
          fetch(`/api/enquiries?userId=${currentUser.id}`).then((r) => r.json()).catch(() => ({ enquiries: [] })),
          fetch(`/api/consultations?userId=${currentUser.id}`).then((r) => r.json()).catch(() => ({ consultations: [] })),
          fetch(`/api/client/documents?userId=${currentUser.id}`).then((r) => r.json()).catch(() => ({ documents: [] })),
          fetch(`/api/client/invoices?userId=${currentUser.id}`).then((r) => r.json()).catch(() => ({ invoices: [] })),
          fetch(`/api/client/engagement?userId=${currentUser.id}`).then((r) => r.json()).catch(() => ({ engagementLetters: [] })),
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
        if (invRes.invoices && invRes.invoices.length > 0) {
          setInvoices(invRes.invoices);
        } else {
          setInvoices(db.getInvoices(currentUser.id));
        }
        if (engRes.engagementLetters && engRes.engagementLetters.length > 0) {
          setEngagementLetters(engRes.engagementLetters);
        } else {
          setEngagementLetters(db.getEngagementLetters(currentUser.id));
        }
      } catch (err) {
        setEnquiries(db.getEnquiries());
        setConsultations(db.getConsultations());
        setInvoices(db.getInvoices(currentUser.id));
        setEngagementLetters(db.getEngagementLetters(currentUser.id));
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

  const handlePayInvoice = async (invoiceId: string, paymentMethod: string) => {
    setPaymentLoading(true);
    setPaymentSuccess(null);
    try {
      const res = await fetch('/api/client/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceId, paymentMethod }),
      });
      const data = await res.json();
      if (data.success && data.invoice) {
        setInvoices((prev) => prev.map((inv) => (inv.id === invoiceId ? data.invoice : inv)));
        setPaymentSuccess(`Fee note ${data.invoice.invoice_number} successfully settled. Trust ledger reconciled.`);
        setTimeout(() => {
          setPayingInvoice(null);
          setPaymentSuccess(null);
        }, 2200);
      }
    } catch (e) {
      alert('Payment processing failed. Please try again.');
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleSignEngagement = async (letterId: string) => {
    if (!signatureText.trim()) return;
    setSigningLoading(true);
    setSigningSuccess(null);
    try {
      const res = await fetch('/api/client/engagement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ letterId, signature: signatureText }),
      });
      const data = await res.json();
      if (data.success && data.engagementLetter) {
        setEngagementLetters((prev) =>
          prev.map((l) => (l.id === letterId ? data.engagementLetter : l))
        );
        setSigningSuccess(`Bilateral Engagement Mandate ${data.engagementLetter.letter_number} signed with SHA-256 seal.`);
        setTimeout(() => {
          setSigningLetter(null);
          setSigningSuccess(null);
          setSignatureText('');
        }, 2200);
      }
    } catch (e) {
      alert('E-signature execution failed. Please try again.');
    } finally {
      setSigningLoading(false);
    }
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
            <div className="flex overflow-x-auto sm:flex-wrap gap-2 border-b border-slate-200 pb-2 scrollbar-none snap-x">
              {[
                { id: 'overview', label: 'Dashboard Overview', icon: User },
                { id: 'consultations', label: `Consultations (${consultations.length})`, icon: Calendar },
                { id: 'enquiries', label: `Inquiries (${enquiries.length})`, icon: Clock },
                { id: 'documents', label: `Document Vault (${documents.length})`, icon: FileText },
                { id: 'billing', label: `Retainers & Invoices (${invoices.length})`, icon: CreditCard },
                { id: 'engagement', label: `Engagement Mandates (${engagementLetters.length})`, icon: FileCheck2 },
              ].map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-4 sm:px-5 py-2.5 text-xs uppercase tracking-wider font-semibold flex items-center gap-2 border-b-2 transition-all shrink-0 snap-center whitespace-nowrap ${
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

                  <div className="p-6 bg-white border border-[#07182E]/10 space-y-1 shadow-sm">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                      Trust Account Escrow
                    </span>
                    <p className="font-serif text-3xl text-[#C6A36B]">£45,000</p>
                    <p className="text-xs text-slate-500 font-light pt-1">SRA Bar Council Trust Monitored</p>
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

            {/* TAB 5: RETAINERS & INVOICES */}
            {activeTab === 'billing' && (
              <div className="space-y-8">
                {/* Chambers Escrow Trust Card */}
                <div className="p-6 sm:p-8 bg-gradient-to-br from-[#07182E] to-[#0B2340] text-white border border-[#C6A36B]/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Landmark size={18} className="text-[#C6A36B]" />
                      <span className="text-[10px] uppercase tracking-widest text-[#C6A36B] font-bold">
                        Regulated Chambers Trust Account (SRA Accounts Rules Compliant)
                      </span>
                    </div>
                    <h3 className="font-serif text-3xl sm:text-4xl text-white font-normal">
                      £45,000.00 <span className="text-xs font-sans text-slate-300 font-light">Available Trust Escrow</span>
                    </h3>
                    <p className="text-xs text-slate-300 max-w-xl font-light leading-relaxed">
                      Barclays Bank PLC · Account Ref: <span className="font-mono text-white">AURELIUS-CLIENT-TRUST-LON-09</span> · Funds held on segregated escrow reserve to settle verified partner hours and statutory court filing reserves.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                    <button
                      onClick={() => {
                        const pendingInv = invoices.find((i) => i.status === 'pending');
                        if (pendingInv) setPayingInvoice(pendingInv);
                        else alert('All current fee statements settled. Contact senior clerk to place additional retainer escrow.');
                      }}
                      className="px-5 py-3 bg-[#C6A36B] text-[#07182E] text-xs uppercase tracking-wider font-bold hover:bg-[#d5b682] shadow-lg flex items-center justify-center gap-2"
                    >
                      <CreditCard size={15} /> Replenish / Settle Retainer
                    </button>
                  </div>
                </div>

                {/* Invoices List */}
                <div className="bg-white border border-[#07182E]/10 p-6 shadow-sm space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="font-serif text-xl text-[#07182E]">Chambers Fee Statements & Retainer Invoices</h3>
                      <p className="text-xs text-slate-500">Itemized statements of legal services, disbursements, and statutory filings.</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Receipt size={15} className="text-[#A87948]" />
                      <span>{invoices.length} Total Statements</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {invoices.map((inv) => (
                      <div
                        key={inv.id}
                        className="p-5 border border-slate-200 bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[#C6A36B] transition-colors"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-xs font-bold text-[#07182E]">{inv.invoice_number}</span>
                            <span
                              className={`px-2 py-0.5 text-[10px] uppercase font-bold border ${
                                inv.status === 'paid'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse'
                              }`}
                            >
                              {inv.status === 'paid' ? 'Settled (Trust Reconciled)' : 'Pending Settlement'}
                            </span>
                            <span className="text-xs text-slate-400 font-mono">Ref: {inv.matter_reference}</span>
                          </div>
                          <h4 className="font-serif text-base text-[#07182E]">{inv.matter_title}</h4>
                          <p className="text-xs text-slate-500">
                            Issued: {inv.issue_date} · Due Date: {inv.due_date}
                            {inv.paid_at && ` · Settled via ${inv.payment_method}`}
                          </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                          <div className="text-left sm:text-right">
                            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">Total Due</span>
                            <span className="font-serif text-xl font-bold text-[#07182E]">
                              {inv.currency === 'GBP' ? '£' : inv.currency === 'USD' ? '$' : '€'}
                              {inv.total_amount.toLocaleString()}
                            </span>
                            <span className="text-[10px] text-slate-400 block font-light">Includes {inv.tax_amount ? `VAT £${inv.tax_amount.toLocaleString()}` : 'Disbursements'}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectedInvoice(inv)}
                              className="px-3 py-2 border border-slate-300 text-xs uppercase tracking-wider text-slate-700 hover:border-[#C6A36B] hover:text-[#07182E] flex items-center gap-1"
                            >
                              <FileText size={13} /> Statement
                            </button>

                            {inv.status === 'pending' && (
                              <button
                                onClick={() => setPayingInvoice(inv)}
                                className="px-4 py-2 bg-[#07182E] text-[#C6A36B] text-xs uppercase tracking-wider font-bold hover:bg-[#0B2340] flex items-center gap-1.5"
                              >
                                <CreditCard size={13} /> Settle Fee
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: ENGAGEMENT MANDATES & E-SIGNATURE */}
            {activeTab === 'engagement' && (
              <div className="bg-white border border-[#07182E]/10 p-6 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="font-serif text-xl text-[#07182E]">Bilateral Engagement Mandates</h3>
                    <p className="text-xs text-slate-500">
                      Formal attorney-client retention agreements executed under English Law & Bar Council standards.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#A87948] font-semibold">
                    <ShieldCheck size={16} /> Cryptographically Sealed
                  </div>
                </div>

                <div className="space-y-4">
                  {engagementLetters.map((letter) => (
                    <div
                      key={letter.id}
                      className="p-6 border border-slate-200 bg-slate-50 space-y-4 hover:border-[#C6A36B] transition-colors"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm font-bold text-[#07182E]">{letter.letter_number}</span>
                          <span
                            className={`px-2.5 py-0.5 text-[10px] uppercase font-bold border ${
                              letter.status === 'executed'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : 'bg-amber-50 text-amber-800 border-amber-300 animate-pulse'
                            }`}
                          >
                            {letter.status === 'executed' ? 'Mandate Formally Executed' : 'Awaiting Client E-Signature'}
                          </span>
                        </div>
                        <span className="text-xs text-slate-400 font-mono">
                          Issued: {new Date(letter.issued_at).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="space-y-2 text-xs text-slate-700">
                        <p>
                          <strong className="text-[#07182E] font-semibold">Engaged Parties:</strong> {letter.client_name} ({letter.client_entity}) ⇄ Aurelius & Co. ({letter.attorney_name})
                        </p>
                        <p className="leading-relaxed font-light text-slate-600">
                          <strong className="text-[#07182E] font-semibold">Scope of Representation:</strong> {letter.matter_scope}
                        </p>
                        <div className="pt-1 flex flex-wrap items-center gap-4 text-[11px] text-slate-500">
                          <span>Jurisdiction: High Court of Justice (England & Wales)</span>
                          <span className="font-mono">SHA-256 Seal: {letter.sha256_hash.substring(0, 16)}...</span>
                          {letter.signed_at && (
                            <span className="text-emerald-700 font-medium">Signed by: {letter.client_signature} on {new Date(letter.signed_at).toLocaleString()}</span>
                          )}
                        </div>
                      </div>

                      <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200">
                        {letter.status === 'pending_signature' ? (
                          <button
                            onClick={() => {
                              setSigningLetter(letter);
                              setSignatureText(currentUser.name);
                            }}
                            className="px-5 py-2.5 bg-[#07182E] text-[#C6A36B] text-xs uppercase tracking-wider font-bold hover:bg-[#0B2340] flex items-center gap-2 shadow-sm"
                          >
                            <FileCheck2 size={14} /> Review & Digitally Sign Mandate
                          </button>
                        ) : (
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                            <Check size={14} /> Executed Bilateral Mandate Active
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modal 1: Statement Viewer Modal */}
        {selectedInvoice && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white max-w-2xl w-full p-8 shadow-2xl border border-[#07182E]/20 space-y-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#A87948] font-bold">Aurelius & Co. · Fee Statement</span>
                  <h3 className="font-serif text-2xl text-[#07182E]">{selectedInvoice.invoice_number}</h3>
                  <p className="text-xs text-slate-500">Matter: {selectedInvoice.matter_title}</p>
                </div>
                <button onClick={() => setSelectedInvoice(null)} className="text-slate-400 hover:text-slate-700 p-2 text-lg">✕</button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs text-slate-600 border-b pb-4">
                <div>
                  <p className="font-semibold text-[#07182E]">Client Details</p>
                  <p>{selectedInvoice.client_name}</p>
                  <p>Meridian Capital Partners</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-[#07182E]">Dates & Terms</p>
                  <p>Issued: {selectedInvoice.issue_date}</p>
                  <p>Due: {selectedInvoice.due_date}</p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs uppercase font-bold tracking-wider text-slate-700">Itemized Services & Disbursements</p>
                <div className="border border-slate-200 divide-y divide-slate-100 text-xs">
                  {selectedInvoice.line_items.map((item, idx) => (
                    <div key={idx} className="p-3 flex justify-between items-start gap-4">
                      <div>
                        <p className="font-medium text-[#07182E]">{item.description}</p>
                        {item.hours && <p className="text-[11px] text-slate-400">{item.hours} hrs @ £{item.rate}/hr</p>}
                      </div>
                      <span className="font-mono font-semibold text-[#07182E]">£{item.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4 space-y-1.5 text-xs text-right">
                <p className="text-slate-500">Subtotal: <span className="font-mono text-[#07182E]">£{selectedInvoice.amount.toLocaleString()}</span></p>
                <p className="text-slate-500">VAT (20%): <span className="font-mono text-[#07182E]">£{selectedInvoice.tax_amount.toLocaleString()}</span></p>
                <p className="text-base font-serif font-bold text-[#07182E] pt-2">Total Payable: £{selectedInvoice.total_amount.toLocaleString()}</p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
                <span>Barclays Chambers Account · Sort: 20-00-00 · Acc: 89423101</span>
                <span className="font-semibold text-emerald-800">Status: {selectedInvoice.status.toUpperCase()}</span>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setSelectedInvoice(null)} className="px-5 py-2.5 border border-slate-300 text-xs uppercase font-semibold">
                  Close Statement
                </button>
                <button onClick={() => window.print()} className="px-5 py-2.5 bg-[#07182E] text-[#C6A36B] text-xs uppercase font-bold">
                  Print Statement
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal 2: Payment / Settlement Modal */}
        {payingInvoice && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white max-w-lg w-full p-8 shadow-2xl border border-[#07182E]/20 space-y-6">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase tracking-widest text-[#A87948] font-bold">Settle Retainer Invoice</span>
                  <h3 className="font-serif text-xl text-[#07182E]">{payingInvoice.invoice_number}</h3>
                </div>
                <button onClick={() => setPayingInvoice(null)} className="text-slate-400 hover:text-slate-700 text-lg">✕</button>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Matter:</span>
                  <span className="font-medium text-[#07182E]">{payingInvoice.matter_title}</span>
                </div>
                <div className="flex justify-between text-sm font-serif font-bold text-[#07182E]">
                  <span>Total Amount Due:</span>
                  <span>£{payingInvoice.total_amount.toLocaleString()}</span>
                </div>
              </div>

              {paymentSuccess ? (
                <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs space-y-2 text-center">
                  <CheckCircle2 size={24} className="mx-auto text-emerald-600" />
                  <p className="font-semibold">{paymentSuccess}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-xs uppercase font-bold tracking-wider text-slate-700">Choose Settlement Method</p>
                  
                  <button
                    onClick={() => handlePayInvoice(payingInvoice.id, 'Chambers Escrow Trust Account Draw')}
                    disabled={paymentLoading}
                    className="w-full p-4 border border-slate-200 hover:border-[#C6A36B] bg-white flex items-center justify-between text-left transition-colors"
                  >
                    <div>
                      <p className="text-xs font-bold text-[#07182E]">Draw from Retainer Trust Account</p>
                      <p className="text-[11px] text-slate-500">Current balance £45,000.00 covers this fee statement.</p>
                    </div>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-[10px] uppercase font-bold">Recommended</span>
                  </button>

                  <button
                    onClick={() => handlePayInvoice(payingInvoice.id, 'Corporate Stripe Corporate Card (•••• 4242)')}
                    disabled={paymentLoading}
                    className="w-full p-4 border border-slate-200 hover:border-[#C6A36B] bg-white flex items-center justify-between text-left transition-colors"
                  >
                    <div>
                      <p className="text-xs font-bold text-[#07182E]">Stripe 3D-Secure Corporate Card</p>
                      <p className="text-[11px] text-slate-500">Instant credit card settlement via Stripe Enterprise.</p>
                    </div>
                    <CreditCard size={18} className="text-slate-400" />
                  </button>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setPayingInvoice(null)}
                  className="px-4 py-2 border border-slate-300 text-xs uppercase"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal 3: Engagement Letter E-Signature Modal */}
        {signingLetter && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white max-w-2xl w-full p-8 shadow-2xl border border-[#07182E]/20 space-y-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase tracking-widest text-[#A87948] font-bold">Bilateral Digital Execution</span>
                  <h3 className="font-serif text-xl text-[#07182E]">{signingLetter.letter_number}</h3>
                </div>
                <button onClick={() => setSigningLetter(null)} className="text-slate-400 hover:text-slate-700 text-lg">✕</button>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 space-y-3 text-xs leading-relaxed text-slate-700">
                <h4 className="font-serif text-sm text-[#07182E] font-semibold">Terms of Formal Legal Engagement</h4>
                <p>
                  This Bilateral Engagement Agreement confirms representation by Aurelius & Co. ({signingLetter.attorney_name}) on behalf of {signingLetter.client_name} ({signingLetter.client_entity}).
                </p>
                <p>
                  <strong>Scope of Work:</strong> {signingLetter.matter_scope}
                </p>
                <p>
                  <strong>Legal Professional Privilege:</strong> All instructions, memoranda, and communications are safeguarded under strict statutory Legal Professional Privilege.
                </p>
                <p>
                  <strong>Dispute & Governing Law:</strong> Any dispute arising hereunder shall be subject to the exclusive jurisdiction of the Commercial Court of the High Court of Justice in London, England.
                </p>
              </div>

              {signingSuccess ? (
                <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs space-y-2 text-center">
                  <CheckCircle2 size={24} className="mx-auto text-emerald-600" />
                  <p className="font-semibold">{signingSuccess}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <label className="text-xs uppercase tracking-wider text-slate-700 font-semibold block">
                    Type Full Legal Name as Digital Signature
                  </label>
                  <input
                    type="text"
                    required
                    value={signatureText}
                    onChange={(e) => setSignatureText(e.target.value)}
                    placeholder="e.g. Jonathan Reyes"
                    className="w-full p-3 border border-slate-300 text-sm font-serif italic text-[#07182E] bg-white focus:outline-none focus:border-[#C6A36B]"
                  />
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Cryptographic Seal: SHA-256</span>
                    <span>Timestamp: {new Date().toISOString()}</span>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setSigningLetter(null)}
                  className="px-4 py-2 border border-slate-300 text-xs uppercase"
                >
                  Cancel
                </button>
                {!signingSuccess && (
                  <button
                    onClick={() => handleSignEngagement(signingLetter.id)}
                    disabled={signingLoading || !signatureText.trim()}
                    className="px-6 py-2.5 bg-[#07182E] text-[#C6A36B] text-xs uppercase tracking-wider font-bold hover:bg-[#0B2340] disabled:opacity-50 flex items-center gap-2"
                  >
                    <FileCheck2 size={14} />
                    {signingLoading ? 'Sealing Mandate...' : 'Execute Bilateral Mandate'}
                  </button>
                )}
              </div>
            </div>
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
