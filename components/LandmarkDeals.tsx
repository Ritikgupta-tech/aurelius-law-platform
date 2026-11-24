'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, TrendingUp, ShieldCheck, Landmark, DollarSign, Award } from 'lucide-react';

interface LandmarkDeal {
  id: string;
  category: 'm-and-a' | 'arbitration' | 'ip' | 'crisis';
  title: string;
  forum: string;
  value: string;
  leadPartner: string;
  summary: string;
  impactMetric: string;
}

const landmarkDeals: LandmarkDeal[] = [
  {
    id: '1',
    category: 'm-and-a',
    title: 'Cross-Border Hostile Takeover Defense for Industrial Consortium',
    forum: 'UK Takeover Panel & London Commercial Court',
    value: '£1.42 Billion',
    leadPartner: 'Arthur Sterling, KC',
    summary: 'Orchestrated dual-track defense invoking regulatory national security screenings and poison-pill shareholder rights.',
    impactMetric: '100% Shareholder Independence Preserved',
  },
  {
    id: '2',
    category: 'arbitration',
    title: 'Sovereign Energy Infrastructure Bilateral Treaty Arbitration',
    forum: 'LCIA / Permanent Court of Arbitration (The Hague)',
    value: '$820 Million',
    leadPartner: 'Arthur Sterling, KC',
    summary: 'Secured full dismissal of expropriation claims brought by offshore consortium against sovereign wealth fund.',
    impactMetric: 'Complete Zero-Liability Award Confirmed',
  },
  {
    id: '3',
    category: 'ip',
    title: 'Multi-Jurisdiction Semiconductor Architecture Patent Enforcement',
    forum: 'US Federal Circuit & Unified Patent Court',
    value: '$540 Million Royalty Base',
    leadPartner: 'Marcus Vance, Esq.',
    summary: 'Coordinated preliminary injunctions in 4 European capitals leading to worldwide cross-license settlement.',
    impactMetric: 'Global Cross-Licensing Agreement Executed',
  },
  {
    id: '4',
    category: 'crisis',
    title: 'Cross-Border Capital Restructuring for FinTech Banking Group',
    forum: 'Delaware Court of Chancery & UK High Court',
    value: '$650 Million Liquidity',
    leadPartner: 'Arthur Sterling, KC & Elena Rostova',
    summary: 'Navigated emergency pre-packaged equity conversion while preserving European banking licenses.',
    impactMetric: 'Uninterrupted Regulatory Operations Maintained',
  },
  {
    id: '5',
    category: 'm-and-a',
    title: 'Sovereign Telecommunications Divestiture & Private Equity Buyout',
    forum: 'DIFC Courts & Singapore International Commercial Court',
    value: '$1.15 Billion',
    leadPartner: 'Elena Rostova, LL.M.',
    summary: 'Engineered ring-fenced data sovereignty framework satisfying dual EMEA and Asian regulatory clearances.',
    impactMetric: 'Simultaneous Multi-Nation Regulatory Approval',
  },
];

export default function LandmarkDeals() {
  const [filter, setFilter] = useState<'all' | 'm-and-a' | 'arbitration' | 'ip' | 'crisis'>('all');

  const filtered = landmarkDeals.filter((d) => (filter === 'all' ? true : d.category === filter));

  return (
    <section className="py-24 bg-[#07182E] text-white px-4 sm:px-6 lg:px-8 border-t border-[#C6A36B]/20 relative">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="text-[#C6A36B] text-xs font-semibold uppercase tracking-[0.25em] flex items-center gap-2">
              <span className="w-6 h-[1px] bg-[#C6A36B]" />
              Institutional Benchmark
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-light">
              Landmark Transactions & <br />
              <span className="italic text-[#C6A36B]">Tribunal Precedents</span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md font-light leading-relaxed">
            A selection of representative historical engagements reflecting our track record in multi-hundred-million cross-border transactions and high-stakes disputes.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4">
          {[
            { id: 'all', label: 'All Precedents' },
            { id: 'm-and-a', label: 'Cross-Border M&A' },
            { id: 'arbitration', label: 'Sovereign Arbitration' },
            { id: 'ip', label: 'Global IP & Patents' },
            { id: 'crisis', label: 'Crisis & Restructuring' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold transition-all ${
                filter === tab.id
                  ? 'bg-[#C6A36B] text-[#07182E] shadow-sm font-bold'
                  : 'bg-[#0B2340]/60 text-slate-300 hover:text-white hover:bg-[#0B2340]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((deal) => (
            <div
              key={deal.id}
              className="bg-[#0B2340] border border-white/10 hover:border-[#C6A36B]/60 p-7 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="font-serif text-lg text-[#C6A36B] font-medium tracking-tight">
                    {deal.value}
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 bg-white/5 px-2 py-0.5">
                    {deal.category.toUpperCase()}
                  </span>
                </div>

                <h3 className="font-serif text-lg text-white font-medium group-hover:text-[#F6F3ED] leading-snug">
                  {deal.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed font-light">
                  {deal.summary}
                </p>

                <div className="space-y-1.5 pt-2 text-[11px] text-slate-400 border-t border-white/5">
                  <p>
                    <strong className="text-slate-300">Forum:</strong> {deal.forum}
                  </p>
                  <p>
                    <strong className="text-slate-300">Counsel:</strong> {deal.leadPartner}
                  </p>
                </div>
              </div>

              <div className="pt-5 mt-5 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] text-[#C6A36B] font-semibold flex items-center gap-1.5">
                  <ShieldCheck size={14} />
                  {deal.impactMetric}
                </span>
                <Link
                  href="/case-studies"
                  className="text-[10px] uppercase tracking-wider text-slate-400 hover:text-white flex items-center gap-1"
                >
                  Details <ArrowUpRight size={12} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
