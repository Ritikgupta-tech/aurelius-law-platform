'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { MapPin, Phone, Mail, Clock, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';
import { db } from '@/lib/db/database';

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const practiceAreas = db.getPracticeAreas();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.get('firstName'),
          lastName: formData.get('lastName'),
          email: formData.get('email'),
          phone: formData.get('phone'),
          practiceArea: formData.get('practiceArea'),
          preferredContactMethod: formData.get('preferredContactMethod'),
          message: formData.get('message'),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to submit inquiry.');
      } else {
        setSubmittedRef(data.reference);
        form.reset();
      }
    } catch (err) {
      setError('A network error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F5EF] text-[#202936] font-sans antialiased">
      <Navbar />

      <main className="pt-28 pb-24">
        {/* Header */}
        <section className="bg-[#07182E] text-white py-20 px-4 sm:px-6 lg:px-8 border-b border-[#C6A36B]/20">
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="text-[#C6A36B] text-xs font-semibold uppercase tracking-[0.25em] flex items-center gap-2">
              <span className="w-6 h-[1px] bg-[#C6A36B]" />
              Chambers & Global Intake
            </div>
            <h1 className="font-serif text-4xl sm:text-6xl text-white font-normal leading-tight">
              Start a Confidential <br />
              <span className="italic text-[#C6A36B]">Conversation.</span>
            </h1>
            <p className="text-base text-slate-300 font-light leading-relaxed">
              Connect with our London, New York, or Geneva chambers for confidential inquiry intake and strategic case appraisal.
            </p>
          </div>
        </section>

        {/* Contact info and Form */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Col: Chambers info */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-4">
                <h2 className="font-serif text-2xl text-[#07182E]">International Chambers</h2>
                <p className="text-xs text-slate-600 leading-relaxed font-light">
                  Our offices operate across GMT and EST time zones, providing coordinated coverage across global commercial markets.
                </p>
              </div>

              {/* Office 1 */}
              <div className="p-6 bg-white border border-[#07182E]/10 space-y-3 shadow-sm">
                <span className="text-[10px] uppercase tracking-widest text-[#A87948] font-bold">
                  Primary Headquarters · London
                </span>
                <h3 className="font-serif text-lg text-[#07182E]">Bishopsgate Chambers</h3>
                <p className="text-xs text-slate-600 flex items-start gap-2">
                  <MapPin size={15} className="text-[#A87948] shrink-0 mt-0.5" />
                  250 Bishopsgate, London EC2M 4AA, United Kingdom
                </p>
                <p className="text-xs text-slate-600 flex items-center gap-2">
                  <Phone size={14} className="text-[#A87948] shrink-0" />
                  +44 20 7946 0912
                </p>
              </div>

              {/* Office 2 */}
              <div className="p-6 bg-white border border-[#07182E]/10 space-y-3 shadow-sm">
                <span className="text-[10px] uppercase tracking-widest text-[#A87948] font-bold">
                  Americas Hub · New York
                </span>
                <h3 className="font-serif text-lg text-[#07182E]">Fifth Avenue Chambers</h3>
                <p className="text-xs text-slate-600 flex items-start gap-2">
                  <MapPin size={15} className="text-[#A87948] shrink-0 mt-0.5" />
                  767 Fifth Avenue, New York, NY 10153, United States
                </p>
                <p className="text-xs text-slate-600 flex items-center gap-2">
                  <Phone size={14} className="text-[#A87948] shrink-0" />
                  +1 212 555 0184
                </p>
              </div>

              {/* General Inquiries */}
              <div className="p-6 bg-[#07182E] text-white border border-[#C6A36B]/30 space-y-2">
                <p className="text-xs text-[#C6A36B] uppercase tracking-wider font-semibold">
                  Electronic Inquiries
                </p>
                <p className="font-serif text-lg text-white">inquiries@aureliuslaw.com</p>
                <p className="text-[11px] text-slate-300 font-light">
                  Direct encrypted intake channel monitored continuously by senior practice paralegals.
                </p>
              </div>
            </div>

            {/* Right Col: Intake Form */}
            <div className="lg:col-span-7 bg-white border border-[#07182E]/10 p-8 sm:p-10 shadow-xl space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="font-serif text-2xl text-[#07182E]">Submit Non-Confidential Inquiry</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Transmitting this inquiry initiates our automated conflict-of-interest verification protocol.
                </p>
              </div>

              {submittedRef ? (
                <div className="py-10 text-center space-y-4">
                  <div className="w-16 h-16 bg-green-50 border border-green-500 text-green-700 mx-auto flex items-center justify-center rounded-full">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="font-serif text-2xl text-[#07182E]">Inquiry Successfully Registered</h3>
                  <p className="text-xs text-slate-600 max-w-md mx-auto">
                    Your matter summary has been routed to our conflict check desk. You will receive an acknowledgment note shortly.
                  </p>
                  <div className="p-4 bg-slate-50 border border-slate-200 max-w-xs mx-auto">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400">Reference Number</span>
                    <p className="font-mono text-sm text-[#07182E] font-bold mt-1">{submittedRef}</p>
                  </div>
                  <button
                    onClick={() => setSubmittedRef(null)}
                    className="text-xs uppercase tracking-wider text-[#A87948] hover:underline"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wider text-slate-700 font-medium">First Name *</label>
                      <input
                        name="firstName"
                        required
                        placeholder="e.g. Jonathan"
                        className="w-full p-3.5 bg-slate-50 border border-slate-200 text-xs text-[#07182E] focus:outline-none focus:border-[#C6A36B]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wider text-slate-700 font-medium">Last Name *</label>
                      <input
                        name="lastName"
                        required
                        placeholder="e.g. Reyes"
                        className="w-full p-3.5 bg-slate-50 border border-slate-200 text-xs text-[#07182E] focus:outline-none focus:border-[#C6A36B]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wider text-slate-700 font-medium">Email Address *</label>
                      <input
                        name="email"
                        type="email"
                        required
                        placeholder="e.g. j.reyes@company.com"
                        className="w-full p-3.5 bg-slate-50 border border-slate-200 text-xs text-[#07182E] focus:outline-none focus:border-[#C6A36B]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wider text-slate-700 font-medium">Phone Number</label>
                      <input
                        name="phone"
                        placeholder="e.g. +44 20 7946 0000"
                        className="w-full p-3.5 bg-slate-50 border border-slate-200 text-xs text-[#07182E] focus:outline-none focus:border-[#C6A36B]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wider text-slate-700 font-medium">Practice Area *</label>
                      <select
                        name="practiceArea"
                        required
                        className="w-full p-3.5 bg-slate-50 border border-slate-200 text-xs text-[#07182E] focus:outline-none focus:border-[#C6A36B]"
                      >
                        {practiceAreas.map((p) => (
                          <option key={p.id} value={p.title}>
                            {p.title}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wider text-slate-700 font-medium">Contact Method</label>
                      <select
                        name="preferredContactMethod"
                        className="w-full p-3.5 bg-slate-50 border border-slate-200 text-xs text-[#07182E] focus:outline-none focus:border-[#C6A36B]"
                      >
                        <option value="email">Direct Email</option>
                        <option value="phone">Telephone Call</option>
                        <option value="portal">Client Portal</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-slate-700 font-medium">
                      Non-Confidential Summary *
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={4}
                      placeholder="Outline the nature of the matter, transactions, or impending dispute..."
                      className="w-full p-3.5 bg-slate-50 border border-slate-200 text-xs text-[#07182E] focus:outline-none focus:border-[#C6A36B]"
                    />
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700">
                      {error}
                    </div>
                  )}

                  <div className="p-4 bg-slate-50 border border-slate-200 flex items-start gap-3">
                    <Lock size={16} className="text-[#A87948] shrink-0 mt-0.5" />
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Submission does not constitute an attorney-client relationship. Do not submit non-public trade secrets or privileged trial work product.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 bg-[#07182E] text-[#C6A36B] text-xs uppercase tracking-widest font-bold hover:bg-[#0B2340] transition-colors disabled:opacity-50"
                  >
                    {submitting ? 'Screening & Transmitting...' : 'Submit Inquiry to Conflict Desk'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
