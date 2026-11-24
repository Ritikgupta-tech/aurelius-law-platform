'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { db } from '@/lib/db/database';
import { Search, ChevronDown, ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function FAQPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [openFaq, setOpenFaq] = useState<string | null>('faq-1');

  const faqs = db.getFAQs();
  const categories = ['All', 'General', 'Consultations', 'Fees & Retainers', 'Confidentiality', 'Corporate'];

  const filtered = faqs.filter((faq) => {
    const matchesCat = selectedCategory === 'All' || faq.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      faq.question.toLowerCase().includes(search.toLowerCase()) ||
      faq.answer.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F8F5EF] text-[#202936] font-sans antialiased">
      <Navbar />

      <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="text-center space-y-4 mb-14">
          <div className="text-[#A87948] text-xs font-semibold uppercase tracking-[0.25em]">
            Information & Policy
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl text-[#07182E] font-normal leading-[1.1]">
            Frequently Asked Questions
          </h1>
          <p className="text-sm text-slate-600 max-w-xl mx-auto font-light leading-relaxed">
            Detailed guidance regarding our conflict screening protocols, billing practices, consultation procedures, and confidentiality commitments.
          </p>

          <div className="pt-4 max-w-md mx-auto">
            <div className="relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search questions by keyword..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border border-[#07182E]/20 text-xs text-[#07182E] placeholder:text-slate-400 focus:outline-none focus:border-[#C6A36B]"
              />
            </div>
          </div>

          <div className="pt-4 flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 text-xs uppercase tracking-wider font-semibold transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#07182E] text-[#C6A36B]'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-[#C6A36B]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="space-y-4">
          {filtered.map((faq) => {
            const isOpen = openFaq === faq.id;
            return (
              <div key={faq.id} className="bg-white border border-[#07182E]/10 overflow-hidden shadow-sm">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-wider text-[#A87948] font-bold">
                      {faq.category}
                    </span>
                    <h3 className="font-serif text-lg text-[#07182E] font-medium">{faq.question}</h3>
                  </div>
                  <ChevronDown
                    size={18}
                    className={`text-[#A87948] transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {isOpen && (
                  <div className="p-6 pt-0 text-xs sm:text-sm text-slate-700 leading-relaxed border-t border-slate-100 font-light">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="mt-16 p-8 bg-[#07182E] text-white flex flex-col sm:flex-row items-center justify-between gap-6 border border-[#C6A36B]/30">
          <div className="space-y-1">
            <h4 className="font-serif text-xl text-white">Have a Specific Unanswered Question?</h4>
            <p className="text-xs text-slate-300 font-light">
              Our intake counsel is available for direct confidential inquiries.
            </p>
          </div>
          <Link
            href="/contact"
            className="px-6 py-3 bg-[#C6A36B] text-[#07182E] text-xs uppercase tracking-widest font-bold hover:bg-[#d5b682] transition-colors shrink-0"
          >
            Contact Chambers
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
