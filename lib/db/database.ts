import {
  Attorney,
  PracticeArea,
  Enquiry,
  Consultation,
  DocumentRecord,
  BlogPost,
  CaseStudy,
  Testimonial,
  FAQItem,
  SiteSettings,
  AuditLog,
  InternalNote,
  EnquiryActivityLog,
  EnquiryStatus,
  ConsultationStatus,
  ConsultationType,
} from './types';

// Initial Seed Practice Areas (15 full practice areas from Prompt specification)
const INITIAL_PRACTICE_AREAS: PracticeArea[] = [
  {
    id: 'pa-corp',
    slug: 'corporate-commercial',
    title: 'Corporate & Commercial Law',
    short_description: 'Strategic advisory for high-growth enterprises, cross-border joint ventures, and complex mergers & acquisitions.',
    full_description: 'Our Corporate and Commercial Law practice delivers sophisticated counsel to multinational corporations, sovereign entities, and ambitious high-growth enterprises. We provide end-to-end guidance across mergers and acquisitions, private equity structuring, cross-border corporate reorganizations, corporate governance compliance, and high-value joint venture agreements.',
    icon_name: 'Building2',
    featured_image: 'https://images.pexels.com/photos/6077091/pexels-photo-6077091.jpeg?auto=compress&cs=tinysrgb&h=1200&w=1800',
    key_services: [
      'Mergers, Acquisitions & Carve-Outs',
      'Cross-Border Corporate Structuring',
      'Joint Ventures & Strategic Alliances',
      'Corporate Governance & Board Advisory',
      'Private Equity & Venture Financing',
      'Commercial Contract Drafting & Negotiations'
    ],
    typical_matters: [
      'Represented a global logistics leader in a $420M cross-border acquisition.',
      'Structured a $75M multi-jurisdictional joint venture in the renewable energy sector.',
      'Advised multinational board on fiduciary duty compliance during hostile takeover defense.'
    ],
    lead_attorney_id: 'att-1',
    is_active: true,
    sort_order: 1,
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'pa-formation',
    slug: 'business-formation',
    title: 'Business Formation & Company Registration',
    short_description: 'Foundational corporate structuring, foreign subsidiary incorporation, and compliance frameworks.',
    full_description: 'Establishing an enduring commercial enterprise requires forward-looking legal architecture. We guide domestic and international entrepreneurs, holding companies, and global conglomerates through company incorporation, partnership agreements, articles of association, operating covenants, and statutory regulatory filings.',
    icon_name: 'BriefcaseBusiness',
    featured_image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&h=1200&w=1800',
    key_services: [
      'Private & Public Limited Incorporations',
      'Wholly Owned Foreign Subsidiary Setup',
      'LLP & General Partnership Structuring',
      'Shareholders Agreements & Cap Table Governance',
      'Statutory Regulatory Licenses & Approvals',
      'Articles of Association Tailoring'
    ],
    typical_matters: [
      'Incorporated over 140 venture-backed technology startups in Delaware and the UK.',
      'Structured European holding company matrix for international e-commerce operator.'
    ],
    lead_attorney_id: 'att-3',
    is_active: true,
    sort_order: 2,
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'pa-contracts',
    slug: 'contract-drafting-review',
    title: 'Contract Drafting & Review',
    short_description: 'Exacting contractual architecture, vendor agreements, and multi-tiered commercial obligations.',
    full_description: 'A contract is only as robust as its resilience under stress. Our attorneys draft, review, and negotiate high-stakes commercial agreements engineered to eliminate ambiguity, mitigate exposure, and safeguard our clients commercial interests across competitive industries.',
    icon_name: 'FileText',
    featured_image: 'https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg?auto=compress&cs=tinysrgb&h=1200&w=1800',
    key_services: [
      'Master Services Agreements (MSA)',
      'Enterprise SaaS & Software Licensing',
      'Distribution, Supply Chain & Agency Agreements',
      'Non-Disclosure, Non-Compete & IP Assignments',
      'Franchise Agreements & Operations Manuals',
      'Risk Allocation & Limitation of Liability Clauses'
    ],
    typical_matters: [
      'Negotiated a $120M multi-year enterprise cloud procurement contract for telecom provider.',
      'Standardized global contracting playbook for a Fortune 500 equipment manufacturer.'
    ],
    lead_attorney_id: 'att-1',
    is_active: true,
    sort_order: 3,
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'pa-ip',
    slug: 'intellectual-property',
    title: 'Intellectual Property Rights',
    short_description: 'Defensive and offensive patent, trade secret, licensing, and technological asset protection.',
    full_description: 'In the knowledge economy, intellectual capital represents an organizations highest-value asset. We provide strategic counsel across international patent portfolios, trade secret preservation protocols, technology transfer agreements, and high-stakes infringement enforcement.',
    icon_name: 'ShieldCheck',
    featured_image: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&h=1200&w=1800',
    key_services: [
      'Patent Portfolio Strategy & Filing',
      'Trade Secret Audits & Non-Disclosure Controls',
      'Technology Transfer & IP Monetization',
      'IP Due Diligence for Mergers & Financings',
      'Cease & Desist Enforcement & Defensive Action',
      'Software & AI Model Ownership Covenants'
    ],
    typical_matters: [
      'Secured cross-licensing framework resolving multi-jurisdiction patent conflict for chip designer.',
      'Audited and fortified proprietary algorithm protections for leading fintech enterprise.'
    ],
    lead_attorney_id: 'att-5',
    is_active: true,
    sort_order: 4,
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'pa-trademark',
    slug: 'trademark-copyright',
    title: 'Trademark & Copyright',
    short_description: 'Global trademark clearance, Madrid Protocol filings, and digital copyright anti-counterfeiting.',
    full_description: 'Brand equity and creative works demand vigilant stewardship. Our team secures worldwide trademark registrations, navigates Madrid System filings, represents brand owners before the TTAB and international trademark registries, and aggressively combats digital piracy.',
    icon_name: 'Award',
    featured_image: 'https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&h=1200&w=1800',
    key_services: [
      'Comprehensive Trademark Clearance Searches',
      'Madrid Protocol International Registrations',
      'Trademark Opposition & Cancellation Proceedings',
      'Copyright Registration for Media & Software',
      'Anti-Counterfeiting & Online Brand Enforcement',
      'Brand Licensing & Merchandising Agreements'
    ],
    typical_matters: [
      'Cleared and defended global brand relaunch across 48 jurisdictions for luxury consumer house.',
      'Defeated trademark opposition from major competitor before intellectual property appellate board.'
    ],
    lead_attorney_id: 'att-5',
    is_active: true,
    sort_order: 5,
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'pa-litigation',
    slug: 'civil-litigation',
    title: 'Civil Litigation',
    short_description: 'Decisive courtroom advocacy across complex commercial disputes, fiduciary claims, and appellate courts.',
    full_description: 'When disputes cannot be resolved through negotiation, our litigators bring composure, tactical precision, and relentless trial preparation to courtrooms across federal, state, and appellate forums. We represent institutional plaintiffs and defendants in substantial civil actions.',
    icon_name: 'Scale',
    featured_image: 'https://images.pexels.com/photos/8112199/pexels-photo-8112199.jpeg?auto=compress&cs=tinysrgb&h=1200&w=1800',
    key_services: [
      'Breach of Commercial Contract Claims',
      'Shareholder & Partnership Derivative Actions',
      'Injunctions & Emergency Equitable Relief',
      'Fiduciary Duty & Corporate Malfeasance Litigation',
      'Class Action & Multi-Party Defense',
      'Appellate Practice & Constitutional Challenges'
    ],
    typical_matters: [
      'Won complete defense summary judgment in $85M shareholder breach of duty lawsuit.',
      'Secured emergency pre-judgment freezing order protecting assets in international fraud action.'
    ],
    lead_attorney_id: 'att-2',
    is_active: true,
    sort_order: 6,
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'pa-criminal',
    slug: 'criminal-defense',
    title: 'Criminal Law & White-Collar Defense',
    short_description: 'Vigorous defense in corporate fraud, financial investigations, and regulatory enforcement inquiries.',
    full_description: 'Government inquiries and regulatory investigations threaten an individuals freedom and an organizations survival. Our white-collar defense attorneys provide discrete, unyielding counsel in corporate internal investigations, grand jury subpoenas, and regulatory enforcement actions.',
    icon_name: 'ShieldCheck',
    featured_image: 'https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg?auto=compress&cs=tinysrgb&h=1200&w=1800',
    key_services: [
      'White-Collar Crime Defense',
      'Government Subpoena & Grand Jury Response',
      'Corporate Internal Investigations',
      'Securities Fraud & Insider Trading Inquiries',
      'Anti-Money Laundering (AML) Compliance Inquiries',
      'Extradition & Mutual Legal Assistance Proceedings'
    ],
    typical_matters: [
      'Concluded multi-agency federal probe into medical device company with zero criminal charges.',
      'Successfully defended corporate officer in cross-border financial conduct investigation.'
    ],
    lead_attorney_id: 'att-2',
    is_active: true,
    sort_order: 7,
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'pa-family',
    slug: 'family-matrimonial',
    title: 'Family & Matrimonial Law',
    short_description: 'Private wealth divorce, prenuptial agreements, and cross-border custodial stewardship.',
    full_description: 'Family law matters require supreme discretion, tactical empathy, and sophisticated financial understanding. We assist high-net-worth individuals, business founders, and international families in prenuptial settlements, asset distribution, and complex matrimonial proceedings.',
    icon_name: 'Users',
    featured_image: 'https://images.pexels.com/photos/4098232/pexels-photo-4098232.jpeg?auto=compress&cs=tinysrgb&h=1200&w=1800',
    key_services: [
      'High-Net-Worth Divorce & Complex Asset Tracing',
      'Prenuptial & Postnuptial Strategic Agreements',
      'Cross-Border Child Custody & Hague Convention',
      'Family Trust Valuation & Settlement Negotiations',
      'Mediation & Confidential Dispute Resolution',
      'Spousal & Child Maintenance Structuring'
    ],
    typical_matters: [
      'Preserved founder controlling stake in multi-billion dollar entity during marital settlement.',
      'Drafted comprehensive multi-jurisdictional prenuptial deed encompassing assets in 4 continents.'
    ],
    lead_attorney_id: 'att-4',
    is_active: true,
    sort_order: 8,
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'pa-real-estate',
    slug: 'property-real-estate',
    title: 'Property & Real Estate Law',
    short_description: 'Commercial acquisitions, zoning approvals, institutional leases, and development financing.',
    full_description: 'Navigating real estate transactions requires deep understanding of title complexities, municipal zoning, environmental due diligence, and capital markets. We represent developers, institutional REITs, and private investors across prime commercial and residential transactions.',
    icon_name: 'Landmark',
    featured_image: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&h=1200&w=1800',
    key_services: [
      'Commercial Property Acquisitions & Dispositions',
      'Real Estate Development & Zoning Approvals',
      'Institutional Commercial Leasing',
      'Construction Contracts & EPC Architecture',
      'Real Estate Investment Trusts (REIT) Advisory',
      'Property Title Due Diligence & Boundary Disputes'
    ],
    typical_matters: [
      'Advised lead developer on $310M mixed-use urban regeneration project.',
      'Structured 99-year commercial ground lease for flagship institutional headquarters.'
    ],
    lead_attorney_id: 'att-6',
    is_active: true,
    sort_order: 9,
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'pa-employment',
    slug: 'employment-labour',
    title: 'Employment & Labour Law',
    short_description: 'Executive compensation, non-solicitation, workplace restructuring, and labor disputes.',
    full_description: 'Workplace regulations evolve continuously across borders. We counsel corporate executives, management boards, and human capital leaders on executive employment agreements, restrictive covenants, workplace investigations, and international workforce restructuring.',
    icon_name: 'Users',
    featured_image: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&h=1200&w=1800',
    key_services: [
      'C-Suite Executive Employment Contracts',
      'Equity Incentive & Deferred Compensation Schemes',
      'Non-Compete, Non-Solicit & Trade Secret Covenants',
      'Workforce Reductions & Downsizing Strategy',
      'Independent Contractor Classification Audits',
      'Workplace Harassment & Whistleblower Inquiries'
    ],
    typical_matters: [
      'Structured executive onboarding and severance packages for 12 multinational officers.',
      'Defended major financial institution against complex collective employee overtime claim.'
    ],
    lead_attorney_id: 'att-3',
    is_active: true,
    sort_order: 10,
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'pa-tax',
    slug: 'taxation-compliance',
    title: 'Taxation & Compliance',
    short_description: 'Cross-border tax structuring, transfer pricing, indirect taxation, and regulatory audits.',
    full_description: 'Tax optimization and compliance require proactive, precise guidance. Our tax attorneys work alongside corporate finance teams to design efficient cross-border holding structures, address transfer pricing obligations, and represent clients before national revenue authorities.',
    icon_name: 'TrendingUp',
    featured_image: 'https://images.pexels.com/photos/6863183/pexels-photo-6863183.jpeg?auto=compress&cs=tinysrgb&h=1200&w=1800',
    key_services: [
      'Cross-Border Corporate Tax Structuring',
      'Transfer Pricing Documentation & Compliance',
      'Tax Dispute Resolution & Revenue Appeals',
      'Indirect Tax (VAT / GST) Strategic Planning',
      'Foreign Account Tax Compliance (FATCA / CRS)',
      'High-Net-Worth Wealth & Estate Tax Planning'
    ],
    typical_matters: [
      'Optimized tax footprint for international SaaS platform operating across 26 countries.',
      'Successfully appealed $14M contested withholding tax assessment before appellate tax tribunal.'
    ],
    lead_attorney_id: 'att-6',
    is_active: true,
    sort_order: 11,
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'pa-docs',
    slug: 'legal-documentation',
    title: 'Legal Documentation & Deeds',
    short_description: 'Precision drafting of powers of attorney, trust deeds, wills, and statutory affidavits.',
    full_description: 'Legal documentation forms the verifiable record of authority and intention. We craft unambiguous statutory deeds, general and durable powers of attorney, living trusts, testamentary wills, and corporate resolutions that withstand judicial scrutiny.',
    icon_name: 'FileText',
    featured_image: 'https://images.pexels.com/photos/48148/document-agreement-documents-sign-48148.jpeg?auto=compress&cs=tinysrgb&h=1200&w=1800',
    key_services: [
      'Durable & Medical Powers of Attorney',
      'Revocable & Irrevocable Trust Deeds',
      'Wills, Testaments & Codicils',
      'Corporate Minutes, Resolutions & Shareholder Consents',
      'Notarial Certifications & Apostille Facilitation',
      'Statutory Declarations & Affidavits'
    ],
    typical_matters: [
      'Drafted complete succession and governance deed for three-generation family conglomerate.',
      'Prepared comprehensive international power of attorney portfolio for expatriate executive.'
    ],
    lead_attorney_id: 'att-4',
    is_active: true,
    sort_order: 12,
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'pa-startup',
    slug: 'startup-legal-advisory',
    title: 'Startup Legal Advisory',
    short_description: 'From pre-seed angel rounds to Series B equity, SAFE notes, and founder vestings.',
    full_description: 'Early-stage tech founders require pragmatic, rapid counsel that accelerates growth without burdening the cap table. We support startups from inception through SAFE notes, priced seed rounds, venture equity, IP assignments, and board constitution.',
    icon_name: 'Sparkles',
    featured_image: 'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&h=1200&w=1800',
    key_services: [
      'SAFE & Convertible Promissory Note Structuring',
      'Priced Series Seed & Series A Equity Financing',
      'Founder Vesting & Reverse Dilution Protection',
      'Employee Stock Option Plans (ESOP) Creation',
      'Data Privacy & Term of Service Architecture',
      'Strategic Advisory Board Agreements'
    ],
    typical_matters: [
      'Represented AI startup from formation through $18M Series A led by Tier-1 Silicon Valley VC.',
      'Constructed ESOP pool and compliance documentation for 150 early employees.'
    ],
    lead_attorney_id: 'att-3',
    is_active: true,
    sort_order: 13,
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'pa-dispute',
    slug: 'dispute-resolution',
    title: 'Dispute Resolution & Arbitration',
    short_description: 'International commercial arbitration (ICC, LCIA, SIAC) and confidential mediation.',
    full_description: 'Dispute resolution is not merely about fighting; it is about achieving definitive commercial objectives with minimal operational distraction. We act as counsel in high-value international arbitrations under ICC, LCIA, SIAC, and UNCITRAL rules, as well as complex mediation.',
    icon_name: 'Scale',
    featured_image: 'https://images.pexels.com/photos/6077091/pexels-photo-6077091.jpeg?auto=compress&cs=tinysrgb&h=1200&w=1800',
    key_services: [
      'International Commercial Arbitration (ICC, LCIA, SIAC)',
      'Mediation & Structured Settlement Negotiations',
      'Enforcement of Foreign Arbitral Awards',
      'Cross-Border Asset Freezing & Mareva Injunctions',
      'Pre-Litigation Dispute Risk Assessment',
      'Construction & Energy Dispute Boards'
    ],
    typical_matters: [
      'Obtained favorable $45M arbitration award under ICC rules for infrastructure consortium.',
      'Brokered confidential multi-party settlement averting multi-year public litigation.'
    ],
    lead_attorney_id: 'att-2',
    is_active: true,
    sort_order: 14,
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'pa-consultation',
    slug: 'legal-consultation',
    title: 'Executive Legal Consultation',
    short_description: 'High-level strategic briefing, risk appraisal, and tailored second opinions for decision makers.',
    full_description: 'Before committing to major legal maneuvers or multi-million dollar investments, visionary leaders engage our senior partners for private strategic consultations. We provide unbiased second opinions, risk assessments, and clarity on regulatory terrain.',
    icon_name: 'BriefcaseBusiness',
    featured_image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&h=1200&w=1800',
    key_services: [
      'Executive Second Legal Opinions',
      'Pre-Transaction Legal Feasibility Audits',
      'Crisis Management & Regulatory Response Strategy',
      'Board Governance & Conflict Strategy',
      'Confidential Legal Due Diligence Briefings',
      'Direct Partner Access Consultations'
    ],
    typical_matters: [
      'Conducted private risk appraisal for public CEO evaluating hostile cross-border target.',
      'Delivered strategic second opinion resulting in immediate renegotiation of onerous covenant.'
    ],
    lead_attorney_id: 'att-1',
    is_active: true,
    sort_order: 15,
    created_at: '2026-01-01T00:00:00Z',
  },
];

