'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Building2, Search, ArrowUpRight, ArrowRight, ShieldCheck } from 'lucide-react';
import { db } from '@/lib/db/database';

export default function PracticeAreasPage() {
  const [search, setSearch] = useState('');
  const practiceAreas = db.getAllPracticeAreas();

  const filtered = practiceAreas.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.short_description.toLowerCase().includes(search.toLowerCase()) ||
      p.key_services.some((s) => s.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#F8F5EF] text-[#202936] font-sans antialiased">
      <Navbar />

      <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Hero header */}
        <div className="max-w-3xl space-y-4 mb-14">
          <div className="text-[#A87948] text-xs font-semibold uppercase tracking-[0.25em] flex items-center gap-2">
            <span className="w-6 h-[1px] bg-[#A87948]" />
            Areas of Practice / 15 Disciplines
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl text-[#07182E] font-normal leading-[1.1]">
            Where Uncompromising Experience <br />
            <span className="italic text-[#A87948]">Meets Commercial Ambition.</span>
          </h1>
          <p className="text-base text-slate-600 font-light leading-relaxed">
            Our specialized legal practices span corporate governance, high-stakes dispute resolution, venture financing, and cross-border regulatory compliance. Explore our 15 core legal departments below.
          </p>

          {/* Search bar */}
          <div className="pt-4 max-w-md">
            <div className="relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search practice areas or legal services..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border border-[#07182E]/20 text-xs text-[#07182E] placeholder:text-slate-400 focus:outline-none focus:border-[#C6A36B]"
              />
            </div>
          </div>
        </div>

        {/* Practice Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((area, idx) => (
            <div
              key={area.id}
              className="bg-white border border-[#07182E]/10 hover:border-[#C6A36B] p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-xl group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-serif text-xs text-[#A87948] tracking-widest font-bold">
                    {(idx + 1).toString().padStart(2, '0')}
                  </span>
                  <Building2 size={20} className="text-[#A87948] group-hover:scale-110 transition-transform" />
                </div>

                <h2 className="font-serif text-2xl text-[#07182E] group-hover:text-[#A87948] transition-colors leading-snug">
                  {area.title}
                </h2>

                <p className="text-xs text-slate-600 leading-relaxed font-light">
                  {area.short_description}
                </p>

                {/* Key services preview tags */}
                <div className="pt-2 flex flex-wrap gap-1.5">
                  {area.key_services.slice(0, 3).map((service) => (
                    <span
                      key={service}
                      className="px-2 py-0.5 bg-slate-100 text-[10px] text-slate-600 rounded-sm"
                    >
                      {service}
                    </span>
                  ))}
                  {area.key_services.length > 3 && (
                    <span className="px-2 py-0.5 text-[10px] text-slate-400">
                      +{area.key_services.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href={`/practice-areas/${area.slug}`}
                  className="text-xs uppercase tracking-wider text-[#07182E] font-semibold hover:text-[#C6A36B] flex items-center gap-1.5"
                >
                  Explore Practice
                  <ArrowUpRight size={13} />
                </Link>
                <Link
                  href={`/book-consultation?practice=${area.id}`}
                  className="text-[11px] uppercase tracking-wider text-[#A87948] hover:underline"
                >
                  Consult Partner
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Global CTA */}
        <div className="mt-20 p-10 bg-[#07182E] text-white flex flex-col md:flex-row items-center justify-between gap-6 border border-[#C6A36B]/30">
          <div className="space-y-2">
            <h3 className="font-serif text-2xl text-white">Have a Complex Multi-Disciplinary Inquiry?</h3>
            <p className="text-xs text-slate-300 font-light max-w-xl">
              Many corporate transactions require coordinated counsel across tax, corporate structuring, and IP. Contact our managing partners for a confidential briefing.
            </p>
          </div>
          <Link
            href="/book-consultation"
            className="px-8 py-3.5 bg-[#C6A36B] text-[#07182E] text-xs uppercase tracking-widest font-semibold hover:bg-[#d5b682] transition-colors shrink-0"
          >
            Schedule Consultation
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
