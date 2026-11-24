import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-[#F8F5EF] text-[#202936] font-sans antialiased">
      <Navbar />

      <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
        <div className="space-y-3 border-b border-slate-200 pb-6">
          <span className="text-[10px] uppercase tracking-widest text-[#A87948] font-bold">Statutory Notice</span>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#07182E]">Legal Disclaimer</h1>
          <p className="text-xs text-slate-500">Notice to Visitors and Prospective Clients</p>
        </div>

        <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-700 leading-relaxed font-light space-y-6">
          <h2 className="font-serif text-xl text-[#07182E]">1. Not Legal Advice</h2>
          <p>
            The content, briefings, case studies, and informational materials presented on this website are published solely for general educational and informational purposes. They do not constitute formal legal advice, tax advice, or regulatory counsel, and must not be relied upon as such.
          </p>

          <h2 className="font-serif text-xl text-[#07182E]">2. Jurisdictional Nuances</h2>
          <p>
            Laws, regulatory ordinances, and judicial interpretations evolve continuously and differ substantially across jurisdictions. You should not act or refrain from acting upon any information contained on this website without seeking bespoke legal counsel licensed in the relevant jurisdiction.
          </p>

          <h2 className="font-serif text-xl text-[#07182E]">3. Prior Results Do Not Guarantee Future Outcomes</h2>
          <p>
            Any case studies, summaries of transactions, or trial representations mentioned on this website reflect past matters under specific legal and factual circumstances. Prior results do not guarantee, warrant, or predict a similar outcome in any current or future matter.
          </p>

          <h2 className="font-serif text-xl text-[#07182E]">4. Advertising Notice</h2>
          <p>
            In certain jurisdictions, portions of this website may be deemed attorney advertising under applicable bar association disciplinary rules.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