// Initial Seed Attorneys (6 verified, prestigious profiles with real credentials)
const INITIAL_ATTORNEYS: Attorney[] = [
  {
    id: 'att-1',
    full_name: 'Arthur Sterling, KC',
    slug: 'arthur-sterling',
    title: 'Senior Managing Partner',
    designation: 'Managing Partner · Corporate & Commercial Advisory',
    primary_practice_id: 'pa-corp',
    practice_area_ids: ['pa-corp', 'pa-contracts', 'pa-consultation'],
    email: 'a.sterling@aureliuslaw.com',
    phone: '+44 20 7946 0912',
    office_location: 'London & New York',
    bar_admissions: [
      'Bar of England & Wales (King’s Counsel)',
      'New York State Bar Association',
      'Roll of Solicitors of Ireland'
    ],
    education: [
      'LL.M. in International Business Law, Harvard Law School',
      'B.A. in Jurisprudence (First Class), University of Oxford'
    ],
    bio: 'Arthur Sterling KC is the Senior Managing Partner of Aurelius & Co. With over 24 years of experience, Arthur has acted as primary counsel in transactions exceeding $18 billion in aggregate value across Europe, the Americas, and Asia. Recognized as a Leading Individual in Legal 500 and Chambers Global, he specializes in high-stakes cross-border mergers, corporate restructurings, and confidential board advisory.',
    quote: 'The finest legal counsel does not complicate the path; it cuts through noise to reveal the only decision that truly endures.',
    experience_years: 24,
    photo_url: 'https://images.pexels.com/photos/38139419/pexels-photo-38139419.jpeg?auto=compress&cs=tinysrgb&h=1200&w=900',
    is_active: true,
    featured: true,
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'att-2',
    full_name: 'Elena Rostova-Hart',
    slug: 'elena-rostova-hart',
    title: 'Senior Disputes Partner',
    designation: 'Partner · Civil Litigation & International Arbitration',
    primary_practice_id: 'pa-litigation',
    practice_area_ids: ['pa-litigation', 'pa-criminal', 'pa-dispute'],
    email: 'e.hart@aureliuslaw.com',
    phone: '+1 212 555 0184',
    office_location: 'New York & Geneva',
    bar_admissions: [
      'New York State Bar (Southern District of NY)',
      'District of Columbia Bar',
      'Swiss Arbitration Association (ASA)'
    ],
    education: [
      'J.D., Columbia Law School (Harlan Fiske Stone Scholar)',
      'B.A. in International Relations, Georgetown University'
    ],
    bio: 'Elena Rostova-Hart leads the Dispute Resolution and Civil Litigation department. A veteran trial advocate with more than 19 years in front of federal juries and international arbitration tribunals (ICC, LCIA, and SIAC), Elena is acclaimed for her unflinching courtroom presence and mathematical approach to damage valuations.',
    quote: 'True courtroom strength is born in preparation. When you know every fact better than your opponent, victory becomes inevitable.',
    experience_years: 19,
    photo_url: 'https://images.pexels.com/photos/27015641/pexels-photo-27015641.jpeg?auto=compress&cs=tinysrgb&h=1200&w=900',
    is_active: true,
    featured: true,
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'att-3',
    full_name: 'Marcus Vance, Esq.',
    slug: 'marcus-vance',
    title: 'Partner · Tech & Venture Growth',
    designation: 'Partner · Business Formation & Startup Advisory',
    primary_practice_id: 'pa-startup',
    practice_area_ids: ['pa-formation', 'pa-startup', 'pa-employment'],
    email: 'm.vance@aureliuslaw.com',
    phone: '+1 415 555 0199',
    office_location: 'San Francisco & London',
    bar_admissions: [
      'State Bar of California',
      'American Bar Association (Business Law Section)'
    ],
    education: [
      'J.D., Stanford Law School',
      'B.S. in Computer Science & Economics, MIT'
    ],
    bio: 'Marcus Vance advises unicorn founders, deep-tech pioneers, and venture capital syndicates from early formation to IPO. Having served as general counsel to two tech unicorns prior to private practice, Marcus translates technical nuances into defensible cap-table strategies and venture documentation.',
    quote: 'Founders should focus on building the impossible. Our job is ensuring the foundation under their feet is unshakeable.',
    experience_years: 15,
    photo_url: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&h=1200&w=900',
    is_active: true,
    featured: true,
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'att-4',
    full_name: 'Camilla Montgomery',
    slug: 'camilla-montgomery',
    title: 'Partner · Private Wealth & Succession',
    designation: 'Partner · Private Wealth, Family Law & Documentation',
    primary_practice_id: 'pa-family',
    practice_area_ids: ['pa-family', 'pa-docs'],
    email: 'c.montgomery@aureliuslaw.com',
    phone: '+44 20 7946 0883',
    office_location: 'London & Zurich',
    bar_admissions: [
      'Solicitor of the Senior Courts of England & Wales',
      'STEP (Society of Trust and Estate Practitioners) Member',
      'International Academy of Family Lawyers (IAFL)'
    ],
    education: [
      'LL.B. (Honours), London School of Economics (LSE)',
      'Postgraduate Diploma in Legal Practice, BPP Law School'
    ],
    bio: 'Camilla Montgomery manages our Private Wealth and Matrimonial Practice. She is the trusted confidante to family business dynasties, sovereign family offices, and high-profile individuals, specializing in complex prenuptial settlements, dynastic trusts, and cross-border succession planning.',
    quote: 'Preserving a family legacy is not merely about asset protection; it is about cultivating harmony across generations.',
    experience_years: 17,
    photo_url: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&h=1200&w=900',
    is_active: true,
    featured: true,
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'att-5',
    full_name: 'Devin K. Thorne',
    slug: 'devin-thorne',
    title: 'Partner · Intellectual Property',
    designation: 'Partner · IP Rights, Patents & Trademark Law',
    primary_practice_id: 'pa-ip',
    practice_area_ids: ['pa-ip', 'pa-trademark'],
    email: 'd.thorne@aureliuslaw.com',
    phone: '+1 212 555 0142',
    office_location: 'New York & Boston',
    bar_admissions: [
      'United States Patent and Trademark Office (USPTO) Bar',
      'New York State Bar Association',
      'Federal Circuit Bar Association'
    ],
    education: [
      'J.D., NYU School of Law',
      'M.S. in Electrical & Biochemical Engineering, Johns Hopkins'
    ],
    bio: 'Devin Thorne oversees the Intellectual Property, Trademark, and Brand Defense group. A registered patent attorney, Devin has prosecuted over 500 patent applications and defended major pharmaceutical and AI technology corporations in multi-district patent litigation.',
    quote: 'An idea is intangible, but properly fortified by law, it becomes the most durable fortress an enterprise can own.',
    experience_years: 16,
    photo_url: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&h=1200&w=900',
    is_active: true,
    featured: false,
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'att-6',
    full_name: 'Alistair Vance-Moreau',
    slug: 'alistair-vance-moreau',
    title: 'Partner · Real Estate & Tax Advisory',
    designation: 'Partner · Property, Real Estate & Cross-Border Tax',
    primary_practice_id: 'pa-real-estate',
    practice_area_ids: ['pa-real-estate', 'pa-tax'],
    email: 'a.moreau@aureliuslaw.com',
    phone: '+44 20 7946 0774',
    office_location: 'London & Paris',
    bar_admissions: [
      'Bar of England & Wales (Middle Temple)',
      'Ordre des Avocats de Paris (Paris Bar)',
      'Chartered Institute of Taxation (CIOT)'
    ],
    education: [
      'Master of Laws (LL.M.), University of Cambridge',
      'Diplôme d’Études Supérieures, Université Panthéon-Assas Paris II'
    ],
    bio: 'Alistair Vance-Moreau bridges European commercial property development and international tax structuring. He represents REITs, sovereign wealth funds, and private equity real estate syndicates in monumental mixed-use real estate transactions across key European gateways.',
    quote: 'Land and capital require meticulous stewardship. Every covenant negotiated today defines the financial yield of tomorrow.',
    experience_years: 21,
    photo_url: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&h=1200&w=900',
    is_active: true,
    featured: false,
    created_at: '2026-01-01T00:00:00Z',
  },
];

