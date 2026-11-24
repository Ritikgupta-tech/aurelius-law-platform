'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GlobalChambers from '@/components/GlobalChambers';
import FeeEstimator from '@/components/FeeEstimator';
import ConflictSimulator from '@/components/ConflictSimulator';
import MarketPulseTicker from '@/components/MarketPulseTicker';
import MatterCompass from '@/components/MatterCompass';
import FirmComparison from '@/components/FirmComparison';
import LandmarkDeals from '@/components/LandmarkDeals';
import LuxuryAmbientEffects from '@/components/LuxuryAmbientEffects';
import FloatingActionHUD from '@/components/FloatingActionHUD';
import {
  Scale,
  ShieldCheck,
  Building2,
  BriefcaseBusiness,
  FileText,
  Award,
  Users,
  Landmark,
  TrendingUp,
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  Clock,
  Search,
  Lock,
  Globe2,
  Compass,
  PhoneCall,
  ChevronRight,
  ShieldAlert,
  Zap,
} from 'lucide-react';
import { db } from '@/lib/db/database';

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [openFaq, setOpenFaq] = useState<string | null>('faq-1');
  const [faqSearch, setFaqSearch] = useState('');

  // Form submission state
  const [submitting, setSubmitting] = useState(false);
  const [submittedReference, setSubmittedReference] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccessMessage, setFormSuccessMessage] = useState<string | null>(null);

  const practiceAreas = db.getPracticeAreas();
  const attorneys = db.getAttorneys().slice(0, 4);
  const blogPosts = db.getBlogPosts().slice(0, 3);
  const caseStudies = db.getCaseStudies().slice(0, 3);
  const testimonials = db.getTestimonials();
  const faqs = db.getFAQs();

  // Practice filtering
  const practiceCategories = [
    { id: 'all', label: 'All 15 Disciplines' },
    { id: 'corporate', label: 'Corporate & Capital' },
    { id: 'disputes', label: 'Litigation & Arbitration' },
    { id: 'ip', label: 'IP & Technology' },
    { id: 'wealth', label: 'Private Client & Property' },
  ];

  const filteredPractices = practiceAreas.filter((p) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'corporate') {
      return (
        p.slug.includes('corporate') ||
        p.slug.includes('formation') ||
        p.slug.includes('contracts') ||
        p.slug.includes('startup')
      );
    }
    if (activeCategory === 'disputes') {
      return p.slug.includes('litigation') || p.slug.includes('criminal') || p.slug.includes('dispute');
    }
    if (activeCategory === 'ip') {
      return p.slug.includes('intellectual') || p.slug.includes('trademark');
    }
    if (activeCategory === 'wealth') {
      return (
        p.slug.includes('family') ||
        p.slug.includes('real-estate') ||
        p.slug.includes('tax') ||
        p.slug.includes('docs')
      );
    }
    return true;
  });

  const handleEnquirySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.get('firstName'),
          lastName: formData.get('lastName'),
          email: formData.get('email'),
          phone: formData.get('phone'),
          practiceArea: formData.get('practiceArea'),
          preferredContactMethod: formData.get('preferredContactMethod'),
          message: formData.get('message'),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || 'Failed to submit enquiry.');
      } else {
        setSubmittedReference(data.reference);
        setFormSuccessMessage(data.message);
        form.reset();
      }
    } catch (err) {
      setFormError('A network error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredFaqs = faqs.filter(
    (f) =>
      f.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
      f.answer.toLowerCase().includes(faqSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8F5EF] text-[#202936] font-sans antialiased selection:bg-[#C6A36B] selection:text-[#07182E] overflow-x-hidden">
      {/* Luxury Ambient Effects (Scroll Progress Bar, Spotlight, Back to Top) */}
      <LuxuryAmbientEffects />

      {/* Main Navigation */}
      <Navbar />

      {/* ==================================================================== */}
      {/* 1. HERO SECTION (SPLIT-SCREEN EDITORIAL LUXURY) */}
      {/* ==================================================================== */}
      <section className="relative min-h-[92vh] lg:min-h-screen bg-[#07182E] text-white pt-24 sm:pt-32 md:pt-36 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 flex items-center overflow-hidden border-b border-[#C6A36B]/20">
        {/* Ambient radial lighting glow */}
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-[#C6A36B]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-0 w-[500px] h-[500px] bg-[#0d2e54]/30 rounded-full blur-3xl pointer-events-none" />

        {/* Architectural grid overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#C6A36B_1px,transparent_1px)] [background-size:32px_32px]" />

        <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 xl:gap-16 items-center relative z-10">
          {/* Left Column: Authoritative Editorial Copy */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6 md:space-y-7">
            <div className="inline-flex items-center gap-2 sm:gap-3 text-[#C6A36B] text-[10px] sm:text-xs font-semibold uppercase tracking-[0.22em] sm:tracking-[0.25em]">
              <span className="w-6 sm:w-8 h-[1px] bg-[#C6A36B]" />
              Legal Excellence · Trust · Independence
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl 2xl:text-8xl font-normal leading-[1.08] tracking-tight">
              Protecting Your Rights. <br />
              <span className="italic text-[#C6A36B]">Empowering Your Future.</span>
            </h1>

            <p className="text-sm sm:text-base lg:text-lg 2xl:text-xl text-slate-300 max-w-xl font-light leading-relaxed">
              Aurelius & Co. delivers decisive, world-class legal counsel to enterprises, sovereign institutions, and visionary founders navigating moments that define their legacy.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <Link
                href="/book-consultation"
                className="text-center px-7 py-4 bg-[#C6A36B] text-[#07182E] text-xs uppercase tracking-[0.16em] font-bold flex items-center justify-center gap-2 hover:bg-[#d8b884] transition-all duration-300 shadow-[0_8px_30px_rgba(198,163,107,0.25)] hover:translate-y-[-2px] active:scale-98"
              >
                Book a Consultation
                <ArrowUpRight size={16} />
              </Link>
              <Link
                href="/practice-areas"
                className="text-center px-7 py-4 border border-white/30 text-white text-xs uppercase tracking-[0.16em] font-semibold flex items-center justify-center gap-2 hover:border-[#C6A36B] hover:text-[#C6A36B] transition-all duration-300 active:scale-98"
              >
                Explore Our Expertise
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Quick credentials strip */}
            <div className="pt-6 sm:pt-8 grid grid-cols-3 gap-3 sm:gap-8 border-t border-white/10 max-w-lg">
              <div>
                <p className="font-serif text-2xl sm:text-3xl lg:text-4xl font-light text-[#C6A36B]">24+</p>
                <p className="text-[10px] sm:text-xs uppercase tracking-wider text-slate-400 mt-1">Years Experience</p>
              </div>
              <div>
                <p className="font-serif text-2xl sm:text-3xl lg:text-4xl font-light text-[#C6A36B]">$18B+</p>
                <p className="text-[10px] sm:text-xs uppercase tracking-wider text-slate-400 mt-1">Matters Advised</p>
              </div>
              <div>
                <p className="font-serif text-2xl sm:text-3xl lg:text-4xl font-light text-[#C6A36B]">32</p>
                <p className="text-[10px] sm:text-xs uppercase tracking-wider text-slate-400 mt-1">Jurisdictions</p>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual with Bronze Border & Framing */}
          <div className="lg:col-span-5 relative mt-6 lg:mt-0">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer decorative bronze offset box */}
              <div className="absolute -inset-3 border border-[#C6A36B]/40 transform translate-x-3 translate-y-3 pointer-events-none hidden sm:block" />

              {/* Main Image Container */}
              <div className="relative overflow-hidden bg-[#0B2340] shadow-2xl border border-[#C6A36B]/60 aspect-[4/5]">
                <img
                  src="https://images.pexels.com/photos/38139419/pexels-photo-38139419.jpeg?auto=compress&cs=tinysrgb&h=1200&w=900"
                  alt="Arthur Sterling KC, Senior Managing Partner"
                  className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07182E] via-transparent to-transparent opacity-80" />

                {/* Floating caption badge */}
                <div className="absolute bottom-4 sm:bottom-5 left-4 sm:left-5 right-4 sm:right-5 p-3.5 sm:p-4 bg-[#07182E]/90 backdrop-blur-md border-l-2 border-[#C6A36B] text-white">
                  <p className="text-[10px] uppercase tracking-widest text-[#C6A36B] font-semibold">
                    Managing Partner
                  </p>
                  <p className="font-serif text-sm sm:text-base tracking-wide font-medium">Arthur Sterling, KC</p>
                  <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5 font-light">
                    King’s Counsel · London & New York Chambers
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 2. REAL-TIME MARKET & REGULATORY PULSE TICKER */}
      {/* ==================================================================== */}
      <MarketPulseTicker />

      {/* ==================================================================== */}
      {/* 3. GLOBAL CHAMBERS (TRENDING WORLD CLOCK SWITCHER) */}
      {/* ==================================================================== */}
      <GlobalChambers />

      {/* ==================================================================== */}
      {/* 4. TRUST & REPUTATION SECTION */}
      {/* ==================================================================== */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 xl:px-12 max-w-7xl 2xl:max-w-[1536px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <div className="lg:col-span-5 space-y-4">
            <div className="text-[#A87948] text-xs font-semibold uppercase tracking-[0.2em] flex items-center gap-2">
              <span className="w-6 h-[1px] bg-[#A87948]" />
              The Aurelius Heritage
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#07182E] leading-tight font-normal">
              Calm in Complexity. <br />
              <span className="italic font-light">Decisive in Representation.</span>
            </h2>
          </div>

          <div className="lg:col-span-7 space-y-6 text-slate-700 leading-relaxed font-light">
            <p className="text-base sm:text-lg text-[#07182E] font-normal leading-relaxed">
              Founded on the conviction that extraordinary legal counsel is forged through strategic foresight, forensic intellectual rigor, and direct partner immersion.
            </p>
            <p className="text-xs sm:text-sm">
              We reject the bureaucratic delegation of conventional mega-firms. When our clients face consequential transactions or trial proceedings, they work directly with proven partners who have commanded international arbitration tribunals, negotiated landmark acquisitions, and safeguarded family dynasties through generational change.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div className="p-5 bg-white border border-[#07182E]/10 space-y-2 shadow-xs hover:border-[#C6A36B]/50 transition-colors">
                <div className="flex items-center gap-2 text-[#07182E] font-serif text-base font-medium">
                  <ShieldCheck size={18} className="text-[#C6A36B]" />
                  Privilege & Conflict Screening
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Every inbound matter undergoes pre-consultation conflict verification against adverse rosters to ensure absolute fidelity and confidentiality.
                </p>
              </div>

              <div className="p-5 bg-white border border-[#07182E]/10 space-y-2 shadow-xs hover:border-[#C6A36B]/50 transition-colors">
                <div className="flex items-center gap-2 text-[#07182E] font-serif text-base font-medium">
                  <Award size={18} className="text-[#C6A36B]" />
                  Transparent Retainers
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Unambiguous fee structures, phase-based milestone retainers, and transparent scopes of representation from day one.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 5. FIRM COMPARISON: THE AURELIUS STANDARD VS MEGA-FIRMS */}
      {/* ==================================================================== */}
      <FirmComparison />

      {/* ==================================================================== */}
      {/* 6. PRACTICE AREAS (INTERACTIVE TABBED MATRIX) */}
      {/* ==================================================================== */}
      <section className="py-24 bg-[#07182E] text-white px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 border-y border-[#C6A36B]/20">
        <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <div className="text-[#C6A36B] text-xs font-semibold uppercase tracking-[0.2em] flex items-center gap-2">
                <span className="w-6 h-[1px] bg-[#C6A36B]" />
                Practice Specializations
              </div>
              <h2 className="font-serif text-3xl sm:text-5xl font-light">
                Tailored Legal Expertise Across <br />
                <span className="italic text-[#C6A36B]">15 Core Disciplines</span>
              </h2>
            </div>
            <Link
              href="/practice-areas"
              className="text-xs uppercase tracking-[0.18em] text-[#C6A36B] hover:text-white flex items-center gap-2 transition-colors group"
            >
              Browse Full Practice Directory
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4">
            {practiceCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold transition-all ${
                  activeCategory === cat.id
                    ? 'bg-[#C6A36B] text-[#07182E] shadow-sm font-bold'
                    : 'bg-[#0B2340]/50 text-slate-300 hover:text-white hover:bg-[#0B2340]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPractices.map((area, idx) => (
              <div
                key={area.id}
                className="group relative bg-[#0B2340]/60 border border-white/10 hover:border-[#C6A36B]/60 p-8 transition-all duration-300 hover:bg-[#0B2340] hover:shadow-2xl hover:-translate-y-1 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-xs text-[#C6A36B] tracking-widest">
                      {(idx + 1).toString().padStart(2, '0')}
                    </span>
                    <Building2 size={20} className="text-[#C6A36B] opacity-80 group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="font-serif text-xl text-white group-hover:text-[#F8F5EF] transition-colors">
                    {area.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-light">
                    {area.short_description}
                  </p>

                  {/* Key services tags preview */}
                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {area.key_services.slice(0, 2).map((s) => (
                      <span key={s} className="px-2 py-0.5 bg-white/5 border border-white/10 text-[10px] text-slate-300">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between">
                  <Link
                    href={`/practice-areas/${area.slug}`}
                    className="text-[11px] uppercase tracking-wider text-[#C6A36B] hover:text-white flex items-center gap-1.5 transition-colors"
                  >
                    Explore Discipline
                    <ArrowUpRight size={13} />
                  </Link>
                  <Link
                    href={`/book-consultation?practice=${area.id}`}
                    className="text-[10px] uppercase tracking-wider text-slate-400 hover:text-white"
                  >
                    Consult Partner
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 7. THE MATTER COMPASS: INSTANT STRATEGIC SCOPING ENGINE */}
      {/* ==================================================================== */}
      <MatterCompass />

      {/* ==================================================================== */}
      {/* 8. LANDMARK TRANSACTIONS & TRIBUNAL PRECEDENTS */}
      {/* ==================================================================== */}
      <LandmarkDeals />

      {/* ==================================================================== */}
      {/* 9. INTERACTIVE RETAINER & FEE ESTIMATOR */}
      {/* ==================================================================== */}
      <FeeEstimator />

      {/* ==================================================================== */}
      {/* 10. CONFLICT CHECK SCREENING SIMULATOR */}
      {/* ==================================================================== */}
      <div id="conflict-check">
        <ConflictSimulator />
      </div>

      {/* ==================================================================== */}
      {/* 11. THE 6-STEP CLIENT ENGAGEMENT ARCHITECTURE */}
      {/* ==================================================================== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 xl:px-12 max-w-7xl 2xl:max-w-[1536px] mx-auto">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <div className="text-[#A87948] text-xs font-semibold uppercase tracking-[0.2em]">
            Client Engagement Architecture
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#07182E] font-normal">
            A Rigorous Journey From First Inquiry <br />
            <span className="italic font-light">to Resolution</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-light">
            Our established 6-phase protocol guarantees transparency, eliminates conflicts of interest, and ensures seamless execution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              step: '01',
              title: 'Initial Non-Confidential Inquiry',
              desc: 'Submit brief non-sensitive matter details through our secure portal or private phone consultation.',
            },
            {
              step: '02',
              title: 'Forensic Conflict Screening',
              desc: 'We verify opposing parties and related entities against our global database before accepting confidential data.',
            },
            {
              step: '03',
              title: 'Strategic Consultation Scheduling',
              desc: 'Direct consultation scheduled with the designated lead partner via encrypted video or in-person.',
            },
            {
              step: '04',
              title: 'Engagement & Scope Definition',
              desc: 'Execution of our formal bilateral Engagement Letter with transparent fee structures and agreed deliverables.',
            },
            {
              step: '05',
              title: 'Strategy & Execution',
              desc: 'Aggressive trial preparation, contract architecture, or transaction closing with relentless attention to detail.',
            },
            {
              step: '06',
              title: 'Continuous Updates & Post-Closing',
              desc: 'Direct portal updates, ongoing regulatory audits, and proactive risk counseling for future horizons.',
            },
          ].map((item) => (
            <div key={item.step} className="p-8 bg-white border border-[#07182E]/10 space-y-4 relative group hover:border-[#C6A36B] transition-colors shadow-xs">
              <span className="font-serif text-3xl font-light text-[#C6A36B]">
                {item.step}
              </span>
              <h3 className="font-serif text-lg text-[#07182E] font-medium">
                {item.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-light">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 12. ATTORNEYS SECTION */}
      {/* ==================================================================== */}
      <section className="py-24 bg-[#07182E] text-white px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 border-y border-[#C6A36B]/20">
        <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto space-y-14">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <div className="text-[#C6A36B] text-xs font-semibold uppercase tracking-[0.2em] flex items-center gap-2">
                <span className="w-6 h-[1px] bg-[#C6A36B]" />
                Partners & Counsel
              </div>
              <h2 className="font-serif text-3xl sm:text-5xl font-light">
                Accomplished Minds. <br />
                <span className="italic text-[#C6A36B]">Relentless Advocates.</span>
              </h2>
            </div>
            <Link
              href="/attorneys"
              className="text-xs uppercase tracking-[0.18em] text-[#C6A36B] hover:text-white flex items-center gap-2 transition-colors"
            >
              View Complete Roster
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {attorneys.map((attorney) => (
              <div key={attorney.id} className="group bg-[#0B2340] border border-white/10 hover:border-[#C6A36B] overflow-hidden flex flex-col justify-between transition-all duration-300">
                <div className="relative aspect-[3/4] overflow-hidden bg-slate-800">
                  <img
                    src={attorney.photo_url}
                    alt={attorney.full_name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B2340] via-transparent to-transparent opacity-70" />
                </div>

                <div className="p-6 space-y-3">
                  <p className="text-[10px] uppercase tracking-widest text-[#C6A36B] font-semibold">
                    {attorney.designation}
                  </p>
                  <h3 className="font-serif text-xl text-white font-medium">
                    {attorney.full_name}
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-2 font-light">
                    {attorney.bio}
                  </p>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <Link
                      href={`/attorneys/${attorney.slug}`}
                      className="text-[11px] uppercase tracking-wider text-[#C6A36B] hover:text-white flex items-center gap-1"
                    >
                      View Profile
                      <ArrowUpRight size={13} />
                    </Link>
                    <Link
                      href={`/book-consultation?attorney=${attorney.id}`}
                      className="text-[10px] uppercase tracking-wider text-slate-400 hover:text-white"
                    >
                      Book Partner
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 13. CASE STUDIES SECTION */}
      {/* ==================================================================== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 xl:px-12 max-w-7xl 2xl:max-w-[1536px] mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="text-[#A87948] text-xs font-semibold uppercase tracking-[0.2em] flex items-center gap-2">
              <span className="w-6 h-[1px] bg-[#A87948]" />
              Proven Track Record
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#07182E]">
              Demonstrated Excellence in <br />
              <span className="italic">Consequential Matters</span>
            </h2>
          </div>
          <Link
            href="/case-studies"
            className="text-xs uppercase tracking-[0.18em] text-[#07182E] hover:text-[#C6A36B] flex items-center gap-2 font-semibold transition-colors"
          >
            Explore All Case Studies
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {caseStudies.map((study) => (
            <div
              key={study.id}
              className="bg-white border border-[#07182E]/10 p-8 flex flex-col justify-between hover:shadow-lg transition-all duration-300 hover:border-[#C6A36B]"
            >
              <div className="space-y-4">
                <span className="text-[10px] uppercase tracking-widest text-[#A87948] font-bold">
                  {study.practice_area}
                </span>
                <h3 className="font-serif text-xl text-[#07182E] leading-snug">
                  {study.title}
                </h3>
                <p className="text-xs text-slate-500 italic">
                  Client: {study.client_anonymized_title}
                </p>
                <div className="pt-2 space-y-2 text-xs text-slate-600">
                  <p>
                    <strong className="text-[#07182E]">Challenge:</strong> {study.challenge}
                  </p>
                  <p>
                    <strong className="text-[#07182E]">Outcome:</strong> {study.outcome}
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100">
                <Link
                  href={`/case-studies/${study.slug}`}
                  className="text-xs uppercase tracking-wider text-[#07182E] font-semibold hover:text-[#C6A36B] flex items-center gap-1.5"
                >
                  Read Strategy Breakdown
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 14. INSIGHTS / LEGAL JOURNAL */}
      {/* ==================================================================== */}
      <section className="py-24 bg-white px-4 sm:px-6 lg:px-8 xl:px-12 border-t border-[#07182E]/10">
        <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <div className="text-[#A87948] text-xs font-semibold uppercase tracking-[0.2em] flex items-center gap-2">
                <span className="w-6 h-[1px] bg-[#A87948]" />
                The Legal Journal
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#07182E]">
                Authoritative Perspectives on <br />
                <span className="italic">Law & Business</span>
              </h2>
            </div>
            <Link
              href="/insights"
              className="text-xs uppercase tracking-[0.18em] text-[#07182E] hover:text-[#C6A36B] flex items-center gap-2 font-semibold transition-colors"
            >
              View Journal Archive
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article key={post.id} className="group space-y-4 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 border border-[#07182E]/10">
                    <img
                      src={post.featured_image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-slate-500 uppercase tracking-wider">
                    <span className="text-[#A87948] font-bold">{post.category}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> {post.read_time}
                    </span>
                  </div>

                  <h3 className="font-serif text-lg text-[#07182E] group-hover:text-[#A87948] transition-colors leading-snug">
                    <Link href={`/insights/${post.slug}`}>{post.title}</Link>
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 font-light leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-2">
                  <Link
                    href={`/insights/${post.slug}`}
                    className="text-xs uppercase tracking-wider text-[#07182E] font-semibold hover:text-[#C6A36B] flex items-center gap-1.5"
                  >
                    Read Briefing
                    <ArrowUpRight size={13} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 15. TESTIMONIALS SECTION */}
      {/* ==================================================================== */}
      <section className="py-24 bg-[#07182E] text-white px-4 sm:px-6 lg:px-8 border-t border-[#C6A36B]/20">
        <div className="max-w-5xl mx-auto space-y-10 text-center">
          <div className="text-[#C6A36B] text-xs font-semibold uppercase tracking-[0.25em]">
            Client Endorsements & Appraisals
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {testimonials.map((t) => (
              <div key={t.id} className="p-8 bg-[#0B2340] border border-white/10 space-y-5 flex flex-col justify-between">
                <p className="font-serif text-base italic text-slate-200 leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="pt-4 border-t border-white/10 space-y-1">
                  <p className="font-serif text-sm text-white font-medium">{t.client_name}</p>
                  <p className="text-xs text-[#C6A36B] font-light">{t.client_title_org}</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider">{t.practice_area}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 16. SEARCHABLE FAQ SECTION */}
      {/* ==================================================================== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-10">
        <div className="text-center space-y-3">
          <div className="text-[#A87948] text-xs font-semibold uppercase tracking-[0.2em]">
            Clear Answers
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#07182E]">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-light">
            Answers regarding our conflict screening, consultation booking, retainers, and confidentiality.
          </p>
        </div>

        {/* Search input */}
        <div className="relative max-w-md mx-auto">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search questions by keyword..."
            value={faqSearch}
            onChange={(e) => setFaqSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-[#07182E]/20 text-xs text-[#07182E] placeholder:text-slate-400 focus:outline-none focus:border-[#C6A36B]"
          />
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {filteredFaqs.map((faq) => {
            const isOpen = openFaq === faq.id;
            return (
              <div key={faq.id} className="bg-white border border-[#07182E]/10 overflow-hidden shadow-xs">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                >
                  <span className="font-serif text-base text-[#07182E] font-medium">
                    {faq.question}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`text-[#A87948] transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {isOpen && (
                  <div className="p-5 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 17. INTERACTIVE INTAKE & CONFLICT CHECK FORM */}
      {/* ==================================================================== */}
      <section id="contact" className="py-24 bg-[#07182E] text-white px-4 sm:px-6 lg:px-8 xl:px-12 border-t border-[#C6A36B]/20">
        <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 space-y-6">
            <div className="text-[#C6A36B] text-xs font-semibold uppercase tracking-[0.2em] flex items-center gap-2">
              <span className="w-6 h-[1px] bg-[#C6A36B]" />
              Confidential Intake
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-light leading-tight">
              Your Legal Matters Deserve the <br />
              <span className="italic text-[#C6A36B]">Right Expertise.</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
              Initiate an exploratory conversation with our senior counsel. Every submission is treated with the highest degree of discretion and screened for adverse representation before advice is issued.
            </p>

            <div className="p-5 bg-[#0B2340] border border-[#C6A36B]/30 space-y-3">
              <div className="flex items-center gap-2 text-xs text-[#C6A36B] font-semibold uppercase tracking-wider">
                <Lock size={14} />
                Strict Conflict Notice
              </div>
              <p className="text-xs text-slate-300 font-light leading-relaxed">
                Submitting an inquiry does not form an attorney-client relationship. Please refrain from submitting confidential proprietary secrets until formal clearance is confirmed.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 bg-[#0B2340] border border-[#C6A36B]/40 p-8 sm:p-10 shadow-2xl">
            {submittedReference ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-16 h-16 bg-[#C6A36B]/20 border border-[#C6A36B] text-[#C6A36B] mx-auto flex items-center justify-center rounded-full">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="font-serif text-2xl text-white">Inquiry Received</h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                  {formSuccessMessage}
                </p>
                <div className="p-4 bg-[#07182E] border border-white/10 max-w-xs mx-auto">
                  <p className="text-[10px] uppercase tracking-wider text-slate-400">Your Reference Number</p>
                  <p className="font-mono text-base text-[#C6A36B] font-bold mt-1">{submittedReference}</p>
                </div>
                <div className="pt-4">
                  <button
                    onClick={() => setSubmittedReference(null)}
                    className="text-xs uppercase tracking-wider text-[#C6A36B] hover:underline"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleEnquirySubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-slate-300 font-medium">First Name *</label>
                    <input
                      name="firstName"
                      required
                      placeholder="e.g. Arthur"
                      className="w-full px-4 py-3 bg-[#07182E] border border-white/20 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#C6A36B]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-slate-300 font-medium">Last Name *</label>
                    <input
                      name="lastName"
                      required
                      placeholder="e.g. Sterling"
                      className="w-full px-4 py-3 bg-[#07182E] border border-white/20 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#C6A36B]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-slate-300 font-medium">Email Address *</label>
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="e.g. name@company.com"
                      className="w-full px-4 py-3 bg-[#07182E] border border-white/20 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#C6A36B]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-slate-300 font-medium">Phone Number</label>
                    <input
                      name="phone"
                      placeholder="e.g. +44 20 7946 0000"
                      className="w-full px-4 py-3 bg-[#07182E] border border-white/20 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#C6A36B]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-slate-300 font-medium">Practice Area *</label>
                    <select
                      name="practiceArea"
                      required
                      className="w-full px-4 py-3 bg-[#07182E] border border-white/20 text-xs text-white focus:outline-none focus:border-[#C6A36B]"
                    >
                      {practiceAreas.map((p) => (
                        <option key={p.id} value={p.title} className="bg-[#07182E]">
                          {p.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-slate-300 font-medium">Preferred Contact</label>
                    <select
                      name="preferredContactMethod"
                      className="w-full px-4 py-3 bg-[#07182E] border border-white/20 text-xs text-white focus:outline-none focus:border-[#C6A36B]"
                    >
                      <option value="email">Direct Email</option>
                      <option value="phone">Telephone Call</option>
                      <option value="portal">Client Portal</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-slate-300 font-medium">
                    Matter Summary (Non-Confidential) *
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    placeholder="Briefly describe the commercial context, transactions, or dispute..."
                    className="w-full px-4 py-3 bg-[#07182E] border border-white/20 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#C6A36B]"
                  />
                </div>

                {formError && (
                  <p className="text-xs text-red-400 bg-red-950/40 border border-red-800 p-3">
                    {formError}
                  </p>
                )}

                <div className="flex items-start gap-3">
                  <input type="checkbox" required id="consent" className="mt-1" />
                  <label htmlFor="consent" className="text-xs text-slate-400 leading-normal">
                    I acknowledge that transmitting this inquiry does not establish an attorney-client relationship, and that I have read the privacy and conflict check notice.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-[#C6A36B] text-[#07182E] text-xs uppercase tracking-[0.18em] font-bold hover:bg-[#d5b682] transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Running Conflict Check & Transmitting...' : 'Submit Inquiry for Conflict Review'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Floating Bottom Action HUD for Mobile & Tablet */}
      <FloatingActionHUD />

      {/* Footer */}
      <Footer />
    </div>
  );
}
