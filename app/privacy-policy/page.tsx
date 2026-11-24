import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#F8F5EF] text-[#202936] font-sans antialiased">
      <Navbar />

      <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
        <div className="space-y-3 border-b border-slate-200 pb-6">
          <span className="text-[10px] uppercase tracking-widest text-[#A87948] font-bold">Regulatory Compliance</span>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#07182E]">Privacy Policy & Data Protection</h1>
          <p className="text-xs text-slate-500">Effective Date: November 24, 2026 · Compliant with GDPR, UK DPA, and DPDP Principles</p>
        </div>

        <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-700 leading-relaxed font-light space-y-6">
          <h2 className="font-serif text-xl text-[#07182E]">1. Overview & Commitment to Confidentiality</h2>
          <p>
            Aurelius & Co. (&ldquo;the Firm&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;) treats the privacy and confidentiality of our clients, prospective clients, and website visitors with the utmost gravity. As a regulated international legal practice, our handling of information is governed by rigorous statutory data protection regimes as well as the strict tenets of legal professional privilege and attorney-client confidentiality.
          </p>

          <h2 className="font-serif text-xl text-[#07182E]">2. Data Collected & Conflict Screening Intake</h2>
          <p>
            When you submit an inquiry or schedule a consultation, we collect identifying details including your name, corporate affiliation, contact coordinates (email and telephone), and non-confidential matter summaries. This information is processed primarily to execute conflict-of-interest screening prior to accepting formal representation.
          </p>

          <h2 className="font-serif text-xl text-[#07182E]">3. Legal Basis for Processing</h2>
          <p>
            We process your personal data under the following lawful bases:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Legitimate Interests:</strong> To evaluate prospective legal matters, verify identity, and prevent professional conflicts of interest.</li>
            <li><strong>Contractual Necessity:</strong> To take preliminary steps at your request prior to executing a formal Engagement Letter.</li>
            <li><strong>Legal Compliance:</strong> To satisfy statutory anti-money laundering (AML), Know Your Customer (KYC), and bar regulatory mandates.</li>
          </ul>

          <h2 className="font-serif text-xl text-[#07182E]">4. Data Retention & Cryptographic Security</h2>
          <p>
            All submitted matter documentation is stored in AES-256 encrypted vaults. Non-retained inquiry data from declined matters is securely expunged following conflict logs archival in compliance with professional record-keeping standards.
          </p>

          <h2 className="font-serif text-xl text-[#07182E]">5. Your Rights</h2>
          <p>
            Under applicable data protection laws, you possess the right to request access to, rectification of, or erasure of your personal data, subject to our statutory duties to preserve matter records for regulatory and conflict-checking verification.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