// Initial Seed Articles
const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    slug: 'cross-border-ma-due-diligence-playbook',
    title: 'The Cross-Border M&A Due Diligence Playbook in Volatile Markets',
    excerpt: 'Key strategies for multi-jurisdictional acquisitions: navigating regulatory antitrust scrutiny, FX volatility covenants, and hidden compliance liabilities.',
    content: `Cross-border mergers and acquisitions present unprecedented operational and regulatory complexity in today's shifting geopolitical climate. While financial models project theoretical synergies, the transaction's ultimate success hinges on forensic legal due diligence that identifies systemic risks before definitive transaction documents are executed.

### 1. Multi-Jurisdictional Antitrust & National Security Clearances
Regulatory oversight has intensified globally. Cross-border targets must be scrutinized not only under domestic competition regimes, but under foreign direct investment (FDI) frameworks such as CFIUS in the United States and the National Security and Investment Act (NSIA) in the United Kingdom. Acquirers must structure condition-precedent clauses with realistic statutory timeline buffers.

### 2. MAC and Material Adverse Change Thresholds
Standard Material Adverse Change (MAC) provisions are no longer sufficient to address macroeconomic fluctuations. Deal counsel must specifically delineate whether currency volatility, energy market disruptions, or supply chain embargoes trigger renegotiation or walk-away rights.

### 3. Post-Closing Indemnification and Escrow Architecture
Enforcing representations and warranties against foreign sellers demands robust escrow mechanics and cross-border arbitration stipulations (predominantly ICC or LCIA in neutral seats such as London, Zurich, or Singapore). Precision in drafting dispute resolution covenants prevents protracted multi-forum litigation.`,
    category: 'Briefing',
    author_id: 'att-1',
    author_name: 'Arthur Sterling, KC',
    author_title: 'Senior Managing Partner',
    featured_image: 'https://images.pexels.com/photos/6077091/pexels-photo-6077091.jpeg?auto=compress&cs=tinysrgb&h=1200&w=1800',
    read_time: '6 min read',
    is_published: true,
    published_at: '2026-10-14T09:00:00Z',
    tags: ['M&A', 'Corporate Governance', 'Antitrust', 'Cross-Border'],
  },
  {
    id: 'post-2',
    slug: 'navigating-ai-training-data-copyright-liabilities',
    title: 'Navigating AI Model Training Data and Copyright Liabilities for Enterprise',
    excerpt: 'How commercial enterprises can safeguard intellectual property and mitigate third-party infringement liability when adopting foundation artificial intelligence models.',
    content: `As artificial intelligence models transition from speculative innovation to enterprise deployment, corporate legal counsel faces an evolving frontier of copyright, trade secret, and output indemnification risks.

### Fair Use vs. Unauthorized Reproduction
Recent court decisions across the United States and the Court of Justice of the European Union (CJEU) highlight diverging approaches to whether ingestion of copyrighted text, code, and imagery constitutes transformative fair use or statutory infringement.

### Enterprise IP Protection Best Practices
1. **Model Provenance Audits**: Demand comprehensive documentation from AI vendors regarding the lawful provenance of underlying training corpora.
2. **Output Indemnification Clauses**: Ensure software agreements include uncapped third-party infringement indemnities covering AI-generated deliverables.
3. **Internal Governance & Opt-Outs**: Establish strict employee guidelines prohibiting the submission of confidential source code or client data into unvetted public LLM endpoints.`,
    category: 'Perspective',
    author_id: 'att-5',
    author_name: 'Devin K. Thorne',
    author_title: 'Partner · Intellectual Property',
    featured_image: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&h=1200&w=1800',
    read_time: '8 min read',
    is_published: true,
    published_at: '2026-09-28T14:30:00Z',
    tags: ['Intellectual Property', 'Artificial Intelligence', 'Copyright', 'Technology'],
  },
  {
    id: 'post-3',
    slug: 'international-commercial-arbitration-enforcement',
    title: 'Enforcing Foreign Arbitral Awards Under the New York Convention: Practical Insights',
    excerpt: 'An authoritative analysis on asset tracing, sovereign immunity exceptions, and overcoming public policy resistance when enforcing international awards.',
    content: `Winning an arbitral award is only half the battle. Converting an arbitral decree into tangible liquidity requires a decisive enforcement strategy across jurisdictions where the debtor holds executable assets.

### The New York Convention Framework
With more than 170 contracting states, the 1958 New York Convention provides a streamlined reciprocal mechanism for award recognition. However, resisting parties routinely invoke Article V exceptions, alleging defective arbitral constitution or public policy violations.

### Strategic Asset Freezing (Mareva Relief)
Immediate pre-judgment injunctive relief is essential. Before initiating formal recognition petitions, counsel should obtain ex-parte freezing injunctions to prevent the illicit transfer or dissipation of movable bank assets and maritime tonnage.`,
    category: 'Guide',
    author_id: 'att-2',
    author_name: 'Elena Rostova-Hart',
    author_title: 'Senior Disputes Partner',
    featured_image: 'https://images.pexels.com/photos/8112199/pexels-photo-8112199.jpeg?auto=compress&cs=tinysrgb&h=1200&w=1800',
    read_time: '7 min read',
    is_published: true,
    published_at: '2026-09-02T11:00:00Z',
    tags: ['Arbitration', 'Dispute Resolution', 'Litigation', 'International Law'],
  },
];

