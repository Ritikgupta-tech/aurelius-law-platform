'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PhoneCall, Calendar, Search, ShieldAlert, Sparkles, MessageSquare } from 'lucide-react';

export default function FloatingActionHUD() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after user has scrolled 300px
      setVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-[calc(0.75rem+env(safe-area-inset-bottom,0px))] left-3 right-3 sm:bottom-6 sm:left-auto sm:right-6 z-40 md:hidden animate-fade-in">
      <div className="bg-[#07182E]/98 backdrop-blur-2xl border border-[#C6A36B]/50 shadow-[0_10px_35px_rgba(0,0,0,0.5)] p-2 px-3 flex items-center justify-between gap-2 max-w-md mx-auto">
        {/* Direct Call Action */}
        <a
          href="tel:+442079460912"
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-white/5 hover:bg-white/10 text-white text-[11px] font-semibold border border-white/10 active:scale-95 transition-transform"
        >
          <PhoneCall size={14} className="text-[#C6A36B]" />
          <span>Call Hub</span>
        </a>

        {/* Conflict Check Jump */}
        <a
          href="#conflict-check"
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-white/5 hover:bg-white/10 text-white text-[11px] font-semibold border border-white/10 active:scale-95 transition-transform"
        >
          <ShieldAlert size={14} className="text-[#C6A36B]" />
          <span>Screen</span>
        </a>

        {/* Priority Consultation CTA */}
        <Link
          href="/book-consultation"
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-[#C6A36B] text-[#07182E] text-[11px] font-bold uppercase tracking-wider shadow-md hover:bg-[#d8b884] active:scale-95 transition-transform"
        >
          <Calendar size={14} />
          <span>Book</span>
        </Link>
      </div>
    </div>
  );
}
