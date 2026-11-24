import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { db } from '@/lib/db/database';
import { ArrowRight, ArrowUpRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  const studies = db.getCaseStudies();
  return studies.map((c) => ({ slug: c.slug }));
}

export default function CaseStudyDetailPage({ params }: Props) {
  const study = db.getCaseStudyBySlug(params.slug);
  if (!study) {
    notFound();
  }

  const leadAttorney = study.lead_attorney_id ? db.getAttorneyById(study.lead_attorney_id) : null;

  return (
    <div className="min-h-screen bg-[#F8F5EF] text-[#202936] font-sans antialiased">
      <Navbar />

      <main className="pt-28 pb-24">
        {/* Header Hero */}
        <section className="bg-[#07182E] text-white py-20 px-4 sm:px-6 lg:px-8 border-b border-[#C6A36B]/20">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center gap-2 text-xs text-[#C6A36B] uppercase tracking-[0.2em]">
              <Link href="/case-studies" className="hover:underline">Case Studies</Link>
              <span>/</span>
              <span>{study.practice_area}</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl text-white max-w-4xl font-normal leading-tight">
              {study.title}
            </h1>

            <p className="text-sm uppercase tracking-wider text-[#C6A36B] font-medium">
              Client: {study.client_anonymized_title}
            </p>
          </div>
        </section>

        {/* Breakdown */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-8 space-y-10">
              <div className="space-y-4">
                <h2 className="font-serif text-2xl text-[#07182E]">1. The Commercial Dilemma & Challenge</h2>
                <p className="text-base text-slate-700 leading-relaxed font-light">
                  {study.challenge}
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="font-serif text-2xl text-[#07182E]">2. Strategic Legal Architecture</h2>
                <p className="text-base text-slate-700 leading-relaxed font-light">
                  {study.strategy}
                </p>
              </div>

              <div className="p-8 bg-white border-l-4 border-l-[#C6A36B] border border-slate-200 space-y-3 shadow-md">
                <h3 className="font-serif text-xl text-[#07182E]">3. Demonstrable Outcome</h3>
                <p className="text-base text-slate-800 leading-relaxed font-medium">
                  {study.outcome}
                </p>
              </div>

              <div className="pt-6">
                <Link
                  href="/book-consultation"
                  className="px-8 py-4 bg-[#C6A36B] text-[#07182E] text-xs uppercase tracking-widest font-bold inline-flex items-center gap-2 hover:bg-[#d5b682] transition-colors"
                >
                  Schedule Consultation on Similar Matters
                  <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-8">
              {leadAttorney && (
                <div className="bg-white border border-[#07182E]/10 p-6 space-y-4 shadow-sm">
                  <span className="text-[10px] uppercase tracking-widest text-[#A87948] font-bold">
                    Matter Lead Partner
                  </span>
                  <div className="flex items-center gap-4">
                    <img
                      src={leadAttorney.photo_url}
                      alt={leadAttorney.full_name}
                      className="w-16 h-16 object-cover object-top border border-slate-200"
                    />
                    <div>
                      <h4 className="font-serif text-base text-[#07182E] font-medium">
                        {leadAttorney.full_name}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-light">{leadAttorney.title}</p>
                    </div>
                  </div>
                  <Link
                    href={`/attorneys/${leadAttorney.slug}`}
                    className="text-xs uppercase tracking-wider text-[#07182E] font-semibold hover:text-[#C6A36B] flex items-center gap-1 pt-2"
                  >
                    View Partner Profile
                    <ArrowRight size={13} />
                  </Link>
                </div>
              )}

              <div className="p-6 bg-[#07182E] text-white border border-[#C6A36B]/40 space-y-3">
                <ShieldCheck size={18} className="text-[#C6A36B]" />
                <h4 className="font-serif text-lg text-white">Confidentiality Guarantee</h4>
                <p className="text-xs text-slate-300 font-light leading-relaxed">
                  All case summaries are carefully sanitized to safeguard client identity, proprietary trade secrets, and non-public settlement stipulations.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