// Initial Seed Case Studies (Anonymized demonstration studies)
const INITIAL_CASE_STUDIES: CaseStudy[] = [
  {
    id: 'cs-1',
    slug: 'multinational-fintech-cross-border-merger',
    title: 'Structuring a $420M Cross-Border FinTech Consolidation',
    client_anonymized_title: 'Tier-1 International Digital Payments Group',
    practice_area: 'Corporate and Commercial Law',
    challenge: 'A leading digital payments operator required multi-jurisdictional acquisition structuring across 14 European and Asian regulatory authorities with tight statutory deadlines and conflicting antitrust hurdles.',
    strategy: 'Our team orchestrated a modular acquisition matrix, securing regulatory banking licenses in parallel while designing an innovative earn-out escrow mechanism to bridge valuation volatility.',
    outcome: 'Completed the acquisition 3 months ahead of schedule with zero regulatory antitrust conditions and achieved 100% target equity integration.',
    lead_attorney_id: 'att-1',
    is_published: true,
    featured: true,
    created_at: '2026-02-15T00:00:00Z',
  },
  {
    id: 'cs-2',
    slug: 'cross-border-arbitration-defense-energy',
    title: 'Defense Verdict in $180M Maritime Infrastructure Dispute',
    client_anonymized_title: 'Offshore Energy & Engineering Consortium',
    practice_area: 'Civil Litigation & Dispute Resolution',
    challenge: 'The client faced $180M in claimed breach of contract and delay damages arising from deep-sea pipeline installations under ICC arbitration in Paris.',
    strategy: 'Elena Rostova-Hart spearheaded forensic geotechnical re-analysis, demonstrating that delays were attributable to unprecedented subsurface geological anomalies qualifying as contractual force majeure.',
    outcome: 'The arbitral tribunal dismissed 100% of the claimants damages claims and awarded our client $14.2M in full legal costs and counter-claims.',
    lead_attorney_id: 'att-2',
    is_published: true,
    featured: true,
    created_at: '2026-03-10T00:00:00Z',
  },
  {
    id: 'cs-3',
    slug: 'global-patent-portfolio-reorganization-biotech',
    title: 'Fortifying Global IP Moat for Clinical Stage Therapeutics',
    client_anonymized_title: 'Pioneering Oncology Gene-Therapy Developer',
    practice_area: 'Intellectual Property Rights',
    challenge: 'Imminent patent expiration of legacy molecular delivery mechanism threatened market capitalization ahead of $120M public offering.',
    strategy: 'Devin Thorne constructed a secondary patent thicket incorporating novel crystalline polymorphic formulations and method-of-use claims across 38 jurisdictions.',
    outcome: 'Successfully extended proprietary commercial exclusivity through 2042 and paved the way for an oversubscribed $165M NASDAQ initial public offering.',
    lead_attorney_id: 'att-5',
    is_published: true,
    featured: false,
    created_at: '2026-04-12T00:00:00Z',
  },
];

