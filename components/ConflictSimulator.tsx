'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, Search, CheckCircle2, AlertTriangle, ArrowRight, Lock, Loader2 } from 'lucide-react';
import { db } from '@/lib/db/database';

export default function ConflictSimulator() {
  const [clientEntity, setClientEntity] = useState('');
  const [adverseParty, setAdverseParty] = useState('');
  const [jurisdiction, setJurisdiction] = useState('UK / London Commercial Court');
  const [scanning, setScanning] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [scanResult, setScanResult] = useState<{ status: 'cleared' | 'flagged'; message: string; certificateId: string } | null>(null);

  const scanSteps = [
    'Cross-referencing active client registry & confidential corporate rosters...',
    'Forensic screening against adverse party subsidiaries & holding structures...',
    'Checking international regulatory compliance & sanctions indices...',
    'Synthesizing conflict clearance report under Bar Council standards...',
  ];

  const handleRunScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientEntity.trim()) return;

    setScanning(true);
    setScanResult(null);
    setStepIndex(0);

    const stepInterval = setInterval(() => {
      setStepIndex((prev) => {
        if (prev < scanSteps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(stepInterval);
          setScanning(false);

          // Real conflict engine check
          const result = db.runConflictCheck(clientEntity, adverseParty, 'Simulator assessment');
          const certId = `CERT-CONF-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

          setScanResult({
            status: result.status,
            message: result.notes,
            certificateId: certId,
          });
          return prev;
        }
      });
    }, 600);
  };

  return (
    <section className="py-24 bg-[#F8F5EF] text-[#202936] px-4 sm:px-6 lg:px-8 font-sans border-t border-[#07182E]/10">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="text-[#A87948] text-xs font-semibold uppercase tracking-[0.25em] flex items-center justify-center gap-2">
            <ShieldCheck size={16} />
            Ethical Governance Protocol
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#07182E]">
            Pre-Intake Conflict <br />
            <span className="italic text-[#A87948]">Screening Simulator</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
            Legal ethics prohibit adverse representation. Test our forensic party-checking protocol before submitting sensitive corporate files.
          </p>
        </div>

        {/* Simulator Card */}
        <div className="bg-white border border-[#07182E]/15 p-8 sm:p-12 shadow-xl space-y-8">
          <form onSubmit={handleRunScan} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-slate-700 font-semibold">
                  Your Corporation / Prospective Client *
                </label>
                <input
                  required
                  value={clientEntity}
                  onChange={(e) => setClientEntity(e.target.value)}
                  placeholder="e.g. Meridian Capital Holdings Ltd"
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 text-xs text-[#07182E] focus:outline-none focus:border-[#C6A36B]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-slate-700 font-semibold">
                  Named Opposing / Adverse Party (Optional)
                </label>
                <input
                  value={adverseParty}
                  onChange={(e) => setAdverseParty(e.target.value)}
                  placeholder="e.g. Apex Global Syndicate Corp"
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 text-xs text-[#07182E] focus:outline-none focus:border-[#C6A36B]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-slate-700 font-semibold">
                Primary Contemplated Jurisdiction
              </label>
              <select
                value={jurisdiction}
                onChange={(e) => setJurisdiction(e.target.value)}
                className="w-full p-3.5 bg-slate-50 border border-slate-200 text-xs text-[#07182E] focus:outline-none focus:border-[#C6A36B]"
              >
                <option value="UK / London Commercial Court">UK / London Commercial Court & High Court of Justice</option>
                <option value="US / SDNY New York">US / Southern District of New York & Delaware Chancery</option>
                <option value="ICC / Paris Arbitration">International Chamber of Commerce (ICC Paris Arbitration)</option>
                <option value="LCIA / London Arbitration">London Court of International Arbitration (LCIA)</option>
                <option value="SIAC / Singapore Arbitration">Singapore International Arbitration Centre (SIAC)</option>
                <option value="Swiss / Geneva Chambers">Swiss Rules of International Arbitration (Geneva / Zurich)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={scanning}
              className="w-full py-4 bg-[#07182E] text-[#C6A36B] text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 hover:bg-[#0B2340] transition-colors disabled:opacity-50"
            >
              {scanning ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Forensic Screening in Progress...
                </>
              ) : (
                <>
                  <Search size={16} />
                  Execute Pre-Intake Conflict Scan
                </>
              )}
            </button>
          </form>

          {/* Animated Scanning Steps */}
          {scanning && (
            <div className="p-6 bg-slate-50 border border-slate-200 space-y-4 animate-in fade-in">
              <span className="text-[10px] uppercase tracking-widest text-[#A87948] font-bold block">
                Verification Pipeline Status
              </span>
              <div className="space-y-2 text-xs">
                {scanSteps.map((step, idx) => {
                  const isDone = idx < stepIndex;
                  const isCurrent = idx === stepIndex;
                  return (
                    <div
                      key={step}
                      className={`flex items-center gap-3 transition-opacity ${
                        isDone ? 'text-emerald-700 font-medium' : isCurrent ? 'text-[#07182E] font-bold' : 'text-slate-400 opacity-50'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                      ) : isCurrent ? (
                        <Loader2 size={16} className="text-[#A87948] animate-spin shrink-0" />
                      ) : (
                        <span className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                      )}
                      <span>{step}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Results Badge & Certificate */}
          {scanResult && (
            <div
              className={`p-6 sm:p-8 border space-y-4 animate-in zoom-in-95 duration-300 ${
                scanResult.status === 'cleared'
                  ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                  : 'bg-amber-50/70 border-amber-300 text-amber-950'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/10 pb-4">
                <div className="flex items-center gap-2.5">
                  {scanResult.status === 'cleared' ? (
                    <CheckCircle2 size={24} className="text-emerald-600" />
                  ) : (
                    <AlertTriangle size={24} className="text-amber-600" />
                  )}
                  <div>
                    <h3 className="font-serif text-xl font-medium">
                      {scanResult.status === 'cleared'
                        ? 'Preliminary Conflict Check: Cleared'
                        : 'Preliminary Conflict Check: Manual Compliance Flag'}
                    </h3>
                    <p className="text-xs text-slate-600">{scanResult.message}</p>
                  </div>
                </div>

                <span className="font-mono text-xs px-3 py-1 bg-white border border-slate-300 font-bold">
                  {scanResult.certificateId}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-2">
                <div>
                  <span className="text-slate-500 block">Prospective Client:</span>
                  <strong>{clientEntity}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Adverse Party Screened:</span>
                  <strong>{adverseParty || 'None Identified'}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Jurisdiction:</span>
                  <strong>{jurisdiction}</strong>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <Link
                  href={`/book-consultation?cert=${scanResult.certificateId}`}
                  className="px-6 py-3 bg-[#07182E] text-[#C6A36B] text-xs uppercase tracking-widest font-bold flex items-center gap-2 hover:bg-[#0B2340]"
                >
                  Proceed with Conflict Clearance Ref
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
