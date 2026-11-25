'use client';

import { useState, useEffect } from 'react';
import { MapPin, Phone, Clock, ArrowRight, ShieldCheck, Globe2 } from 'lucide-react';

interface Chamber {
  id: string;
  city: string;
  country: string;
  timezoneOffset: number; // UTC offset in hours
  address: string;
  phone: string;
  leadPartner: string;
  status: 'Open for In-Person Sessions' | 'Secure Electronic Intake Active';
}

const CHAMBERS: Chamber[] = [
  {
    id: 'london',
    city: 'London',
    country: 'United Kingdom',
    timezoneOffset: 0,
    address: '250 Bishopsgate, London EC2M 4AA',
    phone: '+44 20 7946 0912',
    leadPartner: 'Arthur Sterling, KC',
    status: 'Open for In-Person Sessions',
  },
  {
    id: 'newyork',
    city: 'New York',
    country: 'United States',
    timezoneOffset: -5,
    address: '767 Fifth Avenue, New York, NY 10153',
    phone: '+1 212 555 0184',
    leadPartner: 'Elena Rostova-Hart',
    status: 'Open for In-Person Sessions',
  },
  {
    id: 'geneva',
    city: 'Geneva',
    country: 'Switzerland',
    timezoneOffset: 1,
    address: 'Rue du Rhône 42, 1204 Genève',
    phone: '+41 22 555 0190',
    leadPartner: 'Camilla Montgomery',
    status: 'Open for In-Person Sessions',
  },
  {
    id: 'singapore',
    city: 'Singapore',
    country: 'Singapore',
    timezoneOffset: 8,
    address: '10 Collyer Quay, Ocean Financial Centre, Singapore 049315',
    phone: '+65 6789 0122',
    leadPartner: 'Marcus Vance, Esq.',
    status: 'Secure Electronic Intake Active',
  },
  {
    id: 'zurich',
    city: 'Zurich',
    country: 'Switzerland',
    timezoneOffset: 1,
    address: 'Bahnhofstrasse 28, 8001 Zürich',
    phone: '+41 44 555 0144',
    leadPartner: 'Devin K. Thorne',
    status: 'Open for In-Person Sessions',
  },
  {
    id: 'dubai',
    city: 'Dubai',
    country: 'United Arab Emirates',
    timezoneOffset: 4,
    address: 'DIFC Gate Precinct 4, Level 5, Dubai',
    phone: '+971 4 555 0199',
    leadPartner: 'Alistair Vance-Moreau',
    status: 'Open for In-Person Sessions',
  },
];

export default function GlobalChambers() {
  const [selectedChamber, setSelectedChamber] = useState<Chamber>(CHAMBERS[0]);
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Calculate local time based on UTC + timezoneOffset
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const targetTime = new Date(utc + 3600000 * selectedChamber.timezoneOffset);
      setCurrentTime(
        targetTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [selectedChamber]);

  return (
    <section className="py-20 bg-[#041225] text-white px-4 sm:px-6 lg:px-8 border-t border-[#C6A36B]/20 font-sans">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div className="space-y-3">
            <div className="text-[#C6A36B] text-xs font-semibold uppercase tracking-[0.25em] flex items-center gap-2">
              <Globe2 size={16} />
              Global Jurisdictional Footprint
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-light">
              Coordinated Chambers in <br />
              <span className="italic text-[#C6A36B]">Key Financial Gateways</span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md font-light leading-relaxed">
            Our multi-jurisdictional network delivers seamless cross-border coverage across London, New York, Geneva, Zurich, Singapore, and Dubai.
          </p>
        </div>

        {/* Chamber Selectors Ribbon */}
        <div className="flex sm:grid sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3 overflow-x-auto pb-2 sm:pb-0 scrollbar-none snap-x">
          {CHAMBERS.map((ch) => {
            const isSelected = selectedChamber.id === ch.id;
            return (
              <button
                key={ch.id}
                onClick={() => setSelectedChamber(ch)}
                className={`p-3.5 sm:p-4 text-left border transition-all duration-300 shrink-0 min-w-[130px] sm:min-w-0 snap-center ${
                  isSelected
                    ? 'border-[#C6A36B] bg-[#07182E] shadow-[0_0_20px_rgba(198,163,107,0.2)]'
                    : 'border-white/10 bg-[#0B2340]/40 hover:border-white/30 text-slate-400 hover:text-white'
                }`}
              >
                <p className="text-[10px] uppercase tracking-wider text-[#C6A36B] font-bold">
                  {ch.country}
                </p>
                <p className="font-serif text-base sm:text-lg text-white font-medium mt-1">{ch.city}</p>
              </button>
            );
          })}
        </div>

        {/* Selected Chamber Detail Card */}
        <div className="p-5 sm:p-8 md:p-10 bg-[#07182E] border border-[#C6A36B]/40 shadow-2xl grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center">
          <div className="md:col-span-5 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-950/80 border border-emerald-700/60 text-emerald-400 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {selectedChamber.status}
            </div>

            <h3 className="font-serif text-3xl text-white">
              {selectedChamber.city} Chambers
            </h3>
            <p className="text-xs text-slate-300 font-light leading-relaxed">
              Serving institutional clients, sovereign funds, and corporate boards under the supervision of Resident Managing Partner <strong>{selectedChamber.leadPartner}</strong>.
            </p>
          </div>

          <div className="md:col-span-4 space-y-4 border-y md:border-y-0 md:border-x border-white/10 py-6 md:py-0 md:px-8 text-xs text-slate-300">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 flex items-center gap-1.5 font-semibold">
                <MapPin size={13} className="text-[#C6A36B]" /> Address
              </span>
              <p className="font-medium text-white">{selectedChamber.address}</p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 flex items-center gap-1.5 font-semibold">
                <Phone size={13} className="text-[#C6A36B]" /> Direct Chambers Line
              </span>
              <a href={`tel:${selectedChamber.phone}`} className="font-mono text-[#C6A36B] font-bold hover:underline">
                {selectedChamber.phone}
              </a>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 flex items-center gap-1.5 font-semibold">
                <Clock size={13} className="text-[#C6A36B]" /> Local Chamber Time
              </span>
              <p className="font-mono text-sm text-white font-bold">{currentTime || 'Synchronizing...'}</p>
            </div>
          </div>

          <div className="md:col-span-3 space-y-3 flex flex-col justify-center">
            <a
              href="/book-consultation"
              className="w-full py-3.5 bg-[#C6A36B] text-[#07182E] text-xs uppercase tracking-widest font-bold text-center hover:bg-[#d5b682] transition-colors"
            >
              Book In {selectedChamber.city}
            </a>
            <a
              href={`mailto:inquiries@aureliuslaw.com?subject=Inquiry for ${selectedChamber.city} Chambers`}
              className="w-full py-3 border border-white/20 text-white text-xs uppercase tracking-widest font-semibold text-center hover:border-[#C6A36B] transition-colors"
            >
              Contact Chambers
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
