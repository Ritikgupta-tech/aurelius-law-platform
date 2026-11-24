import type { Metadata } from 'next';
import { ArrowRight, ArrowUpRight, BriefcaseBusiness, Building2, Scale, ShieldCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const metadata: Metadata = { title: 'Expertise | Aurelius & Co.', description: 'Explore the legal capabilities of Aurelius & Co.' };

const capabilities: { number: string; title: string; description: string; icon: LucideIcon }[] = [
  { number: '01', title: 'Corporate & Commercial', description: 'Clarity for ambitious companies, from first incorporation to complex transactions.', icon: Building2 },
  { number: '02', title: 'Dispute Resolution', description: 'Measured strategy and decisive representation when the stakes are high.', icon: Scale },
  { number: '03', title: 'Private Wealth', description: 'Thoughtful counsel for families, founders, and the legacies they are building.', icon: ShieldCheck },
  { number: '04', title: 'Real Estate & Projects', description: 'Confident guidance through acquisitions, development, and investment.', icon: BriefcaseBusiness },
];

export default function ExpertisePage() {
  return <main className="inner-page"><header className="inner-hero expertise-hero"><a className="brand" href="/"><span className="brand-mark"><Scale size={19} strokeWidth={1.4} /></span><span className="brand-name">Aurelius <i>&</i> Co.</span></a><a className="inner-back" href="/">Back to home <ArrowUpRight size={15} /></a><div className="inner-hero-copy"><span className="section-kicker light">Areas of expertise / 02</span><h1>Where experience<br /><em>meets ambition.</em></h1><p>Advice for the issues that define businesses, protect families, and shape the future.</p></div></header><section className="inner-content expertise-intro"><span className="section-kicker">Our capabilities</span><p className="large-statement">The law is only one part of the answer. Context, timing, and judgment complete it.</p><div className="capability-list">{capabilities.map(({ number, title, description, icon: Icon }) => <a className="capability-row" href="/#contact" key={number}><span>{number}</span><Icon size={25} strokeWidth={1.2} /><h2>{title}</h2><p>{description}</p><ArrowUpRight size={19} /></a>)}</div></section><section className="inner-cta"><h2>Have a question<br /><em>worth asking?</em></h2><a className="button button-gold" href="/#contact">Start a conversation <ArrowUpRight size={16} /></a></section><footer className="inner-footer"><span>© 2024 Aurelius & Co.</span><a href="/">Return home <ArrowRight size={15} /></a></footer></main>;
}
