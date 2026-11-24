'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, X, Building2, User, BookOpen, ArrowRight, Scale, BriefcaseBusiness } from 'lucide-react';
import { db } from '@/lib/db/database';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const practiceAreas = db.getPracticeAreas();
  const attorneys = db.getAttorneys();
  const articles = db.getBlogPosts();
  const caseStudies = db.getCaseStudies();

  const filteredPractices = practiceAreas.filter(
    (p) =>
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.short_description.toLowerCase().includes(query.toLowerCase())
  );

  const filteredAttorneys = attorneys.filter(
    (a) =>
      a.full_name.toLowerCase().includes(query.toLowerCase()) ||
      a.designation.toLowerCase().includes(query.toLowerCase())
  );

  const filteredArticles = articles.filter(
    (art) =>
      art.title.toLowerCase().includes(query.toLowerCase()) ||
      art.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-[#041225]/80 backdrop-blur-md flex items-start justify-center pt-20 px-4 sm:px-6">
      <div className="bg-[#07182E] border border-[#C6A36B]/40 max-w-2xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-white/10 flex items-center gap-3">
          <Search size={18} className="text-[#C6A36B] shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="Search practices, partners, articles, case studies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent border-none text-white text-sm placeholder:text-slate-500 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white transition-colors"
            title="Close Search"
          >
            <X size={18} />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-6 text-xs divide-y divide-white/5">
          {/* Practice Areas */}
          {filteredPractices.length > 0 && (
            <div className="space-y-2 pt-2 first:pt-0">
              <span className="text-[10px] uppercase tracking-widest text-[#C6A36B] font-bold block">
                Practice Disciplines ({filteredPractices.length})
              </span>
              <div className="space-y-1">
                {filteredPractices.slice(0, 4).map((p) => (
                  <Link
                    key={p.id}
                    href={`/practice-areas/${p.slug}`}
                    onClick={onClose}
                    className="p-2.5 rounded-xs hover:bg-[#0B2340] flex items-center justify-between text-slate-200 hover:text-white transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Building2 size={14} className="text-[#A87948] group-hover:text-[#C6A36B]" />
                      <span className="font-medium">{p.title}</span>
                    </div>
                    <ArrowRight size={12} className="text-slate-500 group-hover:text-[#C6A36B]" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Attorneys */}
          {filteredAttorneys.length > 0 && (
            <div className="space-y-2 pt-3">
              <span className="text-[10px] uppercase tracking-widest text-[#C6A36B] font-bold block">
                Partners & Counsel ({filteredAttorneys.length})
              </span>
              <div className="space-y-1">
                {filteredAttorneys.slice(0, 3).map((a) => (
                  <Link
                    key={a.id}
                    href={`/attorneys/${a.slug}`}
                    onClick={onClose}
                    className="p-2.5 rounded-xs hover:bg-[#0B2340] flex items-center justify-between text-slate-200 hover:text-white transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <User size={14} className="text-[#A87948] group-hover:text-[#C6A36B]" />
                      <span>
                        <strong className="text-white">{a.full_name}</strong> ·{' '}
                        <span className="text-slate-400">{a.designation}</span>
                      </span>
                    </div>
                    <ArrowRight size={12} className="text-slate-500 group-hover:text-[#C6A36B]" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Articles */}
          {filteredArticles.length > 0 && (
            <div className="space-y-2 pt-3">
              <span className="text-[10px] uppercase tracking-widest text-[#C6A36B] font-bold block">
                Journal Briefings ({filteredArticles.length})
              </span>
              <div className="space-y-1">
                {filteredArticles.slice(0, 3).map((art) => (
                  <Link
                    key={art.id}
                    href={`/insights/${art.slug}`}
                    onClick={onClose}
                    className="p-2.5 rounded-xs hover:bg-[#0B2340] flex items-center justify-between text-slate-200 hover:text-white transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <BookOpen size={14} className="text-[#A87948] group-hover:text-[#C6A36B]" />
                      <span className="truncate max-w-md">{art.title}</span>
                    </div>
                    <ArrowRight size={12} className="text-slate-500 group-hover:text-[#C6A36B]" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {filteredPractices.length === 0 &&
            filteredAttorneys.length === 0 &&
            filteredArticles.length === 0 && (
              <div className="py-8 text-center text-slate-400">
                <p>No matching legal resources located for &ldquo;{query}&rdquo;.</p>
              </div>
            )}
        </div>

        {/* Footer Shortcut Guide */}
        <div className="p-3 bg-[#041225] border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400">
          <span>Search across 15 practice areas, attorneys, and case studies</span>
          <span>Press ESC to close</span>
        </div>
      </div>
    </div>
  );
}