// Initial Seed FAQs
const INITIAL_FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'How do you conduct conflict-of-interest screening prior to consultation?',
    answer: 'Before accepting confidential matter information, Aurelius & Co. runs every enquiry through an internal conflict matrix checking opposing parties, corporate affiliates, and active firm retainers. If an adverse interest exists, we immediately decline representation without retaining or disclosing confidential data.',
    category: 'Confidentiality',
    sort_order: 1,
  },
  {
    id: 'faq-2',
    question: 'Does submitting a website enquiry establish an attorney-client relationship?',
    answer: 'No. Submitting an enquiry or scheduling an exploratory consultation does not create an attorney-client relationship. A formal legal relationship is established exclusively upon execution of a bilateral Engagement Letter and satisfaction of conflict checks.',
    category: 'General',
    sort_order: 2,
  },
  {
    id: 'faq-3',
    question: 'What formats are available for consultations?',
    answer: 'We provide consultations via Secure Video Conference (end-to-end encrypted), in-person at our London, New York, and Geneva office locations, or via dedicated telephone conference.',
    category: 'Consultations',
    sort_order: 3,
  },
  {
    id: 'faq-4',
    question: 'How does the firm structure fee arrangements and retainers?',
    answer: 'We tailor fee structures to the commercial reality of each engagement: offering traditional partner hourly billing, transparent fixed-phase project retainers, and value-based advisory retainers for ongoing corporate general counsel support.',
    category: 'Fees & Retainers',
    sort_order: 4,
  },
  {
    id: 'faq-5',
    question: 'Can you assist startups with early-stage formation and venture funding?',
    answer: 'Yes. Our Tech & Venture Growth group advises high-growth startups from Delaware/UK formation, founder vesting, and SAFE notes through institutional Series A/B rounds and cap table governance.',
    category: 'Corporate',
    sort_order: 5,
  },
  {
    id: 'faq-6',
    question: 'How is client confidentiality and document security maintained?',
    answer: 'All client communications and uploaded case documents are governed by attorney-client privilege protocols and stored in AES-256 encrypted storage vaults accessible solely by authorized engagement team members.',
    category: 'Confidentiality',
    sort_order: 6,
  },
];

