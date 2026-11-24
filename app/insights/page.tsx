'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { db } from '@/lib/db/database';
import { Search, Clock, ArrowUpRight, ArrowRight } from 'lucide-react';

export default function InsightsPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const blogPosts = db.getAllBlogPosts();

  const categories = ['All', 'Briefing', 'Perspective', 'Guide'];

  const filtered = blogPosts.filter((post) => {
    const matchesCat = selectedCategory === 'All' || post.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      post.author_name.toLowerCase().includes(search.toLowerCase()) ||
      post.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F8F5EF] text-[#202936] font-sans antialiased">
      <Navbar />

      <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="max-w-3xl space-y-4 mb-14">
          <div className="text-[#A87948] text-xs font-semibold uppercase tracking-[0.25em] flex items-center gap-2">
            <span className="w-6 h-[1px] bg-[#A87948]" />
            The Legal Journal / Briefings
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl text-[#07182E] font-normal leading-[1.1]">
            Authoritative Ideas for the <br />
            <span className="italic text-[#A87948]">Decisions Ahead.</span>
          </h1>
          <p className="text-base text-slate-600 font-light leading-relaxed">
            Forensic analysis, regulatory updates, and strategic briefings authored by our senior partners across corporate law, artificial intelligence copyright, and international arbitration.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            {/* Search */}
            <div className="relative w-full max-w-md">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search briefings by keyword or author..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border border-[#07182E]/20 text-xs text-[#07182E] placeholder:text-slate-400 focus:outline-none focus:border-[#C6A36B]"
              />
            </div>

            {/* Category tabs */}
            <div className="flex items-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-2.5 text-xs uppercase tracking-wider font-semibold transition-colors ${
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
        </div>

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((post) => (
            <article
              key={post.id}
              className="bg-white border border-[#07182E]/10 hover:border-[#C6A36B] flex flex-col justify-between hover:shadow-xl transition-all duration-300 group"
            >
              <div>
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                  <img
                    src={post.featured_image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="text-[10px] uppercase tracking-widest text-[#07182E] font-bold bg-[#C6A36B] px-2.5 py-1">
                      {post.category}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> {post.read_time}
                    </span>
                    <span>{new Date(post.published_at).toLocaleDateString()}</span>
                  </div>

                  <h2 className="font-serif text-xl text-[#07182E] group-hover:text-[#A87948] transition-colors leading-snug">
                    <Link href={`/insights/${post.slug}`}>{post.title}</Link>
                  </h2>

                  <p className="text-xs text-slate-600 line-clamp-3 font-light leading-relaxed">
                    {post.excerpt}
                  </p>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-serif font-medium text-[#07182E]">{post.author_name}</p>
                      <p className="text-[10px] text-slate-400">{post.author_title}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 mt-2">
                <Link
                  href={`/insights/${post.slug}`}
                  className="text-xs uppercase tracking-wider text-[#07182E] font-semibold hover:text-[#C6A36B] flex items-center gap-1.5"
                >
                  Read Analysis
                  <ArrowUpRight size={13} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
