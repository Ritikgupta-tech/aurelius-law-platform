'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Compass,
  ArrowRight,
  ShieldAlert,
  Scale,
  Sparkles,
  Building,
  Gavel,
  Landmark,
  CheckCircle,
  Clock,
  UserCheck,
  ShieldCheck,
} from 'lucide-react';

interface DiagnosticResult {
  categoryTitle: string;
  recommendedLead: string;
  leadTitle: string;
  leadPhoto: string;
  screeningTime: string;
  recommendedForum: string;
  keyStrategy: string;
  suggestedRetainerScope: string;
}

export default function MatterCompass() {
  const [domain, setDomain] = useState<'corporate' | 'disputes' | 'ip' | 'wealth'>('corporate');
  const [scale, setScale] = useState<'mid' | 'large' | 'institutional'>('large');
  const [urgency, setUrgency] = useState<'emergency' | 'transactional' | 'strategic'>('transactional');
  const [forum, setForum] = useState<'uk' | 'us' | 'eu' | 'sg'>('uk');

  // Compute recommendation
  const computeBlueprint = (): DiagnosticResult => {
    if (domain === 'corporate') {
      return {
        categoryTitle: 'Corporate & M&A Capital Structuring',
        recommendedLead: 'Arthur Sterling, KC',
        leadTitle: 'Senior Managing Partner · King’s Counsel',
        leadPhoto: 'https://images.pexels.com/photos/38139419/pexels-photo-38139419.jpeg?auto=compress&cs=tinysrgb&h=400&w=300',
        screeningTime: urgency === 'emergency' ? 'Within 4 Hours' : 'Same-Day Clearance',
        recommendedForum: forum === 'us' ? 'Delaware Court of Chancery & SDNY' : 'London Commercial Court & High Court of Justice',
        keyStrategy: 'High-velocity due diligence, antitakeover poison pill architecture, and definitive bilateral merger documentation.',
        suggestedRetainerScope: scale === 'institutional' ? 'Comprehensive Milestone Retainer' : 'Bespoke Advisory Retainer',
      };
    } else if (domain === 'disputes') {
      return {
        categoryTitle: 'High-Stakes Commercial & Sovereign Litigation',
        recommendedLead: 'Arthur Sterling, KC',
        leadTitle: 'Senior Managing Partner · King’s Counsel',
        leadPhoto: 'https://images.pexels.com/photos/38139419/pexels-photo-38139419.jpeg?auto=compress&cs=tinysrgb&h=400&w=300',
        screeningTime: urgency === 'emergency' ? 'Immediate Emergency Standby' : 'Within 6 Hours',
        recommendedForum: forum === 'eu' ? 'Zurich Chamber of Arbitration' : 'London Court of International Arbitration (LCIA)',
        keyStrategy: 'Aggressive interim freezing injunctions, multi-jurisdictional asset discovery, and forensic witness cross-examination.',
        suggestedRetainerScope: 'Retainer + Staged Litigation Milestone Escrow',
      };
    } else if (domain === 'ip') {
      return {
        categoryTitle: 'Global Intellectual Property & Sovereign Patents',
        recommendedLead: 'Marcus Vance, Esq.',
        leadTitle: 'Partner · Cross-Border IP & Tech',
        leadPhoto: 'https://images.pexels.com/photos/8112170/pexels-photo-8112170.jpeg?auto=compress&cs=tinysrgb&h=400&w=300',
        screeningTime: 'Same-Day Clearance',
        recommendedForum: forum === 'us' ? 'US Federal Circuit & ITC' : 'Unified Patent Court (Munich/Paris)',
        keyStrategy: 'Defensive patent portfolio fortification, trade secret injunctions, and cross-licensing royalty frameworks.',
        suggestedRetainerScope: 'Fixed Advisory Phase + Royalty Enforcement Schedule',
      };
    } else {
      return {
        categoryTitle: 'Private Client, Family Dynasties & Asset Protection',
        recommendedLead: 'Elena Rostova, LL.M.',
        leadTitle: 'Partner · International Private Client & Real Estate',
        leadPhoto: 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&h=400&w=300',
        screeningTime: 'Confidential 12-Hour Screening',
        recommendedForum: forum === 'eu' ? 'Swiss Private Banking Tribunals' : 'English High Court Family & Chancery Division',
        keyStrategy: 'Multi-jurisdictional trust architecture, generational wealth succession governance, and cross-border tax treaties.',
        suggestedRetainerScope: 'Discreet Private Client Annual Retainer',
      };
    }
  };

  const blueprint = computeBlueprint();

  return (
    <section className="py-24 bg-[#0B2340] text-white px-4 sm:px-6 lg:px-8 border-t border-[#C6A36B]/25 relative overflow-hidden">
      {/* Subtle decorative background watermark */}
      <div className="absolute right-[-100px] top-[-100px] w-96 h-96 border border-[#C6A36B]/10 rounded-full pointer-events-none" />
      <div className="absolute left-[-80px] bottom-[-80px] w-80 h-80 border border-[#C6A36B]/10 rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="text-[#C6A36B] text-xs font-semibold uppercase tracking-[0.25em] flex items-center gap-2">
              <Compass size={14} className="animate-spin [animation-duration:12s]" />
              Interactive Counsel Diagnostic
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-light">
              The Matter Compass: <br />
              <span className="italic text-[#C6A36B]">Instant Strategic Scoping</span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md font-light leading-relaxed">
            Select your matter parameters to generate an instant diagnostic blueprint, estimated conflict screening timeline, and designated lead partner.
          </p>
        </div>

        {/* 2-Column Interactive Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Interactive Inputs */}
          <div className="lg:col-span-6 bg-[#07182E] border border-white/10 p-6 sm:p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              {/* 1. Legal Domain */}
              <div className="space-y-2.5">
                <label className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
                  1. Primary Legal Domain
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'corporate', label: 'Corporate & M&A' },
                    { id: 'disputes', label: 'High-Stakes Disputes' },
                    { id: 'ip', label: 'IP & Technology' },
                    { id: 'wealth', label: 'Private Wealth & Trust' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setDomain(item.id as any)}
                      className={`px-3.5 py-3 text-xs text-left font-medium border transition-all ${
                        domain === item.id
                          ? 'border-[#C6A36B] bg-[#C6A36B]/15 text-[#F6F3ED] shadow-sm'
                          : 'border-white/10 bg-[#0B2340]/40 text-slate-300 hover:border-white/30'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Matter Scale / Value */}
              <div className="space-y-2.5">
                <label className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
                  2. Approximate Transaction or Claim Value
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'mid', label: '$5M – $25M' },
                    { id: 'large', label: '$25M – $100M' },
                    { id: 'institutional', label: '$100M+' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setScale(item.id as any)}
                      className={`px-3 py-2.5 text-xs text-center font-medium border transition-all ${
                        scale === item.id
                          ? 'border-[#C6A36B] bg-[#C6A36B]/15 text-[#F6F3ED]'
                          : 'border-white/10 bg-[#0B2340]/40 text-slate-300 hover:border-white/30'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Urgency */}
              <div className="space-y-2.5">
                <label className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
                  3. Temporal Urgency
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'emergency', label: 'Emergency (24–48h)' },
                    { id: 'transactional', label: 'Active (30–60d)' },
                    { id: 'strategic', label: 'Strategic Horizon' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setUrgency(item.id as any)}
                      className={`px-2.5 py-2.5 text-xs text-center font-medium border transition-all ${
                        urgency === item.id
                          ? 'border-[#C6A36B] bg-[#C6A36B]/15 text-[#F6F3ED]'
                          : 'border-white/10 bg-[#0B2340]/40 text-slate-300 hover:border-white/30'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Target Jurisdiction */}
              <div className="space-y-2.5">
                <label className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
                  4. Primary Legal Jurisdiction
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'uk', label: 'UK (London)' },
                    { id: 'us', label: 'US (NY/DE)' },
                    { id: 'eu', label: 'EU (Zurich)' },
                    { id: 'sg', label: 'Asia (SG/DIFC)' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setForum(item.id as any)}
                      className={`px-2 py-2 text-[11px] text-center font-medium border transition-all ${
                        forum === item.id
                          ? 'border-[#C6A36B] bg-[#C6A36B]/15 text-[#F6F3ED]'
                          : 'border-white/10 bg-[#0B2340]/40 text-slate-300 hover:border-white/30'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 text-slate-300">
                <ShieldCheck size={14} className="text-[#C6A36B]" />
                Zero-obligation scoping
              </span>
              <span>All parameters processed client-side</span>
            </div>
          </div>

          {/* Right Column: Tailored Strategic Diagnostic Output */}
          <div className="lg:col-span-6 bg-[#07182E] border border-[#C6A36B]/50 p-6 sm:p-8 flex flex-col justify-between relative shadow-2xl">
            {/* Top Badge */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#C6A36B]">
                    Strategic Blueprint Output
                  </span>
                  <h3 className="font-serif text-2xl text-white font-medium">
                    {blueprint.categoryTitle}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 bg-[#C6A36B]/20 border border-[#C6A36B] text-[10px] uppercase font-bold tracking-wider text-[#C6A36B]">
                    Priority Tier 1
                  </span>
                </div>
              </div>

              {/* Partner Card */}
              <div className="p-4 bg-[#0B2340] border border-white/10 flex items-center gap-4">
                <img
                  src={blueprint.leadPhoto}
                  alt={blueprint.recommendedLead}
                  className="w-14 h-14 object-cover object-top border border-[#C6A36B]/50 shrink-0"
                />
                <div className="space-y-0.5">
                  <p className="text-[10px] uppercase tracking-wider text-slate-400">Designated Lead Counsel</p>
                  <p className="font-serif text-lg text-white font-medium">{blueprint.recommendedLead}</p>
                  <p className="text-xs text-[#C6A36B] font-light">{blueprint.leadTitle}</p>
                </div>
              </div>

              {/* Key Diagnostic Vectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 bg-white/5 border border-white/5 space-y-1">
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <Clock size={12} className="text-[#C6A36B]" />
                    Screening Turnaround
                  </p>
                  <p className="text-xs font-semibold text-white">{blueprint.screeningTime}</p>
                </div>

                <div className="p-3.5 bg-white/5 border border-white/5 space-y-1">
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <Landmark size={12} className="text-[#C6A36B]" />
                    Designated Forum
                  </p>
                  <p className="text-xs font-semibold text-white">{blueprint.recommendedForum}</p>
                </div>
              </div>

              {/* Tactical Summary */}
              <div className="space-y-2">
                <p className="text-[10px] uppercase tracking-wider text-slate-400">Prescribed Representation Posture</p>
                <p className="text-xs text-slate-300 leading-relaxed font-light">
                  {blueprint.keyStrategy}
                </p>
              </div>

              <div className="p-3 bg-[#C6A36B]/10 border-l-2 border-[#C6A36B] text-[11px] text-slate-200">
                <strong className="text-[#C6A36B]">Retainer Model:</strong> {blueprint.suggestedRetainerScope}
              </div>
            </div>

            {/* CTA Button Handoff */}
            <div className="pt-6 mt-6 border-t border-white/10 flex flex-col sm:flex-row items-center gap-4">
              <Link
                href={`/book-consultation?practice=${domain}`}
                className="w-full sm:w-auto flex-1 text-center py-3.5 px-6 bg-[#C6A36B] text-[#07182E] text-xs uppercase tracking-[0.16em] font-bold hover:bg-[#d8b884] transition-all flex items-center justify-center gap-2"
              >
                Schedule Clearance Consultation
                <ArrowRight size={14} />
              </Link>
              <a
                href="#contact"
                className="w-full sm:w-auto text-center py-3.5 px-6 border border-white/20 text-white text-xs uppercase tracking-[0.16em] font-medium hover:border-[#C6A36B] transition-colors"
              >
                Inquire Directly
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
