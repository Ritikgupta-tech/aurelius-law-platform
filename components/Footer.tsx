import Link from 'next/link';
import { Scale, Mail, Phone, MapPin, ArrowUpRight, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#041225] text-slate-300 border-t border-[#C6A36B]/20 pt-16 pb-12 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-14 border-b border-white/10">
          {/* Col 1: Brand & Positioning */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 border border-[#C6A36B] text-[#C6A36B] flex items-center justify-center rotate-45">
                <Scale size={16} className="-rotate-45" strokeWidth={1.5} />
              </div>
              <span className="font-serif text-2xl tracking-wide text-white font-medium">
                Aurelius <i className="text-[#C6A36B] not-italic">&</i> Co.
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Independent international counsel for consequential moments. Advising sovereign entities, multinational corporations, and visionary founders on high-stakes transactions, cross-border disputes, and intellectual property.
            </p>
            <div className="pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-[#C6A36B]/30 bg-[#07182E] text-xs text-[#C6A36B]">
                <ShieldCheck size={14} />
                Regulated International Legal Practice
              </div>
            </div>
          </div>

          {/* Col 2: Practice Areas */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C6A36B] mb-4">
              Key Capabilities
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/practice-areas/corporate-commercial" className="hover:text-white transition-colors">
                  Corporate & Commercial
                </Link>
              </li>
              <li>
                <Link href="/practice-areas/business-formation" className="hover:text-white transition-colors">
                  Business Formation & Incorporation
                </Link>
              </li>
              <li>
                <Link href="/practice-areas/contract-drafting-review" className="hover:text-white transition-colors">
                  Contract Drafting & Review
                </Link>
              </li>
              <li>
                <Link href="/practice-areas/civil-litigation" className="hover:text-white transition-colors">
                  Civil Litigation & Trials
                </Link>
              </li>
              <li>
                <Link href="/practice-areas/intellectual-property" className="hover:text-white transition-colors">
                  Intellectual Property & Patents
                </Link>
              </li>
              <li>
                <Link href="/practice-areas/dispute-resolution" className="hover:text-white transition-colors">
                  International Arbitration
                </Link>
              </li>
              <li>
                <Link href="/practice-areas" className="text-[#C6A36B] hover:underline flex items-center gap-1 pt-1">
                  View All 15 Practices <ArrowUpRight size={11} />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Navigation */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C6A36B] mb-4">
              The Firm
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About the Firm
                </Link>
              </li>
              <li>
                <Link href="/attorneys" className="hover:text-white transition-colors">
                  Partners & Counsel
                </Link>
              </li>
              <li>
                <Link href="/case-studies" className="hover:text-white transition-colors">
                  Case Studies & Track Record
                </Link>
              </li>
              <li>
                <Link href="/insights" className="hover:text-white transition-colors">
                  Legal Journal & Briefings
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/portal" className="hover:text-white transition-colors">
                  Secure Client Portal
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-slate-500 hover:text-slate-300 transition-colors">
                  Staff Workspace
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Offices & Contact */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C6A36B] mb-4">
              Headquarters
            </h4>
            <div className="space-y-3.5 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin size={15} className="text-[#C6A36B] shrink-0 mt-0.5" />
                <span>
                  <strong>London:</strong> 250 Bishopsgate, London EC2M 4AA, United Kingdom
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin size={15} className="text-[#C6A36B] shrink-0 mt-0.5" />
                <span>
                  <strong>New York:</strong> 767 Fifth Avenue, New York, NY 10153, USA
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone size={14} className="text-[#C6A36B] shrink-0" />
                <span>+44 20 7946 0912</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={14} className="text-[#C6A36B] shrink-0" />
                <span>inquiries@aureliuslaw.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Disclaimers & Legal Links */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>
            © {new Date().getFullYear()} Aurelius & Co. All rights reserved. Submitting an enquiry does not form an attorney-client relationship.
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/privacy-policy" className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-slate-300 transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/disclaimer" className="hover:text-slate-300 transition-colors">
              Legal Disclaimer
            </Link>
            <Link href="/cookie-policy" className="hover:text-slate-300 transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
