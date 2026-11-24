import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F8F5EF] text-[#202936] font-sans antialiased">
      <Navbar />

      <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
        <div className="space-y-3 border-b border-slate-200 pb-6">
          <span className="text-[10px] uppercase tracking-widest text-[#A87948] font-bold">Terms of Use</span>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#07182E]">Terms and Conditions of Engagement</h1>
          <p className="text-xs text-slate-500">Last Revised: November 2026</p>
        </div>

        <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-700 leading-relaxed font-light space-y-6">
          <h2 className="font-serif text-xl text-[#07182E]">1. Acceptance of Terms</h2>
          <p>
            By accessing or navigating the website of Aurelius & Co. or utilizing our electronic consultation reservation system, you agree to be bound by these Terms and Conditions and our Privacy Policy.
          </p>

          <h2 className="font-serif text-xl text-[#07182E]">2. No Attorney-Client Relationship</h2>
          <p>
            Utilization of this website, transmission of non-confidential inquiries, or reservation of an exploratory appointment does NOT establish an attorney-client relationship. An attorney-client relationship is formalized solely upon:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>The successful completion and clearance of our conflict-of-interest check; and</li>
            <li>The mutual execution of a bilateral, written Engagement Letter signed by a partner of Aurelius & Co.</li>
          </ul>

          <h2 className="font-serif text-xl text-[#07182E]">3. Consultation Booking & Cancellations</h2>
          <p>
            Consultation reservations are subject to partner availability and formal verification. The firm reserves the unilateral right to cancel, reschedule, or decline any appointment in the event of unforeseen trial appearances, regulatory conflicts, or failure to clear conflict screening.
          </p>

          <h2 className="font-serif text-xl text-[#07182E]">4. Intellectual Property</h2>
          <p>
            All briefings, articles, analyses, trademarks, and graphic compositions published on this website are the proprietary intellectual property of Aurelius & Co. and may not be reproduced without prior written authorization.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
