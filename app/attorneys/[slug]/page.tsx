import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { db } from '@/lib/db/database';
import {
  Award,
  BookOpen,
  MapPin,
  Mail,
  Phone,
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  const attorneys = db.getAllAttorneys();
  return attorneys.map((a) => ({ slug: a.slug }));
}

export default function AttorneyDetailPage({ params }: Props) {
  const attorney = db.getAttorneyBySlug(params.slug);
  if (!attorney) {
    notFound();
  }

  const primaryPractice = db.getPracticeAreaById(attorney.primary_practice_id);

  return (
    <div className="min-h-screen bg-[#F8F5EF] text-[#202936] font-sans antialiased">
      <Navbar />

      <main className="pt-28 pb-24">
        {/* Profile Header */}
        <section className="bg-[#07182E] text-white py-20 px-4 sm:px-6 lg:px-8 border-b border-[#C6A36B]/20">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
            {/* Attorney Photo */}
            <div className="md:col-span-4 relative">
              <div className="relative aspect-[3/4] overflow-hidden border border-[#C6A36B]/50 shadow-2xl">
                <img
                  src={attorney.photo_url}
                  alt={attorney.full_name}
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>

            {/* Header info */}
            <div className="md:col-span-8 space-y-6">
              <div className="flex items-center gap-2 text-xs text-[#C6A36B] uppercase tracking-[0.2em]">
                <Link href="/attorneys" className="hover:underline">Attorneys</Link>
                <span>/</span>
                <span>{attorney.full_name}</span>
              </div>

              <div className="space-y-2">
                <p className="text-xs uppercase tracking-widest text-[#A87948] font-bold">
                  {attorney.designation}
                </p>
                <h1 className="font-serif text-4xl sm:text-6xl text-white font-normal">
                  {attorney.full_name}
                </h1>
                <p className="text-xs text-slate-400 flex items-center gap-2 pt-1">
                  <MapPin size={14} className="text-[#C6A36B]" />
                  Chambers: {attorney.office_location}
                </p>
              </div>

              {attorney.quote && (
                <blockquote className="font-serif text-lg italic text-[#F8F5EF] border-l-2 border-[#C6A36B] pl-4 py-1 leading-relaxed">
                  &ldquo;{attorney.quote}&rdquo;
                </blockquote>
              )}

              <div className="pt-4 flex flex-wrap gap-4">
                <Link
                  href={`/book-consultation?attorney=${attorney.id}`}
                  className="px-7 py-3.5 bg-[#C6A36B] text-[#07182E] text-xs uppercase tracking-widest font-semibold flex items-center gap-2 hover:bg-[#d5b682] transition-colors"
                >
                  Consult Directly With {attorney.full_name.split(' ')[0]}
                  <ArrowUpRight size={15} />
                </Link>
                <a
                  href={`mailto:${attorney.email}`}
                  className="px-6 py-3.5 border border-white/20 text-white text-xs uppercase tracking-widest flex items-center gap-2 hover:border-[#C6A36B] transition-colors"
                >
                  <Mail size={14} /> Send Direct Note
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Bio & Credentials */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-8 space-y-12">
              <div className="space-y-4">
                <h2 className="font-serif text-3xl text-[#07182E]">Professional Biography</h2>
                <p className="text-base text-slate-700 leading-relaxed font-light">
                  {attorney.bio}
                </p>
              </div>

              {/* Bar Admissions */}
              <div className="space-y-4 pt-2">
                <h3 className="font-serif text-2xl text-[#07182E] flex items-center gap-2 border-b border-slate-200 pb-3">
                  <Award size={20} className="text-[#A87948]" />
                  Bar Admissions & Professional Certifications
                </h3>
                <ul className="space-y-2.5">
                  {attorney.bar_admissions.map((bar, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-xs text-slate-700">
                      <CheckCircle2 size={16} className="text-[#C6A36B] shrink-0" />
                      <span>{bar}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Education */}
              <div className="space-y-4 pt-2">
                <h3 className="font-serif text-2xl text-[#07182E] flex items-center gap-2 border-b border-slate-200 pb-3">
                  <BookOpen size={20} className="text-[#A87948]" />
                  Academic Credentials & Education
                </h3>
                <ul className="space-y-2.5">
                  {attorney.education.map((edu, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-xs text-slate-700">
                      <span className="w-2 h-2 rounded-full bg-[#C6A36B]" />
                      <span>{edu}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4 space-y-8">
              {/* Primary Practice Box */}
              {primaryPractice && (
                <div className="bg-white border border-[#07182E]/10 p-6 space-y-4 shadow-sm">
                  <span className="text-[10px] uppercase tracking-widest text-[#A87948] font-bold">
                    Core Department
                  </span>
                  <h4 className="font-serif text-xl text-[#07182E]">{primaryPractice.title}</h4>
                  <p className="text-xs text-slate-600 font-light leading-relaxed">
                    {primaryPractice.short_description}
                  </p>
                  <Link
                    href={`/practice-areas/${primaryPractice.slug}`}
                    className="text-xs uppercase tracking-wider text-[#07182E] font-semibold hover:text-[#C6A36B] flex items-center gap-1"
                  >
                    Explore Department
                    <ArrowRight size={13} />
                  </Link>
                </div>
              )}

              {/* Consultation Scheduling Card */}
              <div className="p-6 bg-[#07182E] text-white border border-[#C6A36B]/40 space-y-4">
                <div className="flex items-center gap-2 text-xs text-[#C6A36B] font-semibold uppercase tracking-wider">
                  <ShieldCheck size={16} />
                  Priority Counsel Access
                </div>
                <h4 className="font-serif text-xl text-white">Retain {attorney.full_name}</h4>
                <p className="text-xs text-slate-300 font-light leading-relaxed">
                  Reserve a dedicated video or in-person consultation directly with {attorney.full_name.split(' ')[0]}.
                </p>
                <Link
                  href={`/book-consultation?attorney=${attorney.id}`}
                  className="w-full text-center block py-3 bg-[#C6A36B] text-[#07182E] text-xs uppercase tracking-widest font-bold hover:bg-[#d5b682] transition-colors"
                >
                  Schedule Appointment
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