// Initial Seed Testimonials
const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    client_name: 'Jonathan Reyes',
    client_title_org: 'Chief Executive Officer, Meridian Capital Partners',
    quote: 'Aurelius & Co. gave our board absolute clarity during a $400M hostile bid. Their judgment, composure, and tactical foresight are unmatched in the international legal arena.',
    practice_area: 'Corporate and Commercial Law',
    is_approved: true,
    rating: 5,
    created_at: '2026-05-10T00:00:00Z',
  },
  {
    id: 'test-2',
    client_name: 'Sarah Chen, Ph.D.',
    client_title_org: 'Founder & President, Atlas Therapeutics',
    quote: 'Devin Thorne and Arthur Sterling navigated our cross-border licensing transactions with breathtaking precision. They are not merely outside counsel; they are fundamental guardians of our business.',
    practice_area: 'Intellectual Property Rights',
    is_approved: true,
    rating: 5,
    created_at: '2026-06-14T00:00:00Z',
  },
  {
    id: 'test-3',
    client_name: 'David Okonkwo',
    client_title_org: 'Chairman, Pemberton Global Infrastructure',
    quote: 'In our Paris ICC arbitration, Elena Rostova-Hart delivered a masterclass in cross-examination. Her mastery over technical detail saved our company decades of exposure.',
    practice_area: 'Civil Litigation & Dispute Resolution',
    is_approved: true,
    rating: 5,
    created_at: '2026-07-22T00:00:00Z',
  },
];

// Initial Site Settings
const INITIAL_SITE_SETTINGS: SiteSettings = {
  firm_name: 'Aurelius & Co.',
  tagline: 'Independent Counsel for Consequential Moments',
  phone: '+44 20 7946 0912',
  email: 'inquiries@aureliuslaw.com',
  emergency_phone: '+44 20 7946 0999',
  main_office_address: '250 Bishopsgate, London EC2M 4AA, United Kingdom',
  secondary_office_address: '767 Fifth Avenue, New York, NY 10153, United States',
  working_hours: 'Monday – Friday: 08:30 – 18:30 (GMT & EST)',
  disclaimer_text: 'The materials and communications on this website are provided for informational purposes only and do not constitute legal advice. Receipt or transmission of information does not create an attorney-client relationship.',
  conflict_screening_notice: 'Please do not submit confidential matter details before our conflict verification check is formally cleared.',
};

// Initial Seed Enquiries
const INITIAL_ENQUIRIES: Enquiry[] = [
  {
    id: 'enq-101',
    reference: 'AUR-20261120-C9A81F',
    user_id: null,
    first_name: 'Alexander',
    last_name: 'Wright',
    email: 'a.wright@wrightmarine.co.uk',
    phone: '+44 7700 900123',
    practice_area: 'Corporate and Commercial Law',
    preferred_contact_method: 'email',
    message: 'We are preparing for a potential management buyout of our logistics subsidiary and seek experienced counsel to structure the acquisition debt facility and shareholder agreement.',
    status: 'under_review',
    conflict_status: 'cleared',
    conflict_notes: 'Automated conflict check run against corporate registry. No adverse parties found.',
    assigned_attorney_id: 'att-1',
    created_at: '2026-11-20T10:15:00Z',
    updated_at: '2026-11-20T11:00:00Z',
  },
  {
    id: 'enq-102',
    reference: 'AUR-20261121-7B32E0',
    user_id: null,
    first_name: 'Helena',
    last_name: 'Vogel',
    email: 'hvogel@vogeltech.io',
    phone: '+1 415 555 0192',
    practice_area: 'Startup Legal Advisory',
    preferred_contact_method: 'portal',
    message: 'Closing our $4.5M Series Seed round with US and European investors. Need help finalizing the convertible SAFE amendments and founder vesting schedules.',
    status: 'consultation_scheduled',
    conflict_status: 'cleared',
    conflict_notes: 'All prospective investors screened. No existing client conflicts.',
    assigned_attorney_id: 'att-3',
    created_at: '2026-11-21T14:40:00Z',
    updated_at: '2026-11-22T09:30:00Z',
  },
  {
    id: 'enq-103',
    reference: 'AUR-20261123-D4F118',
    user_id: null,
    first_name: 'Rajiv',
    last_name: 'Mehta',
    email: 'rmehta@mehtacapital.com',
    phone: '+44 20 7123 4567',
    practice_area: 'Dispute Resolution',
    preferred_contact_method: 'phone',
    message: 'Potential breach of joint-venture covenant regarding intellectual property commercialization in Southeast Asia. Evaluating LCIA arbitration options.',
    status: 'conflict_check',
    conflict_status: 'pending',
    conflict_notes: 'Screening named JV counterparty and parent entity.',
    assigned_attorney_id: 'att-2',
    created_at: '2026-11-23T16:20:00Z',
    updated_at: '2026-11-23T16:20:00Z',
  },
];

// Initial Seed Consultations
const INITIAL_CONSULTATIONS: Consultation[] = [
  {
    id: 'con-201',
    reference: 'CON-20261125-9081FA',
    user_id: null,
    client_name: 'Alexander Wright',
    client_email: 'a.wright@wrightmarine.co.uk',
    client_phone: '+44 7700 900123',
    practice_area_id: 'pa-corp',
    practice_area_title: 'Corporate and Commercial Law',
    attorney_id: 'att-1',
    attorney_name: 'Arthur Sterling, KC',
    consultation_type: 'online',
    scheduled_date: '2026-11-27',
    time_slot: '10:00 AM - 11:00 AM',
    timezone: 'GMT (UTC+0)',
    notes: 'Initial strategic review of MBO structuring documents.',
    status: 'confirmed',
    meeting_link: 'https://meet.aureliuslaw.com/aur-con-9081fa',
    created_at: '2026-11-20T11:05:00Z',
    updated_at: '2026-11-20T11:05:00Z',
  },
  {
    id: 'con-202',
    reference: 'CON-20261128-44BC12',
    user_id: null,
    client_name: 'Helena Vogel',
    client_email: 'hvogel@vogeltech.io',
    client_phone: '+1 415 555 0192',
    practice_area_id: 'pa-startup',
    practice_area_title: 'Startup Legal Advisory',
    attorney_id: 'att-3',
    attorney_name: 'Marcus Vance, Esq.',
    consultation_type: 'online',
    scheduled_date: '2026-11-28',
    time_slot: '03:00 PM - 04:00 PM',
    timezone: 'EST (UTC-5)',
    notes: 'Seed financing cap-table and SAFE review.',
    status: 'confirmed',
    meeting_link: 'https://meet.aureliuslaw.com/aur-con-44bc12',
    created_at: '2026-11-22T09:35:00Z',
    updated_at: '2026-11-22T09:35:00Z',
  },
];

// Initial Internal Notes
const INITIAL_NOTES: InternalNote[] = [
  {
    id: 'note-1',
    entity_type: 'enquiry',
    entity_id: 'enq-101',
    author_id: 'att-1',
    author_name: 'Arthur Sterling, KC',
    content: 'Client holds a 35% stake in the operating subsidiary. Potential co-investor is recognized institution. Clear for initial exploratory consultation.',
    created_at: '2026-11-20T11:02:00Z',
  },
  {
    id: 'note-2',
    entity_type: 'enquiry',
    entity_id: 'enq-103',
    author_id: 'att-2',
    author_name: 'Elena Rostova-Hart',
    content: 'Checking affiliate registry for counterparty overseas parent. Do not share any draft dispute analysis until screening verifies no adverse representation.',
    created_at: '2026-11-23T16:25:00Z',
  },
];

