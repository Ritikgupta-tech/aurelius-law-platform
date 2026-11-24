import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { db } from '@/lib/db/database';
import {
  Building2,
  CheckCircle2,
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  Scale,
  BriefcaseBusiness,
} from 'lucide-react';

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  const practiceAreas = db.getAllPracticeAreas();
  return practiceAreas.map((p) => ({ slug: p.slug }));
}

export default function PracticeAreaDetailPage({ params }: Props) {
  const area = db.getPracticeAreaBySlug(params.slug);
  if (!area) {
    notFound();
  }

  const leadAttorney = area.lead_attorney_id ? db.getAttorneyById(area.lead_attorney_id) : null;
  const relatedAreas = db.getPracticeAreas().filter((p) => p.id !== area.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#F8F5EF] text-[#202936] font-sans antialiased">
      <Navbar />

      <main className="pt-28 pb-24">
        {/* Header Hero */}
        <section className="bg-[#07182E] text-white py-20 px-4 sm:px-6 lg:px-8 border-b border-[#C6A36B]/20">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center gap-2 text-xs text-[#C6A36B] uppercase tracking-[0.2em]">
              <Link href="/practice-areas" className="hover:underline">Practice Areas</Link>
              <span>/</span>
              <span>{area.title}</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl text-white max-w-4xl font-normal leading-tight">
              {area.title}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-3xl font-light leading-relaxed">
              {area.short_description}
            </p>

            <div className="pt-4 flex flex-wrap gap-4">
              <Link
                href={`/book-consultation?practice=${area.id}`}
                className="px-7 py-3.5 bg-[#C6A36B] text-[#07182E] text-xs uppercase tracking-widest font-semibold flex items-center gap-2 hover:bg-[#d5b682] transition-colors"
              >
                Consult on this Practice
                <ArrowUpRight size={15} />
              </Link>
              <Link
                href="#services"
                className="px-7 py-3.5 border border-white/20 text-white text-xs uppercase tracking-widest hover:border-[#C6A36B] transition-colors"
              >
                View Key Services
              </Link>
            </div>
          </div>
        </section>

        {/* Content Body */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Main Column */}
            <div className="lg:col-span-8 space-y-12">
              <div className="space-y-6">
                <h2 className="font-serif text-3xl text-[#07182E]">Practice Overview</h2>
                <p className="text-base text-slate-700 leading-relaxed font-light">
                  {area.full_description}
                </p>
              </div>

              {/* Key Services Grid */}
              <div id="services" className="space-y-6 pt-4">
                <h3 className="font-serif text-2xl text-[#07182E] border-b border-slate-200 pb-3">
                  Scope of Representation & Services
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {area.key_services.map((service) => (
                    <div
                      key={service}
                      className="p-4 bg-white border border-slate-200 flex items-start gap-3 shadow-sm"
                    >
                      <CheckCircle2 size={18} className="text-[#C6A36B] shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-800 font-medium leading-relaxed">{service}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Typical Matters / Experience */}
              <div className="space-y-6 pt-4">
                <h3 className="font-serif text-2xl text-[#07182E] border-b border-slate-200 pb-3">
                  Representative Matters & Engagements
                </h3>
                <div className="space-y-3">
                  {area.typical_matters.map((matter, idx) => (
                    <div
                      key={idx}
                      className="p-5 bg-white border-l-4 border-l-[#A87948] border border-slate-200 text-xs text-slate-700 leading-relaxed"
                    >
                      {matter}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Column */}
            <div className="lg:col-span-4 space-y-8">
              {/* Lead Attorney Card */}
              {leadAttorney && (
                <div className="bg-white border border-[#07182E]/10 p-6 space-y-4 shadow-sm">
                  <span className="text-[10px] uppercase tracking-widest text-[#A87948] font-bold">
                    Practice Group Lead
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
                  <p className="text-xs text-slate-600 line-clamp-3 font-light leading-relaxed">
                    {leadAttorney.bio}
                  </p>
                  <div className="pt-2">
                    <Link
                      href={`/attorneys/${leadAttorney.slug}`}
                      className="text-xs uppercase tracking-wider text-[#07182E] font-semibold hover:text-[#C6A36B] flex items-center gap-1"
                    >
                      View Full Biography
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              )}

              {/* Direct Booking Box */}
              <div className="p-6 bg-[#07182E] text-white border border-[#C6A36B]/40 space-y-4">
                <div className="flex items-center gap-2 text-xs text-[#C6A36B] font-semibold uppercase tracking-wider">
                  <ShieldCheck size={16} />
                  Private Legal Retainer
                </div>
                <h4 className="font-serif text-xl text-white">Need Counsel in {area.title}?</h4>
                <p className="text-xs text-slate-300 font-light leading-relaxed">
                  Reserve a direct consultation session with our practice partners to appraise your case or transaction.
                </p>
                <Link
                  href={`/book-consultation?practice=${area.id}`}
                  className="w-full text-center block py-3 bg-[#C6A36B] text-[#07182E] text-xs uppercase tracking-widest font-bold hover:bg-[#d5b682] transition-colors"
                >
                  Book Consultation Now
                </Link>
              </div>

              {/* Related Practice Areas */}
              <div className="bg-white border border-slate-200 p-6 space-y-4">
                <h4 className="font-serif text-base text-[#07182E]">Related Disciplines</h4>
                <div className="space-y-2">
                  {relatedAreas.map((rel) => (
                    <Link
                      key={rel.id}
                      href={`/practice-areas/${rel.slug}`}
                      className="block p-2.5 hover:bg-slate-50 text-xs text-slate-700 hover:text-[#A87948] transition-colors flex items-center justify-between"
                    >
                      <span>{rel.title}</span>
                      <ArrowUpRight size={13} />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
