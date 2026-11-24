import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { db } from '@/lib/db/database';
import { Clock, ArrowRight, ArrowUpRight, Share2, ShieldCheck } from 'lucide-react';

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  const posts = db.getAllBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export default function ArticleDetailPage({ params }: Props) {
  const post = db.getBlogPostBySlug(params.slug);
  if (!post) {
    notFound();
  }

  const related = db.getBlogPosts().filter((p) => p.id !== post.id).slice(0, 2);

  return (
    <div className="min-h-screen bg-[#F8F5EF] text-[#202936] font-sans antialiased">
      <Navbar />

      <main className="pt-28 pb-24">
        {/* Article Header */}
        <section className="bg-[#07182E] text-white py-20 px-4 sm:px-6 lg:px-8 border-b border-[#C6A36B]/20">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-2 text-xs text-[#C6A36B] uppercase tracking-[0.2em]">
              <Link href="/insights" className="hover:underline">Legal Journal</Link>
              <span>/</span>
              <span>{post.category}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl text-white font-normal leading-tight">
              {post.title}
            </h1>

            <p className="text-base text-slate-300 font-light leading-relaxed">
              {post.excerpt}
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-white/10">
              <div className="flex items-center gap-3">
                <div>
                  <p className="font-serif text-sm text-white font-medium">{post.author_name}</p>
                  <p className="text-xs text-[#C6A36B]">{post.author_title}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock size={13} /> {post.read_time}
                </span>
                <span>{new Date(post.published_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Article Body */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <div className="bg-white border border-[#07182E]/10 p-8 sm:p-14 shadow-lg space-y-8">
            <div className="prose prose-slate max-w-none text-slate-800 leading-relaxed font-light text-base space-y-6">
              {post.content.split('\n\n').map((paragraph, idx) => {
                if (paragraph.startsWith('### ')) {
                  return (
                    <h3 key={idx} className="font-serif text-2xl text-[#07182E] pt-4 border-b border-slate-100 pb-2">
                      {paragraph.replace('### ', '')}
                    </h3>
                  );
                }
                return (
                  <p key={idx} className="text-sm sm:text-base text-slate-700 leading-relaxed font-light">
                    {paragraph}
                  </p>
                );
              })}
            </div>

            {/* Tags */}
            <div className="pt-8 border-t border-slate-100 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs rounded-sm">
                  #{tag}
                </span>
              ))}
            </div>

            {/* Consultation CTA Banner */}
            <div className="p-6 bg-[#07182E] text-white border border-[#C6A36B]/40 space-y-3">
              <ShieldCheck size={20} className="text-[#C6A36B]" />
              <h4 className="font-serif text-lg text-white">Require Advisory on This Subject?</h4>
              <p className="text-xs text-slate-300 font-light leading-relaxed">
                Connect directly with author {post.author_name} and our specialist partners to structure your legal response.
              </p>
              <div className="pt-2">
                <Link
                  href="/book-consultation"
                  className="px-6 py-2.5 bg-[#C6A36B] text-[#07182E] text-xs uppercase tracking-widest font-bold hover:bg-[#d5b682] transition-colors inline-block"
                >
                  Schedule Partner Consultation
                </Link>
              </div>
            </div>
          </div>

          {/* Related Articles */}
          {related.length > 0 && (
            <div className="mt-16 space-y-6">
              <h3 className="font-serif text-2xl text-[#07182E]">Related Briefings</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {related.map((rel) => (
                  <div key={rel.id} className="bg-white border border-slate-200 p-6 space-y-3">
                    <span className="text-[10px] uppercase tracking-wider text-[#A87948] font-bold">
                      {rel.category}
                    </span>
                    <h4 className="font-serif text-base text-[#07182E] hover:text-[#A87948]">
                      <Link href={`/insights/${rel.slug}`}>{rel.title}</Link>
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2">{rel.excerpt}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
