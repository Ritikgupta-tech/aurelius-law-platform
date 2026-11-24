import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Scale,
  ShieldCheck,
  Award,
  Globe2,
  Users,
  Building2,
  ArrowRight,
  ArrowUpRight,
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F8F5EF] text-[#202936] font-sans antialiased">
      <Navbar />

      <main className="pt-28 pb-24">
        {/* Hero */}
        <section className="bg-[#07182E] text-white py-20 px-4 sm:px-6 lg:px-8 border-b border-[#C6A36B]/20">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-[#C6A36B] text-xs font-semibold uppercase tracking-[0.25em] flex items-center gap-2">
              <span className="w-6 h-[1px] bg-[#C6A36B]" />
              The Firm / Institutional Profile
            </div>
            <h1 className="font-serif text-4xl sm:text-6xl text-white font-normal leading-tight">
              A Clear Point of View <br />
              <span className="italic text-[#C6A36B]">in a Complicated World.</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed">
              Aurelius & Co. is an independent international law firm built to counsel corporations, sovereign institutions, and high-net-worth families through consequential moments that define their future.
            </p>
          </div>
        </section>

        {/* Narrative & Pillars */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-4">
              <div className="text-[#A87948] text-xs font-semibold uppercase tracking-[0.2em]">Our Heritage</div>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#07182E]">
                Intellectual Rigor. <br />
                <span className="italic">Uncompromising Standards.</span>
              </h2>
            </div>
            <div className="lg:col-span-7 space-y-4 text-slate-700 leading-relaxed font-light text-base">
              <p>
                Established with chambers in London, New York, and Geneva, Aurelius & Co. operates across international legal frontiers. We reject the fragmented bureaucracy of sprawling mega-firms, choosing instead an agile partnership model where our most experienced practitioners lead every mandate directly.
              </p>
              <p>
                Whether structuring multi-billion dollar cross-border acquisitions, prevailing in high-stakes ICC arbitrations, or preserving multi-generational family legacies, our advice is designed to endure under judicial scrutiny and market volatility.
              </p>
            </div>
          </div>

          {/* 4 Values Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
            {[
              {
                title: 'Independent Counsel',
                desc: 'Free from institutional conflicts. Our advice is singularly aligned with our clients long-term preservation and prosperity.',
                icon: ShieldCheck,
              },
              {
                title: 'Forensic Precision',
                desc: 'We care about the nuanced detail because in high-value transactions and trials, victory resides in the detail.',
                icon: Scale,
              },
              {
                title: 'Partner Immersion',
                desc: 'Direct partner accessibility without delegation layers, ensuring strategic continuity from inception to resolution.',
                icon: Users,
              },
              {
                title: 'International Reach',
                desc: 'Deep multi-jurisdictional mastery across common law and civil law frameworks throughout the UK, US, Europe, and Asia.',
                icon: Globe2,
              },
            ].map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="p-6 bg-white border border-[#07182E]/10 space-y-3 shadow-sm hover:border-[#C6A36B] transition-colors">
                  <Icon size={24} className="text-[#A87948]" />
                  <h3 className="font-serif text-lg text-[#07182E]">{v.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-light">{v.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Institutional CTA */}
          <div className="p-10 bg-[#07182E] text-white flex flex-col md:flex-row items-center justify-between gap-6 border border-[#C6A36B]/30">
            <div className="space-y-2">
              <h3 className="font-serif text-2xl text-white">Meet the Partners Leading Our Practice</h3>
              <p className="text-xs text-slate-300 font-light max-w-xl">
                Explore biographies, representative matters, and bar admissions for our senior partners.
              </p>
            </div>
            <Link
              href="/attorneys"
              className="px-8 py-3.5 bg-[#C6A36B] text-[#07182E] text-xs uppercase tracking-widest font-semibold hover:bg-[#d5b682] transition-colors shrink-0"
            >
              View Our Attorneys
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
