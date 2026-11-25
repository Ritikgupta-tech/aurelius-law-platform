'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AlertCircle, RotateCcw, ArrowLeft } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log unexpected runtime error to monitoring
    console.error('Unhandled runtime exception:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#F8F5EF] text-[#202936] font-sans antialiased flex flex-col justify-between">
      <Navbar />

      <main className="py-40 px-4 text-center max-w-xl mx-auto space-y-6">
        <div className="w-16 h-16 bg-red-100 border border-red-300 text-red-700 flex items-center justify-center rounded-full mx-auto">
          <AlertCircle size={32} />
        </div>

        <span className="text-xs uppercase tracking-[0.25em] text-[#A87948] font-semibold block">
          500 / Judicial Runtime Interruption
        </span>

        <h1 className="font-serif text-3xl sm:text-5xl text-[#07182E]">
          Unexpected Chamber Exception
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
          An unexpected interruption occurred while processing this legal transaction. Our system reliability engineers and intake operations have been notified.
        </p>

        {error.digest && (
          <div className="p-3 bg-slate-100 border border-slate-200 inline-block font-mono text-[11px] text-slate-500">
            Incident Reference: <span className="font-bold text-[#07182E]">{error.digest}</span>
          </div>
        )}

        <div className="pt-4 flex flex-wrap justify-center gap-4">
          <button
            onClick={() => reset()}
            className="px-6 py-3 bg-[#C6A36B] text-[#07182E] text-xs uppercase tracking-widest font-bold flex items-center gap-2 hover:bg-[#d5b682] transition-colors"
          >
            <RotateCcw size={14} /> Re-attempt Operation
          </button>
          <Link
            href="/"
            className="px-6 py-3 bg-[#07182E] text-[#C6A36B] text-xs uppercase tracking-widest font-semibold flex items-center gap-2 hover:bg-[#0B2340] transition-colors"
          >
            <ArrowLeft size={14} /> Return to Chambers
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
