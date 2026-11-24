'use client';

import { useState } from 'react';
import { Check, X, Shield, Award, Users, Scale, FileText } from 'lucide-react';

interface ComparisonRow {
  dimension: string;
  traditionalMegaFirm: string;
  aureliusStandard: string;
  note: string;
}

const comparisonMatrix: ComparisonRow[] = [
  {
    dimension: 'Partner Immersion',
    traditionalMegaFirm: 'Pitched by partners; matters delegated down to 1st & 2nd-year junior associates.',
    aureliusStandard: '100% Direct Partner execution from initial conflict clearance through trial or closing.',
    note: 'Direct access to senior advocates who have tried cases and closed cross-border mergers.',
  },
  {
    dimension: 'Conflict of Interest Screening',
    traditionalMegaFirm: 'Often checked post-onboarding; conflicts uncovered after sensitive disclosures.',
    aureliusStandard: 'Automated cryptographic pre-consultation adversarial checks before any disclosures.',
    note: 'Strict firewall prevents any conflict or breach of ethical fiduciary duty.',
  },
  {
    dimension: 'Billing & Fee Transparency',
    traditionalMegaFirm: 'Open-ended hourly billing with unpredictable junior staffing line-item inflation.',
    aureliusStandard: 'Transparent milestone retainers, phased scopes, and unambiguous fee schedules.',
    note: 'Every phase is documented and approved in advance with zero hidden administrative fees.',
  },
  {
    dimension: 'Client Telemetry & Document Vault',
    traditionalMegaFirm: 'Paper binders, slow secretary phone-tag, and unsecured email attachments.',
    aureliusStandard: '24/7 Encrypted Client Portal, real-time matter tracking, and live appointment booking.',
    note: 'Direct client control over transcripts, filings, and upcoming court schedules.',
  },
  {
    dimension: 'Multi-Jurisdictional Cross-Border Scope',
    traditionalMegaFirm: 'Disjointed referral networks where external counsel bill separately with no coordination.',
    aureliusStandard: 'Unified practice across London, New York, Zurich, and Singapore with coordinated counsel.',
    note: 'Seamless strategy across common law, civil law, and international arbitration tribunals.',
  },
];

export default function FirmComparison() {
  const [activeRow, setActiveRow] = useState<number | null>(null);

  return (
    <section className="py-24 bg-[#F8F5EF] text-[#202936] px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="space-y-12">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="text-[#A87948] text-xs font-semibold uppercase tracking-[0.25em] flex items-center justify-center gap-2">
            <span className="w-6 h-[1px] bg-[#A87948]" />
            The Aurelius Standard
            <span className="w-6 h-[1px] bg-[#A87948]" />
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#07182E] font-normal leading-tight">
            How We Differ From <br />
            <span className="italic font-light">Conventional Mega-Firms</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-light max-w-xl mx-auto leading-relaxed">
            We deliberately built a boutique powerhouse designed for high-consequence matters where bureaucratic overhead and junior delegation are unacceptable liabilities.
          </p>
        </div>

        {/* Comparison Table for Tablet/Desktop & Cards for Mobile */}
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-hidden border border-[#07182E]/15 bg-white shadow-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#07182E]/15">
                <th className="py-5 px-6 text-xs uppercase tracking-wider text-slate-500 font-semibold w-1/4 bg-slate-50">
                  Operational Dimension
                </th>
                <th className="py-5 px-6 text-xs uppercase tracking-wider text-slate-500 font-semibold w-3/8 bg-slate-100/60">
                  Conventional Mega-Firms
                </th>
                <th className="py-5 px-6 text-xs uppercase tracking-wider text-[#07182E] font-bold w-3/8 bg-[#C6A36B]/15 border-l-2 border-[#C6A36B]">
                  <span className="text-[#A87948] flex items-center gap-2">
                    <Award size={16} />
                    Aurelius & Co. Distinction
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#07182E]/10">
              {comparisonMatrix.map((row, idx) => (
                <tr
                  key={row.dimension}
                  onMouseEnter={() => setActiveRow(idx)}
                  onMouseLeave={() => setActiveRow(null)}
                  className={`transition-colors ${
                    activeRow === idx ? 'bg-slate-50/80' : 'bg-white'
                  }`}
                >
                  <td className="py-5 px-6 text-xs font-semibold text-[#07182E] align-top bg-slate-50/40">
                    {row.dimension}
                    <p className="text-[11px] text-slate-400 font-normal mt-1">{row.note}</p>
                  </td>
                  <td className="py-5 px-6 text-xs text-slate-600 align-top leading-relaxed">
                    <div className="flex items-start gap-2">
                      <span className="text-red-500/70 mt-0.5 shrink-0">
                        <X size={15} />
                      </span>
                      <span>{row.traditionalMegaFirm}</span>
                    </div>
                  </td>
                  <td className="py-5 px-6 text-xs text-[#07182E] font-medium align-top leading-relaxed bg-[#C6A36B]/5 border-l-2 border-[#C6A36B]/60">
                    <div className="flex items-start gap-2">
                      <span className="text-[#A87948] mt-0.5 shrink-0">
                        <Check size={16} />
                      </span>
                      <span>{row.aureliusStandard}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards View */}
        <div className="md:hidden space-y-4">
          {comparisonMatrix.map((row) => (
            <div key={row.dimension} className="p-6 bg-white border border-[#07182E]/10 space-y-4 shadow-sm">
              <div className="border-b border-slate-100 pb-2">
                <h3 className="font-serif text-base text-[#07182E] font-medium">{row.dimension}</h3>
                <p className="text-[11px] text-slate-400">{row.note}</p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-red-50/50 border border-red-100 text-slate-700 flex items-start gap-2">
                  <X size={14} className="text-red-500 mt-0.5 shrink-0" />
                  <div>
                    <strong className="block text-[10px] uppercase text-red-700 font-bold tracking-wider mb-0.5">
                      Conventional Firm
                    </strong>
                    {row.traditionalMegaFirm}
                  </div>
                </div>

                <div className="p-3 bg-[#C6A36B]/15 border border-[#C6A36B]/40 text-[#07182E] flex items-start gap-2">
                  <Check size={14} className="text-[#A87948] mt-0.5 shrink-0" />
                  <div>
                    <strong className="block text-[10px] uppercase text-[#A87948] font-bold tracking-wider mb-0.5">
                      Aurelius & Co.
                    </strong>
                    {row.aureliusStandard}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
