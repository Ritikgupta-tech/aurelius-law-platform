'use client';

import { useState, useEffect } from 'react';
import { Landmark, Globe2, Activity, ShieldCheck, Scale, ArrowUpRight } from 'lucide-react';

interface PulseItem {
  id: string;
  category: string;
  label: string;
  metric: string;
  status: 'active' | 'caution' | 'cleared';
}

const pulseData: PulseItem[] = [
  { id: '1', category: 'Global M&A', label: 'Cross-Border Deal Velocity (Q4)', metric: '$412B Monitored', status: 'cleared' },
  { id: '2', category: 'Tribunal Status', label: 'London LCIA & Commercial Court', metric: 'Chambers In Session', status: 'active' },
  { id: '3', category: 'Regulatory Watch', label: 'EU Digital Markets Act Compliance Review', metric: 'Stage 3 Enforcement', status: 'caution' },
  { id: '4', category: 'US Federal Docket', label: 'SDNY & Delaware Chancery Forum', metric: 'Hearing Filings Active', status: 'active' },
  { id: '5', category: 'Sovereign Debt', label: 'ICSID Investment Treaty Arbitration', metric: 'Tier-1 Roster Engaged', status: 'cleared' },
  { id: '6', category: 'IP Portfolio', label: 'WIPO Unified Patent Court Benchmark', metric: '99.4% Defense Record', status: 'cleared' },
];

export default function MarketPulseTicker() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % pulseData.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const current = pulseData[currentIndex];

  return (
    <div className="w-full bg-[#051325] border-y border-[#C6A36B]/25 py-2.5 px-4 sm:px-6 lg:px-8 text-white relative z-20">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        {/* Left: Global intelligence badge */}
        <div className="flex items-center gap-2.5 shrink-0">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C6A36B] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C6A36B]"></span>
          </span>
          <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#C6A36B] flex items-center gap-1.5">
            <Activity size={12} />
            Market & Regulatory Pulse
          </span>
          <span className="hidden md:inline text-white/20">|</span>
          <span className="hidden md:inline text-[11px] text-slate-400">
            Real-time jurisdictional intelligence for institutional counsel
          </span>
        </div>

        {/* Center / Carousel indicator */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end overflow-hidden">
          <div className="flex items-center gap-2 animate-fade-in key={current.id}">
            <span className="px-1.5 py-0.5 bg-[#C6A36B]/15 border border-[#C6A36B]/40 text-[9px] uppercase tracking-wider text-[#C6A36B] font-semibold">
              {current.category}
            </span>
            <span className="text-slate-200 text-xs font-medium truncate max-w-[200px] sm:max-w-[320px]">
              {current.label}:
            </span>
            <span className="text-[#F6F3ED] text-xs font-serif italic font-semibold">
              {current.metric}
            </span>
          </div>

          {/* Dots */}
          <div className="flex items-center gap-1 shrink-0 ml-2">
            {pulseData.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  currentIndex === idx ? 'bg-[#C6A36B] w-3' : 'bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
