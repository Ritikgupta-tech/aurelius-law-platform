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
    setEnquiries(db.getEnquiries());
    setConsultations(db.getConsultations());
    setNotes(db.getInternalNotes('enquiry', selectedEntityId));
  }, [selectedEntityId]);

  const assignedConsultations = consultations.filter(
    (c) => !c.attorney_id || c.attorney_id === currentAttorney.id
  );

  const assignedEnquiries = enquiries.filter(
    (e) => !e.assigned_attorney_id || e.assigned_attorney_id === currentAttorney.id
  );

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteContent.trim()) return;

    const note = db.addInternalNote({
      entity_type: 'enquiry',
      entity_id: selectedEntityId,
      author_id: currentAttorney.id,
      author_name: currentAttorney.full_name,
      content: newNoteContent,
    });

    setNotes([note, ...notes]);
    setNewNoteContent('');
  };

  const handleUpdateStatus = (id: string, status: any) => {
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
      </main>

      <Footer />
    </div>
  );
}
