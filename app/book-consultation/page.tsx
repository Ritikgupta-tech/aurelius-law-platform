'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  MapPin,
  Phone,
  CheckCircle2,
  AlertCircle,
  Scale,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Lock,
} from 'lucide-react';
import { db } from '@/lib/db/database';

export default function BookConsultationPage() {
  const [step, setStep] = useState<number>(1);
  const [practiceAreaId, setPracticeAreaId] = useState<string>('pa-corp');
  const [attorneyId, setAttorneyId] = useState<string>('');
  const [consultationType, setConsultationType] = useState<'online' | 'in_person' | 'phone'>('online');
  const [scheduledDate, setScheduledDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState<boolean>(false);

  // Client Details
  const [clientName, setClientName] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [timezone, setTimezone] = useState<string>('GMT (London, UTC+0)');
  const [notes, setNotes] = useState<string>('');
  const [conflictConsent, setConflictConsent] = useState<boolean>(false);

  // Submission state
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null);

  const practiceAreas = db.getPracticeAreas();
  const attorneys = db.getAttorneys();

  // Set default date to tomorrow's date
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    // If weekend, advance to Monday
    if (tomorrow.getDay() === 6) tomorrow.setDate(tomorrow.getDate() + 2);
    if (tomorrow.getDay() === 0) tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];
    setScheduledDate(dateStr);
  }, []);

  // Fetch or calculate available slots when date or attorney changes
  useEffect(() => {
    if (!scheduledDate) return;
    setLoadingSlots(true);
    setSelectedSlot('');

    const fetchSlots = async () => {
      try {
        const query = attorneyId ? `?date=${scheduledDate}&attorneyId=${attorneyId}` : `?date=${scheduledDate}`;
        const res = await fetch(`/api/consultations${query}`);
        const data = await res.json();
        setAvailableSlots(data.availableSlots || []);
      } catch (err) {
        // Fallback
        setAvailableSlots(['09:00 AM - 10:00 AM', '11:30 AM - 12:30 PM', '03:00 PM - 04:00 PM']);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [scheduledDate, attorneyId]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) {
      setBookingError('Please select an available time slot.');
      return;
    }
    if (!conflictConsent) {
      setBookingError('Please confirm the conflict check acknowledgment.');
      return;
    }

    setSubmitting(true);
    setBookingError(null);

    try {
      const res = await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName,
          clientEmail,
          clientPhone,
          practiceAreaId,
          attorneyId: attorneyId || null,
          consultationType,
          scheduledDate,
          timeSlot: selectedSlot,
          timezone,
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setBookingError(data.error || 'Failed to book consultation.');
      } else {
        setConfirmedBooking(data.consultation);
        setStep(4); // Confirmation step
      }
    } catch (err) {
      setBookingError('A network error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedPractice = practiceAreas.find((p) => p.id === practiceAreaId);
  const selectedAttorney = attorneys.find((a) => a.id === attorneyId);

  return (
    <div className="min-h-screen bg-[#F8F5EF] text-[#202936] font-sans antialiased">
      <Navbar />

      <main className="pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <div className="text-[#A87948] text-xs font-semibold uppercase tracking-[0.25em] flex items-center justify-center gap-2">
            <span className="w-6 h-[1px] bg-[#A87948]" />
            Direct Legal Engagement
            <span className="w-6 h-[1px] bg-[#A87948]" />
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#07182E] font-medium tracking-tight">
            Schedule an Executive Consultation
          </h1>
          <p className="text-sm text-slate-600 max-w-xl mx-auto font-light leading-relaxed">
            Direct, confidential dialogue with our senior legal practitioners. Select your practice area, chosen partner, and preferred date to reserve your dedicated session.
          </p>

          {/* Multi-step progress bar */}
          <div className="flex items-center justify-center gap-2 pt-6 max-w-md mx-auto">
            {['1. Discipline & Partner', '2. Date & Time Slot', '3. Matter Details', '4. Confirmation'].map(
              (label, idx) => (
                <div key={label} className="flex-1 text-center">
                  <div
                    className={`h-1.5 w-full mb-2 transition-colors ${
                      step >= idx + 1 ? 'bg-[#C6A36B]' : 'bg-slate-300'
                    }`}
                  />
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-medium block">
                    {label}
                  </span>
                </div>
              )
            )}
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white border border-[#07182E]/10 shadow-xl p-8 sm:p-12">
          {/* STEP 1: Practice Area, Attorney, and Consultation Type */}
          {step === 1 && (
            <div className="space-y-8">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="font-serif text-xl text-[#07182E]">Select Practice Discipline & Counsel</h2>
                <p className="text-xs text-slate-500 mt-1">Choose the primary area of law and preferred lead attorney.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-slate-700 font-semibold">
                    Practice Discipline *
                  </label>
                  <select
                    value={practiceAreaId}
                    onChange={(e) => setPracticeAreaId(e.target.value)}
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 text-xs text-[#07182E] focus:outline-none focus:border-[#C6A36B]"
                  >
                    {practiceAreas.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-slate-700 font-semibold">
                    Lead Attorney (Optional)
                  </label>
                  <select
                    value={attorneyId}
                    onChange={(e) => setAttorneyId(e.target.value)}
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 text-xs text-[#07182E] focus:outline-none focus:border-[#C6A36B]"
                  >
                    <option value="">Any Senior Partner / Available Counsel</option>
                    {attorneys.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.full_name} — {a.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Consultation Format */}
              <div className="space-y-3 pt-2">
                <label className="text-xs uppercase tracking-wider text-slate-700 font-semibold">
                  Consultation Format *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    {
                      id: 'online',
                      label: 'Secure Video Meeting',
                      desc: 'End-to-end encrypted video conference link.',
                      icon: Video,
                    },
                    {
                      id: 'in_person',
                      label: 'In-Person Chamber',
                      desc: '250 Bishopsgate, London or 5th Ave NYC.',
                      icon: MapPin,
                    },
                    {
                      id: 'phone',
                      label: 'Telephone Conference',
                      desc: 'Direct partner telephone briefing.',
                      icon: Phone,
                    },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isSelected = consultationType === item.id;
                    return (
                      <div
                        key={item.id}
                        onClick={() => setConsultationType(item.id as any)}
                        className={`p-5 border cursor-pointer transition-all ${
                          isSelected
                            ? 'border-[#C6A36B] bg-[#07182E] text-white shadow-md'
                            : 'border-slate-200 bg-slate-50 text-[#07182E] hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Icon size={18} className={isSelected ? 'text-[#C6A36B]' : 'text-slate-600'} />
                          <span className="font-serif text-sm font-medium">{item.label}</span>
                        </div>
                        <p className={`text-[11px] leading-relaxed ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                          {item.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-8 py-3.5 bg-[#07182E] text-[#C6A36B] text-xs uppercase tracking-widest font-semibold flex items-center gap-2 hover:bg-[#0B2340] transition-colors"
                >
                  Proceed to Calendar Slots
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Live Date & Time Slot Selector */}
          {step === 2 && (
            <div className="space-y-8">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="font-serif text-xl text-[#07182E]">Choose Consultation Date & Time</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Our double-booking prevention engine validates live attorney availability in real time.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div className="space-y-4">
                  <label className="text-xs uppercase tracking-wider text-slate-700 font-semibold flex items-center gap-2">
                    <CalendarIcon size={16} className="text-[#C6A36B]" />
                    Select Date *
                  </label>
                  <input
                    type="date"
                    value={scheduledDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 text-xs text-[#07182E] focus:outline-none focus:border-[#C6A36B]"
                  />

                  <div className="space-y-2 pt-2">
                    <label className="text-xs uppercase tracking-wider text-slate-700 font-semibold">
                      Your Timezone *
                    </label>
                    <select
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="w-full p-3.5 bg-slate-50 border border-slate-200 text-xs text-[#07182E] focus:outline-none focus:border-[#C6A36B]"
                    >
                      <option value="GMT (London, UTC+0)">GMT (London, UTC+0)</option>
                      <option value="EST (New York, UTC-5)">EST (New York, UTC-5)</option>
                      <option value="CST (Chicago, UTC-6)">CST (Chicago, UTC-6)</option>
                      <option value="PST (San Francisco, UTC-8)">PST (San Francisco, UTC-8)</option>
                      <option value="CET (Paris/Geneva, UTC+1)">CET (Paris/Geneva, UTC+1)</option>
                      <option value="SGT (Singapore, UTC+8)">SGT (Singapore, UTC+8)</option>
                      <option value="IST (India, UTC+5:30)">IST (India, UTC+5:30)</option>
                    </select>
                  </div>
                </div>

                {/* Available Slots List */}
                <div className="space-y-4">
                  <label className="text-xs uppercase tracking-wider text-slate-700 font-semibold flex items-center gap-2">
                    <Clock size={16} className="text-[#C6A36B]" />
                    Available Time Slots for {scheduledDate} *
                  </label>

                  {loadingSlots ? (
                    <div className="p-8 text-center text-xs text-slate-500">Checking availability...</div>
                  ) : availableSlots.length === 0 ? (
                    <div className="p-6 bg-red-50 border border-red-200 text-xs text-red-700">
                      No slots available on this date for the chosen counsel. Please select another date.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
                      {availableSlots.map((slot) => {
                        const isChosen = selectedSlot === slot;
                        return (
                          <button
                            type="button"
                            key={slot}
                            onClick={() => setSelectedSlot(slot)}
                            className={`p-3 text-xs font-mono font-semibold border text-center transition-all ${
                              isChosen
                                ? 'bg-[#C6A36B] text-[#07182E] border-[#C6A36B] shadow-md'
                                : 'bg-slate-50 border-slate-200 text-[#07182E] hover:border-[#C6A36B]'
                            }`}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-6 flex justify-between border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-6 py-3 border border-slate-300 text-xs uppercase tracking-wider text-slate-700 flex items-center gap-2 hover:bg-slate-50"
                >
                  <ArrowLeft size={14} /> Back
                </button>
                <button
                  type="button"
                  disabled={!selectedSlot}
                  onClick={() => setStep(3)}
                  className="px-8 py-3.5 bg-[#07182E] text-[#C6A36B] text-xs uppercase tracking-widest font-semibold flex items-center gap-2 hover:bg-[#0B2340] transition-colors disabled:opacity-40"
                >
                  Proceed to Client Details
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Client Details & Conflict Verification */}
          {step === 3 && (
            <form onSubmit={handleBookingSubmit} className="space-y-8">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="font-serif text-xl text-[#07182E]">Client Information & Matter Scope</h2>
                <p className="text-xs text-slate-500 mt-1">
                  All personal information is secured under attorney-client privilege protocols.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-slate-700 font-semibold">Full Name *</label>
                  <input
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Jonathan Reyes"
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 text-xs text-[#07182E] focus:outline-none focus:border-[#C6A36B]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-slate-700 font-semibold">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="e.g. j.reyes@meridian.com"
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 text-xs text-[#07182E] focus:outline-none focus:border-[#C6A36B]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-slate-700 font-semibold">Phone Number</label>
                <input
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="e.g. +44 20 7946 0912"
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 text-xs text-[#07182E] focus:outline-none focus:border-[#C6A36B]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-slate-700 font-semibold">
                  Matter Context / Agenda (Non-Confidential)
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Briefly state key questions or transactions to address during this session..."
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 text-xs text-[#07182E] focus:outline-none focus:border-[#C6A36B]"
                />
              </div>

              {/* Conflict screening box */}
              <div className="p-4 bg-slate-50 border border-[#07182E]/10 space-y-3">
                <div className="flex items-center gap-2 text-xs text-[#07182E] font-semibold uppercase tracking-wider">
                  <Lock size={14} className="text-[#A87948]" />
                  Conflict of Interest Pre-Screening Acknowledgment
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-light">
                  Aurelius & Co. operates strict conflict-of-interest checking procedures. Booking this consultation initiates conflict screening against opposing parties. This booking does not constitute an attorney-client relationship until an Engagement Letter is formalized.
                </p>
                <div className="flex items-start gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="conflictCheck"
                    required
                    checked={conflictConsent}
                    onChange={(e) => setConflictConsent(e.target.checked)}
                    className="mt-1"
                  />
                  <label htmlFor="conflictCheck" className="text-xs text-slate-700 font-medium">
                    I acknowledge and agree to the conflict of interest screening protocol.
                  </label>
                </div>
              </div>

              {bookingError && (
                <div className="p-4 bg-red-50 border border-red-200 text-xs text-red-700">
                  {bookingError}
                </div>
              )}

              <div className="pt-6 flex justify-between border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-3 border border-slate-300 text-xs uppercase tracking-wider text-slate-700 flex items-center gap-2 hover:bg-slate-50"
                >
                  <ArrowLeft size={14} /> Back
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-9 py-4 bg-[#C6A36B] text-[#07182E] text-xs uppercase tracking-widest font-bold hover:bg-[#d5b682] transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Confirming Appointment...' : 'Confirm & Reserve Consultation'}
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: Success & Confirmation Display */}
          {step === 4 && confirmedBooking && (
            <div className="text-center py-8 space-y-6">
              <div className="w-16 h-16 bg-[#C6A36B]/20 border border-[#C6A36B] text-[#C6A36B] mx-auto flex items-center justify-center rounded-full">
                <CheckCircle2 size={36} />
              </div>

              <div className="space-y-2">
                <h2 className="font-serif text-3xl text-[#07182E]">Consultation Confirmed</h2>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Your appointment has been registered in our central calendar. A formal calendar invite and preliminary conflict notice have been prepared.
                </p>
              </div>

              {/* Booking Summary Card */}
              <div className="max-w-md mx-auto bg-slate-50 border border-slate-200 p-6 text-left space-y-3 font-sans">
                <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                    Reference ID
                  </span>
                  <span className="font-mono text-sm text-[#07182E] font-bold">
                    {confirmedBooking.reference}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Practice Area:</span>
                  <span className="font-medium text-[#07182E]">{confirmedBooking.practice_area_title}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Designated Counsel:</span>
                  <span className="font-medium text-[#07182E]">
                    {confirmedBooking.attorney_name || 'Senior Practice Partner'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Date & Time:</span>
                  <span className="font-medium text-[#07182E]">
                    {confirmedBooking.scheduled_date} at {confirmedBooking.time_slot}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Format:</span>
                  <span className="font-medium uppercase text-[#07182E]">
                    {confirmedBooking.consultation_type}
                  </span>
                </div>
                {confirmedBooking.meeting_link && (
                  <div className="pt-2 border-t border-slate-200 text-xs">
                    <span className="text-slate-500 block mb-1">Encrypted Meeting Link:</span>
                    <a
                      href={confirmedBooking.meeting_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[11px] text-[#A87948] underline break-all"
                    >
                      {confirmedBooking.meeting_link}
                    </a>
                  </div>
                )}
              </div>

              <div className="pt-4 flex justify-center gap-4">
                <button
                  onClick={() => {
                    setConfirmedBooking(null);
                    setStep(1);
                  }}
                  className="px-6 py-3 border border-slate-300 text-xs uppercase tracking-wider text-slate-700 hover:bg-slate-50"
                >
                  Book Another Session
                </button>
                <a
                  href="/portal"
                  className="px-6 py-3 bg-[#07182E] text-[#C6A36B] text-xs uppercase tracking-wider font-semibold hover:bg-[#0B2340]"
                >
                  View in Client Portal
                </a>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