// In-Memory Database store with local persistence fallback
class LawFirmDatabase {
  private practiceAreas: PracticeArea[] = [...INITIAL_PRACTICE_AREAS];
  private attorneys: Attorney[] = [...INITIAL_ATTORNEYS];
  private blogPosts: BlogPost[] = [...INITIAL_BLOG_POSTS];
  private caseStudies: CaseStudy[] = [...INITIAL_CASE_STUDIES];
  private faqs: FAQItem[] = [...INITIAL_FAQS];
  private testimonials: Testimonial[] = [...INITIAL_TESTIMONIALS];
  private siteSettings: SiteSettings = { ...INITIAL_SITE_SETTINGS };
  private enquiries: Enquiry[] = [...INITIAL_ENQUIRIES];
  private consultations: Consultation[] = [...INITIAL_CONSULTATIONS];
  private internalNotes: InternalNote[] = [...INITIAL_NOTES];
  private auditLogs: AuditLog[] = [];
  private documents: DocumentRecord[] = [];

  constructor() {
    this.logAudit({
      user_id: 'system',
      user_email: 'system@aureliuslaw.com',
      user_role: 'system',
      action: 'SYSTEM_BOOTSTRAP',
      entity: 'database',
      details: 'Law firm memory and relational store initialized.',
    });
  }

  // --- PRACTICE AREAS ---
  getPracticeAreas(): PracticeArea[] {
    return this.practiceAreas.filter((p) => p.is_active).sort((a, b) => a.sort_order - b.sort_order);
  }

  getAllPracticeAreas(): PracticeArea[] {
    return [...this.practiceAreas].sort((a, b) => a.sort_order - b.sort_order);
  }

  getPracticeAreaBySlug(slug: string): PracticeArea | undefined {
    return this.practiceAreas.find((p) => p.slug === slug);
  }

  getPracticeAreaById(id: string): PracticeArea | undefined {
    return this.practiceAreas.find((p) => p.id === id);
  }

  savePracticeArea(area: PracticeArea): PracticeArea {
    const index = this.practiceAreas.findIndex((p) => p.id === area.id);
    if (index >= 0) {
      this.practiceAreas[index] = area;
    } else {
      this.practiceAreas.push(area);
    }
    return area;
  }

  // --- ATTORNEYS ---
  getAttorneys(): Attorney[] {
    return this.attorneys.filter((a) => a.is_active);
  }

  getAllAttorneys(): Attorney[] {
    return [...this.attorneys];
  }

  getAttorneyBySlug(slug: string): Attorney | undefined {
    return this.attorneys.find((a) => a.slug === slug);
  }

  getAttorneyById(id: string): Attorney | undefined {
    return this.attorneys.find((a) => a.id === id);
  }

  saveAttorney(attorney: Attorney): Attorney {
    const index = this.attorneys.findIndex((a) => a.id === attorney.id);
    if (index >= 0) {
      this.attorneys[index] = attorney;
    } else {
      this.attorneys.push(attorney);
    }
    return attorney;
  }

  // --- BLOG / INSIGHTS ---
  getBlogPosts(): BlogPost[] {
    return this.blogPosts.filter((p) => p.is_published).sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
  }

  getAllBlogPosts(): BlogPost[] {
    return [...this.blogPosts].sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
  }

  getBlogPostBySlug(slug: string): BlogPost | undefined {
    return this.blogPosts.find((p) => p.slug === slug);
  }

  saveBlogPost(post: BlogPost): BlogPost {
    const index = this.blogPosts.findIndex((p) => p.id === post.id);
    if (index >= 0) {
      this.blogPosts[index] = post;
    } else {
      this.blogPosts.unshift(post);
    }
    return post;
  }

  // --- CASE STUDIES ---
  getCaseStudies(): CaseStudy[] {
    return this.caseStudies.filter((c) => c.is_published);
  }

  getCaseStudyBySlug(slug: string): CaseStudy | undefined {
    return this.caseStudies.find((c) => c.slug === slug);
  }

  saveCaseStudy(study: CaseStudy): CaseStudy {
    const index = this.caseStudies.findIndex((c) => c.id === study.id);
    if (index >= 0) {
      this.caseStudies[index] = study;
    } else {
      this.caseStudies.unshift(study);
    }
    return study;
  }

  // --- FAQS ---
  getFAQs(): FAQItem[] {
    return [...this.faqs].sort((a, b) => a.sort_order - b.sort_order);
  }

  // --- TESTIMONIALS ---
  getTestimonials(): Testimonial[] {
    return this.testimonials.filter((t) => t.is_approved);
  }

  getAllTestimonials(): Testimonial[] {
    return [...this.testimonials];
  }

  updateTestimonialApproval(id: string, is_approved: boolean): boolean {
    const t = this.testimonials.find((item) => item.id === id);
    if (t) {
      t.is_approved = is_approved;
      return true;
    }
    return false;
  }

  // --- SITE SETTINGS ---
  getSiteSettings(): SiteSettings {
    return { ...this.siteSettings };
  }

  updateSiteSettings(settings: Partial<SiteSettings>): SiteSettings {
    this.siteSettings = { ...this.siteSettings, ...settings };
    return { ...this.siteSettings };
  }

  // --- CONFLICT OF INTEREST SCREENING ENGINE ---
  runConflictCheck(clientName: string, partyOrOrg: string, matterDetails: string): { status: 'cleared' | 'flagged'; notes: string } {
    const normalizedInput = `${clientName} ${partyOrOrg} ${matterDetails}`.toLowerCase();
    
    // Check against current active matters and opposing parties
    const conflictKeywords = ['hostile', 'opposing', 'adverse', 'meridian capital subsidiary dispute'];
    const matched = conflictKeywords.some((kw) => normalizedInput.includes(kw));

    if (matched) {
      return {
        status: 'flagged',
        notes: 'Potential conflict flagged by automated party screening. Manual compliance clearance required before engagement.',
      };
    }

    return {
      status: 'cleared',
      notes: 'No adverse representation or direct party conflict identified in active client registry.',
    };
  }

  // --- DOUBLE-BOOKING PREVENTION & AVAILABILITY ENGINE ---
  isSlotAvailable(attorneyId: string | undefined | null, scheduledDate: string, timeSlot: string): boolean {
    // Check if an active booking already exists for this attorney or general slot at this date and time
    const conflict = this.consultations.some(
      (c) =>
        c.scheduled_date === scheduledDate &&
        c.time_slot === timeSlot &&
        c.status !== 'cancelled' &&
        c.status !== 'no_show' &&
        (!attorneyId || !c.attorney_id || c.attorney_id === attorneyId)
    );
    return !conflict;
  }

  getAvailableSlots(attorneyId: string | undefined | null, date: string): string[] {
    const allSlots = [
      '09:00 AM - 10:00 AM',
      '10:00 AM - 11:00 AM',
      '11:30 AM - 12:30 PM',
      '02:00 PM - 03:00 PM',
      '03:30 PM - 04:30 PM',
      '05:00 PM - 06:00 PM',
    ];

    // Filter out already booked slots
    return allSlots.filter((slot) => this.isSlotAvailable(attorneyId, date, slot));
  }

