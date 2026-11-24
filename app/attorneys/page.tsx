'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { db } from '@/lib/db/database';
import { Search, ArrowUpRight, ArrowRight, Award, Mail, Phone, MapPin } from 'lucide-react';

export default function AttorneysPage() {
  const [search, setSearch] = useState('');
  const attorneys = db.getAllAttorneys();

  const filtered = attorneys.filter(
    (a) =>
      a.full_name.toLowerCase().includes(search.toLowerCase()) ||
      a.designation.toLowerCase().includes(search.toLowerCase()) ||
      a.office_location.toLowerCase().includes(search.toLowerCase()) ||
      a.bar_admissions.some((b) => b.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#F8F5EF] text-[#202936] font-sans antialiased">
      <Navbar />

      <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="max-w-3xl space-y-4 mb-14">
          <div className="text-[#A87948] text-xs font-semibold uppercase tracking-[0.25em] flex items-center gap-2">
            <span className="w-6 h-[1px] bg-[#A87948]" />
            Leadership & Advocates
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl text-[#07182E] font-normal leading-[1.1]">
            Accomplished Minds. <br />
            <span className="italic text-[#A87948]">Human Perspective.</span>
          </h1>
          <p className="text-base text-slate-600 font-light leading-relaxed">
            Our legal practitioners combine elite academic backgrounds with decades of proven trial advocacy and multi-billion-dollar transaction execution.
          </p>

          {/* Search */}
          <div className="pt-4 max-w-md">
            <div className="relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search attorneys by name, jurisdiction, or bar admission..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border border-[#07182E]/20 text-xs text-[#07182E] placeholder:text-slate-400 focus:outline-none focus:border-[#C6A36B]"
              />
            </div>
          </div>
        </div>

        {/* Attorney Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((attorney) => (
            <div
              key={attorney.id}
              className="bg-white border border-[#07182E]/10 overflow-hidden flex flex-col justify-between hover:shadow-xl transition-all duration-300 hover:border-[#C6A36B] group"
            >
              <div>
                <div className="relative aspect-[3/4] overflow-hidden bg-slate-900">
                  <img
                    src={attorney.photo_url}
                    alt={attorney.full_name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07182E] via-transparent to-transparent opacity-60" />

                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="text-[10px] uppercase tracking-widest text-[#C6A36B] font-bold bg-[#07182E]/80 backdrop-blur-sm px-2.5 py-1">
                      {attorney.experience_years}+ Years Experience
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <p className="text-[11px] uppercase tracking-wider text-[#A87948] font-bold">
                    {attorney.designation}
                  </p>
                  <h2 className="font-serif text-2xl text-[#07182E] group-hover:text-[#A87948] transition-colors">
                    {attorney.full_name}
                  </h2>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5">
                    <MapPin size={13} className="text-[#A87948]" />
                    {attorney.office_location}
                  </p>
                  <p className="text-xs text-slate-600 line-clamp-3 font-light leading-relaxed pt-1">
                    {attorney.bio}
                  </p>

                  {/* Bar Admissions snippet */}
                  <div className="pt-2">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block mb-1">
                      Admissions
                    </span>
                    <p className="text-[11px] text-slate-600 font-medium">
                      {attorney.bar_admissions[0]}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-slate-100 mt-4 flex items-center justify-between">
                <Link
                  href={`/attorneys/${attorney.slug}`}
                  className="text-xs uppercase tracking-wider text-[#07182E] font-semibold hover:text-[#C6A36B] flex items-center gap-1"
                >
                  View Profile
                  <ArrowUpRight size={13} />
                </Link>
                <Link
                  href={`/book-consultation?attorney=${attorney.id}`}
                  className="text-xs uppercase tracking-wider text-[#A87948] hover:underline"
                >
                  Consult
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
