import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Scale, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F8F5EF] text-[#202936] font-sans antialiased flex flex-col justify-between">
      <Navbar />

      <main className="py-40 px-4 text-center max-w-xl mx-auto space-y-6">
        <div className="w-16 h-16 border border-[#C6A36B] text-[#C6A36B] flex items-center justify-center rotate-45 mx-auto">
          <Scale size={28} className="-rotate-45" strokeWidth={1.5} />
        </div>

        <span className="text-xs uppercase tracking-[0.25em] text-[#A87948] font-semibold block">
          404 / Record Not Found
        </span>

        <h1 className="font-serif text-4xl sm:text-5xl text-[#07182E]">
          Page Not Located
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
          The requested legal resource, profile, or journal briefing does not exist or may have been relocated in accordance with confidentiality retention policies.
        </p>

        <div className="pt-4 flex justify-center gap-4">
          <Link
            href="/"
            className="px-6 py-3 bg-[#07182E] text-[#C6A36B] text-xs uppercase tracking-widest font-semibold flex items-center gap-2 hover:bg-[#0B2340]"
          >
            <ArrowLeft size={14} /> Return to Homepage
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
