'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { db } from '@/lib/db/database';
import { Search, ArrowRight, ArrowUpRight, Scale } from 'lucide-react';

export default function CaseStudiesPage() {
  const [search, setSearch] = useState('');
  const caseStudies = db.getCaseStudies();

  const filtered = caseStudies.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.practice_area.toLowerCase().includes(search.toLowerCase()) ||
      c.client_anonymized_title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8F5EF] text-[#202936] font-sans antialiased">
      <Navbar />

      <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="max-w-3xl space-y-4 mb-14">
          <div className="text-[#A87948] text-xs font-semibold uppercase tracking-[0.25em] flex items-center gap-2">
            <span className="w-6 h-[1px] bg-[#A87948]" />
            Case Studies & Track Record
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl text-[#07182E] font-normal leading-[1.1]">
            Proven Strategy. <br />
            <span className="italic text-[#A87948]">Demonstrated Outcomes.</span>
          </h1>
          <p className="text-base text-slate-600 font-light leading-relaxed">
            Every legal matter demands an uncompromising strategy. Below is a selection of recent high-stakes representations, anonymized in strict accordance with professional confidentiality obligations.
          </p>

          <div className="pt-4 max-w-md">
            <div className="relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Filter by industry, practice, or matter type..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border border-[#07182E]/20 text-xs text-[#07182E] placeholder:text-slate-400 focus:outline-none focus:border-[#C6A36B]"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((study) => (
            <div
              key={study.id}
              className="bg-white border border-[#07182E]/10 hover:border-[#C6A36B] p-8 flex flex-col justify-between hover:shadow-xl transition-all duration-300"
            >
              <div className="space-y-4">
                <span className="text-[10px] uppercase tracking-widest text-[#A87948] font-bold">
                  {study.practice_area}
                </span>
                <h2 className="font-serif text-2xl text-[#07182E] leading-snug">
                  {study.title}
                </h2>
                <p className="text-xs text-slate-500 italic">
                  Client Profile: {study.client_anonymized_title}
                </p>

                <div className="pt-2 space-y-3 text-xs text-slate-600 font-light leading-relaxed">
                  <div>
                    <strong className="text-[#07182E] font-medium block">The Commercial Challenge:</strong>
                    {study.challenge}
                  </div>
                  <div>
                    <strong className="text-[#07182E] font-medium block">Strategic Execution:</strong>
                    {study.strategy}
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-100">
                    <strong className="text-[#07182E] font-medium block">Demonstrable Outcome:</strong>
                    <span className="text-slate-800 font-normal">{study.outcome}</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href={`/case-studies/${study.slug}`}
                  className="text-xs uppercase tracking-wider text-[#07182E] font-semibold hover:text-[#C6A36B] flex items-center gap-1.5"
                >
                  Full Case Study
                  <ArrowRight size={13} />
                </Link>
                <Link
                  href="/book-consultation"
                  className="text-[11px] uppercase tracking-wider text-[#A87948] hover:underline"
                >
                  Discuss Similar Matter
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
