'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Scale,
  Calendar,
  Clock,
  Video,
  FileText,
  Lock,
  Plus,
  CheckCircle2,
  AlertCircle,
  Users,
  EyeOff,
  UserCheck,
} from 'lucide-react';
import { db } from '@/lib/db/database';
import { Enquiry, Consultation, InternalNote } from '@/lib/db/types';

export default function AttorneyWorkspacePage() {
  const [selectedAttorneyId, setSelectedAttorneyId] = useState<string>('att-1');
  const [tab, setTab] = useState<'appointments' | 'enquiries' | 'notes' | 'availability'>('appointments');

  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [notes, setNotes] = useState<InternalNote[]>([]);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [selectedEntityId, setSelectedEntityId] = useState<string>('enq-101');

  const attorneys = db.getAttorneys();
  const currentAttorney = attorneys.find((a) => a.id === selectedAttorneyId) || attorneys[0];

  useEffect(() => {
    const fetchWorkspaceData = async () => {
      try {
        const [enqRes, conRes, notesRes] = await Promise.all([
          fetch('/api/enquiries').then((r) => r.json()).catch(() => ({ enquiries: [] })),
          fetch('/api/consultations').then((r) => r.json()).catch(() => ({ consultations: [] })),
          fetch(`/api/admin/notes?entityType=enquiry&entityId=${selectedEntityId}`, {
            headers: { Authorization: 'Bearer test-attorney-token' },
          }).then((r) => r.json()).catch(() => ({ notes: [] })),
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

        if (notesRes.notes && notesRes.notes.length > 0) {
          setNotes(notesRes.notes);
        } else {
          setNotes(db.getInternalNotes('enquiry', selectedEntityId));
        }
      } catch (err) {
        setEnquiries(db.getEnquiries());
        setConsultations(db.getConsultations());
        setNotes(db.getInternalNotes('enquiry', selectedEntityId));
      }
    };

    fetchWorkspaceData();
  }, [selectedEntityId]);

  const assignedConsultations = consultations.filter(
    (c) => !c.attorney_id || c.attorney_id === currentAttorney.id
  );

  const assignedEnquiries = enquiries.filter(
    (e) => !e.assigned_attorney_id || e.assigned_attorney_id === currentAttorney.id
  );

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteContent.trim()) return;

    try {
      const res = await fetch('/api/admin/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-attorney-token',
        },
        body: JSON.stringify({
          entityType: 'enquiry',
          entityId: selectedEntityId,
          authorId: currentAttorney.id,
          authorName: currentAttorney.full_name,
          content: newNoteContent,
        }),
      });

      const data = await res.json();
      if (res.ok && data.note) {
        setNotes((prev) => [data.note, ...prev]);
      } else {
        const memoryNote = db.addInternalNote({
          entity_type: 'enquiry',
          entity_id: selectedEntityId,
          author_id: currentAttorney.id,
          author_name: currentAttorney.full_name,
          content: newNoteContent,
        });
        setNotes((prev) => [memoryNote, ...prev]);
      }
    } catch (err) {
      const memoryNote = db.addInternalNote({
        entity_type: 'enquiry',
        entity_id: selectedEntityId,
        author_id: currentAttorney.id,
        author_name: currentAttorney.full_name,
        content: newNoteContent,
      });
      setNotes((prev) => [memoryNote, ...prev]);
    }

    setNewNoteContent('');
  };

  const handleUpdateStatus = async (id: string, status: any) => {
    try {
      await fetch('/api/admin/status', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-attorney-token',
        },
        body: JSON.stringify({
          table: 'enquiries',
          id,
          status,
          performedBy: {
            id: currentAttorney.id,
            name: currentAttorney.full_name,
            role: 'attorney',
          },
        }),
      });
    } catch (err) {
      console.warn('Network update error, applying memory store update');
    }

    db.updateEnquiryStatus(id, status, {
      id: currentAttorney.id,
      name: currentAttorney.full_name,
      role: 'attorney',
    });
    setEnquiries([...db.getEnquiries()]);
  };

  return (
    <div className="min-h-screen bg-[#F8F5EF] text-[#202936] font-sans antialiased">
      <Navbar />

      <main className="pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        {/* Workspace Banner */}
        <div className="p-6 bg-[#07182E] text-white border border-[#C6A36B]/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-widest text-[#C6A36B] font-bold">
                Attorney Practice Chambers
              </span>
              <span className="px-2 py-0.5 bg-amber-950 text-amber-300 text-[10px] border border-amber-800 flex items-center gap-1">
                <EyeOff size={11} /> Privileged Lawyer Access Only
              </span>
            </div>
            <h1 className="font-serif text-2xl text-white font-normal">
              Counsel Workspace: {currentAttorney.full_name}
            </h1>
            <p className="text-xs text-slate-300">
              {currentAttorney.title} · {currentAttorney.office_location}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">Switch Practitioner:</span>
            <select
              value={selectedAttorneyId}
              onChange={(e) => setSelectedAttorneyId(e.target.value)}
              className="p-2 bg-[#0B2340] border border-[#C6A36B]/50 text-xs text-white"
            >
              {attorneys.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.full_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
          {[
            { id: 'appointments', label: `Assigned Sessions (${assignedConsultations.length})`, icon: Calendar },
            { id: 'enquiries', label: `Intake Inquiries (${assignedEnquiries.length})`, icon: Clock },
            { id: 'notes', label: 'Privileged Internal Notes', icon: Lock },
            { id: 'availability', label: 'Chamber Availability & Calendar', icon: Scale },
          ].map((item) => {
            const Icon = item.icon;
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setTab(item.id as any)}
                className={`px-5 py-2.5 text-xs uppercase tracking-wider font-semibold flex items-center gap-2 border-b-2 transition-all ${
                  active
                    ? 'border-[#C6A36B] text-[#07182E] bg-white shadow-sm'
                    : 'border-transparent text-slate-500 hover:text-[#07182E]'
                }`}
              >
                <Icon size={14} className={active ? 'text-[#C6A36B]' : 'text-slate-400'} />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* TAB 1: Assigned Consultations */}
        {tab === 'appointments' && (
          <div className="bg-white border border-[#07182E]/10 p-6 shadow-sm space-y-6">
            <h3 className="font-serif text-xl text-[#07182E]">Upcoming Client Consultations</h3>
            <div className="space-y-4">
              {assignedConsultations.map((con) => (
                <div
                  key={con.id}
                  className="p-5 border border-slate-200 bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#07182E]">{con.reference}</span>
                      <span className="px-2 py-0.5 text-[10px] uppercase font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {con.status}
                      </span>
                      <span className="text-xs text-slate-500 uppercase">({con.consultation_type})</span>
                    </div>
                    <p className="font-serif text-base text-[#07182E] font-medium">{con.client_name}</p>
                    <p className="text-xs text-slate-600">
                      Email: {con.client_email} · Practice: {con.practice_area_title}
                    </p>
                    <p className="text-xs text-slate-500">
                      Scheduled: {con.scheduled_date} at {con.time_slot} ({con.timezone})
                    </p>
                    {con.notes && (
                      <p className="text-xs text-slate-600 italic bg-white p-2 border border-slate-100 mt-1">
                        Client Agenda: &ldquo;{con.notes}&rdquo;
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {con.meeting_link && (
                      <a
                        href={con.meeting_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-[#07182E] text-[#C6A36B] text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5"
                      >
                        <Video size={14} /> Open Meeting
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: Assigned Enquiries & Conflict Screening */}
        {tab === 'enquiries' && (
          <div className="bg-white border border-[#07182E]/10 p-6 shadow-sm space-y-6">
            <h3 className="font-serif text-xl text-[#07182E]">Client Inquiries & Conflict Verification</h3>
            <div className="space-y-4">
              {assignedEnquiries.map((enq) => (
                <div key={enq.id} className="p-5 border border-slate-200 bg-slate-50 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#07182E]">{enq.reference}</span>
                      <span className="px-2 py-0.5 text-[10px] uppercase font-bold bg-slate-200 text-slate-800">
                        {enq.status.replace(/_/g, ' ')}
                      </span>
                      <span className={`px-2 py-0.5 text-[10px] uppercase font-bold border ${enq.conflict_status === 'cleared' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}`}>
                        Conflict Check: {enq.conflict_status}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400">{new Date(enq.created_at).toLocaleDateString()}</span>
                  </div>

                  <div>
                    <h4 className="font-serif text-base text-[#07182E]">
                      {enq.first_name} {enq.last_name} ({enq.email})
                    </h4>
                    <p className="text-xs text-slate-500">{enq.practice_area}</p>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed font-light bg-white p-3 border border-slate-100">
                    {enq.message}
                  </p>

                  <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">Update Status:</span>
                      <select
                        value={enq.status}
                        onChange={(e) => handleUpdateStatus(enq.id, e.target.value)}
                        className="p-1.5 bg-white border border-slate-300 text-xs text-[#07182E]"
                      >
                        <option value="new">New</option>
                        <option value="under_review">Under Review</option>
                        <option value="conflict_check">Conflict Check</option>
                        <option value="consultation_scheduled">Consultation Scheduled</option>
                        <option value="converted">Converted to Retainer</option>
                        <option value="closed">Closed / Retained</option>
                        <option value="rejected">Declined</option>
                      </select>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedEntityId(enq.id);
                        setTab('notes');
                      }}
                      className="text-xs text-[#A87948] hover:underline flex items-center gap-1"
                    >
                      <Lock size={12} /> Add Privileged Internal Note
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Privileged Internal Notes */}
        {tab === 'notes' && (
          <div className="bg-white border border-[#07182E]/10 p-6 shadow-sm space-y-6">
            <div className="p-4 bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
              <EyeOff size={16} className="shrink-0 mt-0.5 text-amber-700" />
              <span>
                <strong>Privilege Notice:</strong> Internal notes recorded here are strictly protected under legal professional privilege and are never visible to clients or external parties.
              </span>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-slate-700 font-semibold">
                Attach Note to Enquiry Reference
              </label>
              <select
                value={selectedEntityId}
                onChange={(e) => setSelectedEntityId(e.target.value)}
                className="w-full max-w-md p-2.5 bg-slate-50 border border-slate-200 text-xs"
              >
                {enquiries.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.reference} — {e.first_name} {e.last_name} ({e.practice_area})
                  </option>
                ))}
              </select>
            </div>

            {/* Note Entry */}
            <form onSubmit={handleAddNote} className="space-y-3">
              <textarea
                rows={3}
                required
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                placeholder="Enter confidential lawyer analysis, valuation benchmark, or screening observations..."
                className="w-full p-3 bg-slate-50 border border-slate-200 text-xs"
              />
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#07182E] text-[#C6A36B] text-xs uppercase tracking-wider font-bold"
              >
                Save Privileged Note
              </button>
            </form>

            {/* Existing Notes */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h4 className="font-serif text-base text-[#07182E]">
                Recorded Privileged Notes ({notes.length})
              </h4>
              {notes.map((n) => (
                <div key={n.id} className="p-4 bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex justify-between items-center text-[10px] text-slate-400 uppercase tracking-wider">
                    <span className="font-semibold text-slate-700">{n.author_name}</span>
                    <span>{new Date(n.created_at).toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-light">{n.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: Chamber Availability & Concurrency Calendar */}
        {tab === 'availability' && (
          <div className="bg-white border border-[#07182E]/10 p-6 shadow-sm space-y-8">
            <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-xl text-[#07182E]">Chamber Availability & Calendar Guard</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Configure operating hours, automated booking mutex rules, and courtroom hearing blackout windows for {currentAttorney.full_name}.
                </p>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold border border-emerald-200 self-start sm:self-auto">
                Concurrency Mutex Active
              </span>
            </div>

            {/* Operating Windows & Jurisdictional Base */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                  Primary Jurisdictional Base
                </span>
                <p className="font-serif text-lg text-[#07182E] font-medium">{currentAttorney.office_location} Chambers</p>
                <p className="text-xs text-slate-500">Operating under Senior Managing Partner rotation</p>
              </div>

              <div className="p-5 bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                  Daily Consultation Capacity
                </span>
                <p className="font-serif text-lg text-[#07182E] font-medium">4 Retained Sessions / Day</p>
                <p className="text-xs text-slate-500">60-minute duration with 30-minute buffer</p>
              </div>

              <div className="p-5 bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                  Conflict Verification Protocol
                </span>
                <p className="font-serif text-lg text-emerald-700 font-medium">Strict Pre-Disclosure</p>
                <p className="text-xs text-slate-500">Adverse party screen mandatory prior to meeting</p>
              </div>
            </div>

            {/* Configured Consulting Windows */}
            <div className="space-y-4">
              <h4 className="font-serif text-base text-[#07182E]">Standard Weekly Consultation Slots</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { slot: '09:30 AM - 10:30 AM', type: 'Morning Corporate Advisory', active: true },
                  { slot: '11:30 AM - 12:30 PM', type: 'Executive M&A Briefing', active: true },
                  { slot: '02:30 PM - 03:30 PM', type: 'Arbitration Strategy', active: true },
                  { slot: '04:30 PM - 05:30 PM', type: 'Evening Private Wealth', active: true },
                ].map((s) => (
                  <div key={s.slot} className="p-4 border border-[#C6A36B]/40 bg-[#07182E] text-white space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-[#C6A36B] font-bold">{s.slot}</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    </div>
                    <p className="text-xs text-slate-300 font-light">{s.type}</p>
                    <span className="inline-block text-[10px] uppercase tracking-wider text-[#C6A36B] font-semibold">
                      Online / In-Chambers
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Courtroom Blackout Notice */}
            <div className="p-4 bg-slate-50 border border-slate-200 flex items-start gap-3 text-xs text-slate-600">
              <Scale size={18} className="text-[#A87948] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#07182E] font-medium">Court Hearing Blackout Windows:</strong> When trial counsel is engaged in Royal Courts of Justice (UK) or US Federal District Court hearings, corresponding calendar dates are automatically removed from the public scheduling interface.
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
