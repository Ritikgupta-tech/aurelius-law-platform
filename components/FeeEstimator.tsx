'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calculator, ArrowRight, ShieldCheck, CheckCircle2, Info, ArrowUpRight } from 'lucide-react';

interface MatterPreset {
  id: string;
  name: string;
  basePartnerHours: number;
  baseAssociateHours: number;
  filingReserveUsd: number;
  description: string;
}

const MATTER_PRESETS: MatterPreset[] = [
  {
    id: 'ma',
    name: 'Cross-Border M&A / Transaction',
    basePartnerHours: 35,
    baseAssociateHours: 65,
    filingReserveUsd: 12000,
    description: 'Due diligence, purchase agreements, antitrust clearance & closing covenants.',
  },
  {
    id: 'venture',
    name: 'Startup Formation & Seed/A Financing',
    basePartnerHours: 15,
    baseAssociateHours: 30,
    filingReserveUsd: 3500,
    description: 'Corporate charter, SAFE notes, investor rights, founder vesting & board minutes.',
  },
  {
    id: 'litigation',
    name: 'Commercial Litigation & Arbitration',
    basePartnerHours: 40,
    baseAssociateHours: 80,
    filingReserveUsd: 18000,
    description: 'Pre-action discovery, forensic damage analysis, expert testimony & courtroom pleadings.',
  },
  {
    id: 'ip',
    name: 'Global IP Portfolio & Trademark Moat',
    basePartnerHours: 20,
    baseAssociateHours: 40,
    filingReserveUsd: 9000,
    description: 'Madrid Protocol clearance, secondary patent thicket & licensing agreements.',
  },
  {
    id: 'private_wealth',
    name: 'Private Client Dynastic Trust & Succession',
    basePartnerHours: 25,
    baseAssociateHours: 35,
    filingReserveUsd: 5000,
    description: 'Cross-border family office governance, asset protection deeds & prenuptials.',
  },
];

