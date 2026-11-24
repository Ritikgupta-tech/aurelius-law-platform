import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-[#F8F5EF] text-[#202936] font-sans antialiased">
      <Navbar />

      <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
        <div className="space-y-3 border-b border-slate-200 pb-6">
          <span className="text-[10px] uppercase tracking-widest text-[#A87948] font-bold">Privacy & Cookies</span>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#07182E]">Cookie Policy</h1>
          <p className="text-xs text-slate-500">Technical Information Regarding Website Storage</p>
        </div>

        <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-700 leading-relaxed font-light space-y-6">
          <h2 className="font-serif text-xl text-[#07182E]">1. Essential Cookies Only</h2>
          <p>
            Aurelius & Co. operates a privacy-centric website. We do not utilize third-party behavioral advertising cookies, invasive tracking pixels, or cross-site data brokers.
          </p>

          <h2 className="font-serif text-xl text-[#07182E]">2. Strictly Necessary Security Cookies</h2>
          <p>
            We utilize strictly necessary cookies and local storage tokens solely to maintain secure client portal sessions, preserve anti-CSRF authentication tokens, and preserve appointment booking steps during multi-stage form completion.
          </p>

          <h2 className="font-serif text-xl text-[#07182E]">3. Managing Cookies</h2>
          <p>
            You may configure your browser settings to decline or delete cookies at any time. However, declining essential cookies may affect your ability to log in to the Client Portal or reserve consultations.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