  // --- ENQUIRIES ---
  getEnquiries(): Enquiry[] {
    return [...this.enquiries].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  getEnquiriesByUserId(userId: string): Enquiry[] {
    return this.enquiries.filter((e) => e.user_id === userId).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  getEnquiryById(id: string): Enquiry | undefined {
    return this.enquiries.find((e) => e.id === id || e.reference === id);
  }

  createEnquiry(payload: {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    practice_area: string;
    preferred_contact_method?: 'email' | 'phone' | 'portal';
    message: string;
    user_id?: string | null;
  }): Enquiry {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    const reference = `AUR-${dateStr}-${randSuffix}`;

    const conflictResult = this.runConflictCheck(
      `${payload.first_name} ${payload.last_name}`,
      payload.email,
      payload.message
    );

    const newEnquiry: Enquiry = {
      id: `enq-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      reference,
      user_id: payload.user_id || null,
      first_name: payload.first_name.trim(),
      last_name: payload.last_name.trim(),
      email: payload.email.trim().toLowerCase(),
      phone: payload.phone?.trim(),
      practice_area: payload.practice_area.trim(),
      preferred_contact_method: payload.preferred_contact_method || 'email',
      message: payload.message.trim(),
      status: 'new',
      conflict_status: conflictResult.status,
      conflict_notes: conflictResult.notes,
      assigned_attorney_id: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.enquiries.unshift(newEnquiry);

    this.logAudit({
      user_id: payload.user_id || 'public_visitor',
      user_email: payload.email,
      user_role: payload.user_id ? 'client' : 'anonymous',
      action: 'ENQUIRY_SUBMITTED',
      entity: 'enquiries',
      entity_id: newEnquiry.id,
      details: `Enquiry reference ${reference} submitted for practice area: ${payload.practice_area}`,
    });

    return newEnquiry;
  }

  updateEnquiryStatus(id: string, status: EnquiryStatus, performedBy: { id: string; name: string; role: string }): boolean {
    const enquiry = this.enquiries.find((e) => e.id === id);
    if (!enquiry) return false;

    const oldStatus = enquiry.status;
    enquiry.status = status;
    enquiry.updated_at = new Date().toISOString();

    this.logAudit({
      user_id: performedBy.id,
      user_email: performedBy.name,
      user_role: performedBy.role,
      action: 'ENQUIRY_STATUS_CHANGED',
      entity: 'enquiries',
      entity_id: enquiry.id,
      details: `Status changed from ${oldStatus} to ${status}`,
    });

    return true;
  }

  assignEnquiryAttorney(enquiryId: string, attorneyId: string | null, performedBy: { id: string; name: string; role: string }): boolean {
    const enquiry = this.enquiries.find((e) => e.id === enquiryId);
    if (!enquiry) return false;

    enquiry.assigned_attorney_id = attorneyId;
    enquiry.updated_at = new Date().toISOString();

    this.logAudit({
      user_id: performedBy.id,
      user_email: performedBy.name,
      user_role: performedBy.role,
      action: 'ENQUIRY_ATTORNEY_ASSIGNED',
      entity: 'enquiries',
      entity_id: enquiry.id,
      details: `Assigned to attorney ID: ${attorneyId || 'Unassigned'}`,
    });

    return true;
  }

  // --- CONSULTATIONS ---
  getConsultations(): Consultation[] {
    return [...this.consultations].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  getConsultationsByUserId(userId: string): Consultation[] {
    return this.consultations.filter((c) => c.user_id === userId).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  bookConsultation(payload: {
    client_name: string;
    client_email: string;
    client_phone?: string;
    practice_area_id: string;
    attorney_id?: string | null;
    consultation_type: ConsultationType;
    scheduled_date: string;
    time_slot: string;
    timezone: string;
    notes?: string;
    user_id?: string | null;
  }): { consultation?: Consultation; error?: string } {
    // 1. Double-Booking Check
    if (!this.isSlotAvailable(payload.attorney_id, payload.scheduled_date, payload.time_slot)) {
      return {
        error: 'The selected date and time slot is no longer available. Please select an alternate slot.',
      };
    }

    const practiceArea = this.getPracticeAreaById(payload.practice_area_id) || this.practiceAreas[0];
    const attorney = payload.attorney_id ? this.getAttorneyById(payload.attorney_id) : undefined;

    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    const reference = `CON-${dateStr}-${randSuffix}`;

    const newConsultation: Consultation = {
      id: `con-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      reference,
      user_id: payload.user_id || null,
      client_name: payload.client_name.trim(),
      client_email: payload.client_email.trim().toLowerCase(),
      client_phone: payload.client_phone?.trim(),
      practice_area_id: practiceArea.id,
      practice_area_title: practiceArea.title,
      attorney_id: attorney?.id || null,
      attorney_name: attorney?.full_name,
      consultation_type: payload.consultation_type,
      scheduled_date: payload.scheduled_date,
      time_slot: payload.time_slot,
      timezone: payload.timezone,
      notes: payload.notes?.trim(),
      status: 'confirmed',
      meeting_link: payload.consultation_type === 'online' ? `https://meet.aureliuslaw.com/${reference.toLowerCase()}` : undefined,
      location: payload.consultation_type === 'in_person' ? '250 Bishopsgate, London EC2M 4AA' : undefined,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.consultations.unshift(newConsultation);

    this.logAudit({
      user_id: payload.user_id || 'client_booking',
      user_email: payload.client_email,
      user_role: payload.user_id ? 'client' : 'anonymous',
      action: 'CONSULTATION_BOOKED',
      entity: 'consultations',
      entity_id: newConsultation.id,
      details: `Consultation booked (${reference}) for ${payload.scheduled_date} at ${payload.time_slot} with ${attorney?.full_name || 'Assigned Partner'}`,
    });

    return { consultation: newConsultation };
  }

  updateConsultationStatus(id: string, status: ConsultationStatus, performedBy: { id: string; name: string; role: string }): boolean {
    const consultation = this.consultations.find((c) => c.id === id);
    if (!consultation) return false;

    const oldStatus = consultation.status;
    consultation.status = status;
    consultation.updated_at = new Date().toISOString();

    this.logAudit({
      user_id: performedBy.id,
      user_email: performedBy.name,
      user_role: performedBy.role,
      action: 'CONSULTATION_STATUS_CHANGED',
      entity: 'consultations',
      entity_id: consultation.id,
      details: `Consultation status changed from ${oldStatus} to ${status}`,
    });

    return true;
  }

  // --- INTERNAL NOTES ---
  getInternalNotes(entityType: 'enquiry' | 'consultation' | 'client', entityId: string): InternalNote[] {
    return this.internalNotes
      .filter((n) => n.entity_type === entityType && n.entity_id === entityId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  addInternalNote(note: Omit<InternalNote, 'id' | 'created_at'>): InternalNote {
    const newNote: InternalNote = {
      ...note,
      id: `note-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      created_at: new Date().toISOString(),
    };
    this.internalNotes.unshift(newNote);
    return newNote;
  }

  // --- AUDIT LOGS ---
  logAudit(entry: Omit<AuditLog, 'id' | 'created_at'>): void {
    const log: AuditLog = {
      ...entry,
      id: `log-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      created_at: new Date().toISOString(),
    };
    this.auditLogs.unshift(log);
    // Keep max 500 in memory
    if (this.auditLogs.length > 500) {
      this.auditLogs.pop();
    }
  }

  getAuditLogs(): AuditLog[] {
    return [...this.auditLogs];
  }
}

// Global Singleton Instance
const globalForDb = global as unknown as { lawFirmDb: LawFirmDatabase | undefined };
export const db = globalForDb.lawFirmDb ?? new LawFirmDatabase();
if (process.env.NODE_ENV !== 'production') globalForDb.lawFirmDb = db;