export default function FeeEstimator() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('ma');
  const [complexityMultiplier, setComplexityMultiplier] = useState<number>(1.2); // 1.0 = Standard, 1.3 = Multi-jurisdiction, 1.7 = Contested
  const [currency, setCurrency] = useState<'USD' | 'GBP' | 'EUR'>('GBP');

  const preset = MATTER_PRESETS.find((p) => p.id === selectedPresetId) || MATTER_PRESETS[0];

  // Hourly benchmark rates
  const partnerRateUsd = 950;
  const associateRateUsd = 550;

  // Currency exchange approximations
  const currencyRates: Record<string, { symbol: string; rate: number }> = {
    USD: { symbol: '$', rate: 1.0 },
    GBP: { symbol: '£', rate: 0.79 },
    EUR: { symbol: '€', rate: 0.94 },
  };

  const currentCurrency = currencyRates[currency];

  const calculatedPartnerHours = Math.round(preset.basePartnerHours * complexityMultiplier);
  const calculatedAssociateHours = Math.round(preset.baseAssociateHours * complexityMultiplier);

  const totalFeesUsd =
    calculatedPartnerHours * partnerRateUsd +
    calculatedAssociateHours * associateRateUsd +
    preset.filingReserveUsd * complexityMultiplier;

  const convertedTotal = Math.round(totalFeesUsd * currentCurrency.rate);
  const phase1Retainer = Math.round(convertedTotal * 0.4);

  return (
    <section className="py-24 bg-[#07182E] text-white px-4 sm:px-6 lg:px-8 border-t border-[#C6A36B]/20 font-sans">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="text-[#C6A36B] text-xs font-semibold uppercase tracking-[0.25em] flex items-center gap-2">
              <Calculator size={16} />
              Transparent Commercial Retainers
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-light">
              Executive Legal Fee & <br />
              <span className="italic text-[#C6A36B]">Retainer Estimator</span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md font-light leading-relaxed">
            Predictable phase-based structuring. Corporate decision-makers can model estimated partner hours, statutory filing reserves, and initial retainer capital below.
          </p>
        </div>

        {/* Interactive Model Box */}
        <div className="bg-[#0B2340] border border-[#C6A36B]/40 p-8 sm:p-12 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Controls: Left 7 Columns */}
          <div className="lg:col-span-7 space-y-8">
            {/* Currency selector */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="text-xs uppercase tracking-wider text-slate-300 font-semibold">
                Select Currency
              </span>
              <div className="flex gap-2">
                {(['GBP', 'USD', 'EUR'] as const).map((cur) => (
                  <button
                    key={cur}
                    onClick={() => setCurrency(cur)}
                    className={`px-3 py-1 text-xs font-mono font-bold border transition-colors ${
                      currency === cur
                        ? 'bg-[#C6A36B] text-[#07182E] border-[#C6A36B]'
                        : 'border-white/20 text-slate-300 hover:border-white/50'
                    }`}
                  >
                    {cur} ({currencyRates[cur].symbol})
                  </button>
                ))}
              </div>
            </div>

            {/* Matter Preset Buttons */}
            <div className="space-y-3">
              <label className="text-xs uppercase tracking-wider text-slate-300 font-semibold block">
                1. Select Matter Classification
              </label>
              <div className="space-y-2">
                {MATTER_PRESETS.map((p) => {
                  const isSelected = selectedPresetId === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => setSelectedPresetId(p.id)}
                      className={`p-4 border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#C6A36B] bg-[#07182E] text-white shadow-md'
                          : 'border-white/10 bg-[#07182E]/40 text-slate-300 hover:border-white/30'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-serif text-sm font-medium">{p.name}</span>
                        {isSelected && <span className="text-xs text-[#C6A36B] font-bold">Selected</span>}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 font-light">{p.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Complexity Tier Slider */}
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center">
                <label className="text-xs uppercase tracking-wider text-slate-300 font-semibold">
                  2. Jurisdictional Scope & Complexity
                </label>
                <span className="text-xs text-[#C6A36B] font-mono font-bold">
                  {complexityMultiplier === 1.0
                    ? 'Single Jurisdiction (Standard)'
                    : complexityMultiplier === 1.3
                    ? 'Dual-Jurisdiction (Cross-Border)'
                    : 'Global Multi-Party (Contested)'}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 1.0, label: 'Single Jurisdiction', note: 'Standard' },
                  { value: 1.3, label: 'Dual-Jurisdiction', note: 'Cross-Border' },
                  { value: 1.7, label: 'Multi-Region', note: 'Contested / High-Stakes' },
                ].map((tier) => (
                  <button
                    type="button"
                    key={tier.value}
                    onClick={() => setComplexityMultiplier(tier.value)}
                    className={`p-3 text-left border transition-all ${
                      complexityMultiplier === tier.value
                        ? 'border-[#C6A36B] bg-[#07182E] text-white'
                        : 'border-white/10 bg-[#07182E]/30 text-slate-400 hover:border-white/30'
                    }`}
                  >
                    <p className="text-xs font-semibold">{tier.label}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{tier.note}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Breakdown Card: Right 5 Columns */}
          <div className="lg:col-span-5 bg-[#07182E] border border-[#C6A36B]/60 p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <div className="border-b border-white/10 pb-4 space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-[#C6A36B] font-bold">
                Engagement Model Summary
              </span>
              <h3 className="font-serif text-2xl text-white">{preset.name}</h3>
            </div>

            {/* Hours Breakdown */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center text-slate-300">
                <span>Partner Direct Advisory Hours:</span>
                <span className="font-mono font-bold text-white">{calculatedPartnerHours} hrs</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Senior Associate Drafting:</span>
                <span className="font-mono font-bold text-white">{calculatedAssociateHours} hrs</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Statutory Registry & Filing Reserves:</span>
                <span className="font-mono font-bold text-white">
                  {currentCurrency.symbol}
                  {Math.round(preset.filingReserveUsd * complexityMultiplier * currentCurrency.rate).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Estimated Total */}
            <div className="p-4 bg-[#041225] border border-[#C6A36B]/30 space-y-2">
              <div className="flex justify-between items-center text-xs text-slate-400">
                <span>Estimated Full Matter Total:</span>
                <span className="font-mono text-base font-semibold text-slate-200">
                  {currentCurrency.symbol}
                  {convertedTotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-white/10">
                <span className="text-xs uppercase font-bold text-[#C6A36B]">Phase 1 Retainer:</span>
                <span className="font-serif text-2xl font-bold text-[#C6A36B]">
                  {currentCurrency.symbol}
                  {phase1Retainer.toLocaleString()}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 font-light leading-relaxed">
              *Estimates reflect blended partner/associate hourly rates and historical matter benchmarks. Formal retainers are finalized following conflict screening and scope execution.
            </p>

            <Link
              href={`/book-consultation?matter=${preset.id}`}
              className="w-full text-center block py-4 bg-[#C6A36B] text-[#07182E] text-xs uppercase tracking-widest font-bold hover:bg-[#d5b682] transition-colors"
            >
              Reserve Matter Consultation
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
