import type { User, Startup, Investor, Thread, Channel, Notice, VEvent, Track, Scheme, News, Faq, Audit, Flag } from './types';
import { MIN, HOUR, DAY } from './format';

const now = Date.now();

/* ------------------------------------------------------------------ users */
export const seedUsers: User[] = [
  { id: 'u-founder', name: 'Aarav Mehta', email: 'aarav@nexaflow.in', passHash: 'seed:founder123', role: 'founder', verified: true, mfa: false, status: 'active', phone: '+91 98220 44117', company: 'Nexaflow', title: 'Co-founder & CEO', location: 'Bengaluru', hue: 36, createdAt: now - 210 * DAY, onboarded: true },
  { id: 'u-investor', name: 'Meera Krishnan', email: 'meera@ardentpeak.vc', passHash: 'seed:investor123', role: 'investor', verified: true, mfa: false, status: 'active', phone: '+91 99870 22014', company: 'Ardent Peak Capital', title: 'Partner', location: 'Mumbai', hue: 232, createdAt: now - 420 * DAY, onboarded: true, investorProfileId: 'inv-1' },
  { id: 'u-admin', name: 'Platform Ops', email: 'admin@venturesetu.in', passHash: 'seed:admin123', role: 'admin', verified: true, mfa: true, status: 'active', company: 'VentureSetu', title: 'Trust & Safety', location: 'Gurugram', hue: 348, createdAt: now - 500 * DAY, onboarded: true },
];

/* --------------------------------------------------------------- startups */
const M12 = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'];

export const seedStartups: Startup[] = [
  {
    id: 'st-own', ownerId: 'u-founder', name: 'Nexaflow', tagline: 'Workflow automation for modern finance teams',
    sector: 'SaaS', stage: 'Seed', location: 'Bengaluru', founded: 2023, team: 14,
    pitch: 'Nexaflow automates accounts-payable, reconciliation and audit-trail workflows for mid-market finance teams, cutting month-end close from 9 days to 36 hours.',
    problem: 'Indian mid-market finance teams lose 220+ person-hours every month reconciling invoices across ERPs, WhatsApp approvals and spreadsheets. Errors trigger statutory penalties and audit qualifications.',
    solution: 'A no-code workflow layer that sits on top of Tally, SAP and Zoho — capturing invoices, routing approvals by policy, and auto-reconciling with bank feeds. AI agents flag anomalies before auditors do.',
    market: '1.4M registered mid-market firms in India; SAM of ₹4,800 Cr for finance-automation SaaS growing 28% YoY. Wedge: manufacturing & logistics clusters in South India.',
    model: 'B2B SaaS — ₹14,000–₹65,000/month tiered by invoice volume. 92% gross margin. Land with AP automation, expand into close-management and vendor payments.',
    founder: {
      name: 'Aarav Mehta', title: 'Co-founder & CEO',
      bio: 'Second-time founder. Previously built payments infra at Razorpay (4 yrs) and led ops automation at a Sequoia-backed logistics startup. CA dropout turned engineer.',
      qualifications: ['B.Tech, IIT Madras', 'Razorpay — Payments Infra (2016–2020)', 'Y Combinator S23 alum', 'Scaled prior team 6 → 40'],
      experience: ['4 yrs — fintech infrastructure', '3 yrs — B2B SaaS GTM', '1 exit-adjacent acquisition experience'],
    },
    askL: 300, equityPct: 12, raisedL: 50,
    cashL: 132, burnL: 10.2, revenueL: 20.1, prevRevenueL: 18.4,
    revSeries: [6.5, 7.2, 8.1, 9.4, 10.2, 11.8, 12.6, 14.1, 15.5, 16.9, 18.4, 20.1],
    burnSeries: [14, 13.5, 13, 12.5, 12, 12, 11.5, 11.5, 11, 11, 10.5, 10.2],
    months: M12,
    cac: 42000, ltv: 385000, growthPct: 9.2,
    traction: [
      { label: 'MRR', value: '₹20.1 L', delta: '+9.2% MoM' },
      { label: 'Paying customers', value: '61', delta: '+7 this month' },
      { label: 'Net revenue retention', value: '118%' },
      { label: 'Logo churn (90d)', value: '1.1%' },
    ],
    highlights: ['YC S23', 'Economic Times "Startup to Watch"', 'ISO 27001', '2 enterprise pilots converting'],
    tags: ['workflow-automation', 'finance-ops', 'b2b-saas', 'reconciliation'],
    milestones: [
      { id: 'ms-1', label: 'Pre-seed closed', detail: 'Angels + micro-VC', amountL: 50, date: 'Mar 2024', status: 'done', progress: 100 },
      { id: 'ms-2', label: 'MVP + first 10 customers', detail: 'AP automation GA', date: 'Aug 2024', status: 'done', progress: 100 },
      { id: 'ms-3', label: '₹15 L MRR', detail: 'Crossed in Dec — 61 logos', date: 'Dec 2024', status: 'done', progress: 100 },
      { id: 'ms-4', label: 'Seed round — ₹3 Cr', detail: 'Term-sheet conversations with 3 funds', amountL: 300, date: 'Apr 2025', status: 'active', progress: 62 },
      { id: 'ms-5', label: '₹1 Cr ARR', detail: 'Implied by current growth by Jun 2025', date: 'Jun 2025', status: 'upcoming', progress: 24 },
      { id: 'ms-6', label: 'Series A readiness', detail: '₹3 Cr ARR + 120% NRR', date: 'Q1 2026', status: 'upcoming', progress: 8 },
    ],
    deck: { name: 'Nexaflow_Seed_Deck_v7.pdf', pages: 14, sizeKB: 4820, updatedAt: now - 6 * DAY, sharedWith: ['inv-1'] },
    readiness: 78, hue: 36,
  },
  {
    id: 'st-2', ownerId: 'u-fin', name: 'FinEdge', tagline: 'UPI-native credit rails for kirana stores',
    sector: 'Fintech', stage: 'Series A', location: 'Mumbai', founded: 2021, team: 38,
    pitch: 'FinEdge underwrites micro-working-capital for kiranas using UPI cash-flow data — ₹12,400 Cr disbursed lifetime with 2.1% NPA.',
    problem: '68M small retailers are invisible to formal credit; banks demand collateal kiranas cannot offer.',
    solution: 'Cash-flow-based scoring on UPI + GST data; 7-minute disbursal of ₹25K–₹5L ticket loans via partner NBFCs.',
    market: '₹20 Lakh Cr MSME credit gap; kirana-first wedge expanding to 6 retail categories.',
    model: '1.8% FLDG-linked take-rate + SaaS ledger subscription.',
    founder: { name: 'Ishita Rao', title: 'Co-founder & CEO', bio: 'Ex-Paytm lending PM; IIT-B + ISB.', qualifications: ['IIT Bombay', 'ISB Hyderabad', 'Ex-Paytm', 'RBI fintech cohort'], experience: ['7 yrs lending', '2 exits in team'] },
    askL: 1200, equityPct: 9, raisedL: 850,
    cashL: 610, burnL: 38, revenueL: 96, prevRevenueL: 84,
    revSeries: [22, 26, 31, 35, 44, 52, 58, 66, 74, 84, 90, 96],
    burnSeries: [46, 44, 44, 42, 41, 40, 40, 39, 39, 38, 38, 38],
    months: M12, cac: 940, ltv: 14800, growthPct: 14,
    traction: [{ label: 'Lifetime disbursal', value: '₹12,400 Cr' }, { label: 'NPA', value: '2.1%', delta: '-40bps' }, { label: 'Active kiranas', value: '2.9 L' }],
    highlights: ['RBI Innovation Hub cohort', 'NBFC partnerships ×4'], tags: ['lending', 'upi', 'msme'],
    milestones: [{ id: 'ms-f1', label: 'Series B', detail: 'Targeting ₹90 Cr', amountL: 9000, date: 'Q3 2025', status: 'active', progress: 40 }],
    deck: { name: 'FinEdge_SeriesA.pdf', pages: 18, sizeKB: 6140, updatedAt: now - 12 * DAY, sharedWith: ['inv-1'] },
    readiness: 88, hue: 210,
  },
  {
    id: 'st-3', ownerId: 'u-mq', name: 'MediQuick', tagline: '15-minute teleconsult layer for Tier-2/3 India',
    sector: 'HealthTech', stage: 'Seed', location: 'Hyderabad', founded: 2022, team: 21,
    pitch: 'Vernacular-first telemedicine with a phygital pharmacy network — 4.2L consultations completed across 3 states.',
    problem: 'Tier-2/3 towns have 1 doctor per 11,000 people; access, not awareness, is the bottleneck.',
    solution: 'Async-first consults in 9 languages, local pharmacy fulfilment in under 4 hours, AI triage that routes 62% of cases without a doctor touch.',
    market: '₹36,000 Cr telehealth TAM by 2027; 640M vernacular internet users.',
    model: '₹149 consult margin + pharmacy commission + employer plans.',
    founder: { name: 'Dr. Nisha Verma', title: 'Founder & CEO', bio: 'ER physician for 9 years; built tele-triage for 2 state missions.', qualifications: ['MBBS, AIIMS Delhi', 'MD Emergency Medicine', 'WHO digital-health fellow'], experience: ['9 yrs clinical', '3 state health missions'] },
    askL: 450, equityPct: 11, raisedL: 120,
    cashL: 240, burnL: 16, revenueL: 11.5, prevRevenueL: 9.8,
    revSeries: [2.1, 2.6, 3.2, 4.0, 4.6, 5.5, 6.4, 7.3, 8.4, 9.2, 9.8, 11.5],
    burnSeries: [19, 19, 18.5, 18, 18, 17.5, 17, 17, 16.5, 16.5, 16, 16],
    months: M12, cac: 210, ltv: 2200, growthPct: 17,
    traction: [{ label: 'Consults completed', value: '4.2 L' }, { label: 'Repeat rate', value: '46%' }, { label: 'NPS', value: '71' }],
    highlights: ['State govt MoU ×2', 'ABDM integrated'], tags: ['telemedicine', 'vernacular', 'tier-3'],
    milestones: [{ id: 'ms-mq1', label: 'Seed extension', detail: '₹4.5 Cr to reach 3 new states', amountL: 450, date: 'May 2025', status: 'active', progress: 35 }],
    deck: { name: 'MediQuick_Seed.pdf', pages: 12, sizeKB: 3900, updatedAt: now - 3 * DAY, sharedWith: [] },
    readiness: 71, hue: 160,
  },
  {
    id: 'st-4', ownerId: 'u-ag', name: 'AgriSense', tagline: 'Precision irrigation intelligence from space + soil',
    sector: 'AgriTech', stage: 'Pre-Seed', location: 'Pune', founded: 2023, team: 8,
    pitch: 'Satellite + LoRa soil probes drive irrigation advisories that cut water use 31% across 18,000 pilot acres.',
    problem: 'Flood irrigation wastes 60% of water and drops yields; smallholders cannot afford agronomy.',
    solution: '₹4,900 probe + satellite fusion gives plot-level advisories on WhatsApp in Marathi, Hindi, Kannada.',
    market: '140M ha of cropped land; irrigation-tech SAM ₹7,200 Cr.',
    model: 'Hardware at cost + ₹999/acre/yr advisory subscription; FPO channel partnerships.',
    founder: { name: 'Kabir Chawla', title: 'Co-founder', bio: 'Remote-sensing researcher, ex-ISRO DSL contract projects.', qualifications: ['M.Tech Remote Sensing, IIT-Kgp'], experience: ['5 yrs agri-IoT'] },
    askL: 180, equityPct: 10, raisedL: 25,
    cashL: 86, burnL: 7.4, revenueL: 2.8, prevRevenueL: 2.1,
    revSeries: [0.4, 0.6, 0.8, 1.1, 1.4, 1.7, 1.9, 2.2, 2.4, 2.6, 2.1, 2.8],
    burnSeries: [8.2, 8.2, 8, 8, 7.8, 7.8, 7.6, 7.6, 7.5, 7.5, 7.4, 7.4],
    months: M12, growthPct: 33,
    traction: [{ label: 'Pilot acres', value: '18,000' }, { label: 'Water saved', value: '31%' }, { label: 'FPO partners', value: '14' }],
    highlights: ['NASSCOM AgriTech 10K', 'CIBIL-ag pilot'], tags: ['iot', 'satellite', 'smallholder'],
    milestones: [{ id: 'ms-ag1', label: 'Pre-seed close', detail: '₹1.8 Cr — hardware scale-up', amountL: 180, date: 'Apr 2025', status: 'active', progress: 55 }],
    deck: { name: 'AgriSense_PreSeed.pdf', pages: 11, sizeKB: 2800, updatedAt: now - 9 * DAY, sharedWith: [] },
    readiness: 64, hue: 96,
  },
  {
    id: 'st-5', ownerId: 'u-ed', name: 'Edumentor', tagline: 'Vernacular upskilling for India\'s 40M frontline workers',
    sector: 'EdTech', stage: 'Seed', location: 'Delhi NCR', founded: 2022, team: 17,
    pitch: 'WhatsApp-native micro-courses for frontline sales & service roles — 78% completion vs 7% industry norm.',
    problem: 'Frontline staff churn at 8%/month; classroom training doesn\'t fit field jobs and English-first content excludes 90%.',
    solution: 'AI-personalised 5-minute vernacular lessons, voice assessments, manager dashboards with skill heatmaps.',
    market: '₹22,000 Cr corporate skilling; 40M frontline workers in retail, BFSI, logistics.',
    model: '₹180/learner/month B2B2C + certification fees; enterprise dashboards ₹40K/mo.',
    founder: { name: 'Tanya Sethi', title: 'Founder & CEO', bio: 'Built learning ops at Swiggy for 60K delivery partners.', qualifications: ['BITS Pilani', 'Ex-Swiggy L&D lead'], experience: ['8 yrs L&D', '2 lan. NLP papers'] },
    askL: 350, equityPct: 12, raisedL: 90,
    cashL: 175, burnL: 12.8, revenueL: 9.6, prevRevenueL: 8.4,
    revSeries: [1.9, 2.3, 2.8, 3.4, 4.1, 4.9, 5.6, 6.5, 7.2, 8.0, 8.4, 9.6],
    burnSeries: [15, 14.6, 14.4, 14, 13.8, 13.6, 13.4, 13.2, 13.1, 13, 12.8, 12.8],
    months: M12, cac: 26000, ltv: 410000, growthPct: 14,
    traction: [{ label: 'Learners/month', value: '82,400' }, { label: 'Completion', value: '78%' }, { label: 'Enterprise logos', value: '23', delta: '+5' }],
    highlights: ['Google AI grant', '2 unicorns as clients'], tags: ['skilling', 'whatsapp', 'vernacular'],
    milestones: [{ id: 'ms-ed1', label: 'Seed+ close', detail: '₹3.5 Cr — BFSI expansion', amountL: 350, date: 'Jun 2025', status: 'active', progress: 30 }],
    readiness: 74, hue: 268,
  },
  {
    id: 'st-6', ownerId: 'u-gg', name: 'GreenGrid', tagline: 'Charging OS for India\'s EV fleets',
    sector: 'Climate', stage: 'Series A', location: 'Chennai', founded: 2020, team: 44,
    pitch: 'Load-balancing software + managed charging hubs already serving 1,900 fleet vehicles with 99.2% uptime SLAs.',
    problem: 'Fleet EVs strand for hours at unreliable chargers; DISCOM caps make depot charging expensive.',
    solution: 'Smart queuing across captive + public chargers, solar-blended hubs, and uptime SLAs backed by predictive maintenance.',
    market: '₹1.1 Lakh Cr fleet-electrification stack by 2030; 2.8M commercial EVs expected by 2028.',
    model: '₹1.9/kWh software spread + hub take-rate + demand-response revenue with DISCOMs.',
    founder: { name: 'Sanjana Pillai', title: 'Co-founder & CEO', bio: 'Ex-Ather energy systems; grid-storage patents ×3.', qualifications: ['Anna University', 'Ex-Ather Energy', '3 patents'], experience: ['10 yrs energy systems'] },
    askL: 1500, equityPct: 8, raisedL: 1100,
    cashL: 780, burnL: 52, revenueL: 64, prevRevenueL: 55,
    revSeries: [18, 21, 25, 28, 33, 38, 44, 49, 54, 58, 55, 64],
    burnSeries: [58, 57, 56, 56, 55, 54, 54, 53, 53, 52, 52, 52],
    months: M12, growthPct: 16,
    traction: [{ label: 'Fleet vehicles served', value: '1,900' }, { label: 'Uptime SLA', value: '99.2%' }, { label: 'Hubs live', value: '34' }],
    highlights: ['Green fund DPIIT grant', '2 OEM contracts'], tags: ['ev', 'charging', 'fleet'],
    milestones: [{ id: 'ms-gg1', label: 'Growth bridge', detail: '₹15 Cr — 60 new hubs', amountL: 1500, date: 'Q4 2025', status: 'active', progress: 48 }],
    deck: { name: 'GreenGrid_A.pdf', pages: 16, sizeKB: 5200, updatedAt: now - 20 * DAY, sharedWith: ['inv-1'] },
    readiness: 82, hue: 140,
  },
  {
    id: 'st-7', ownerId: 'u-ck', name: 'CraftKart', tagline: 'D2C marketplace for 12,000 verified artisans',
    sector: 'D2C', stage: 'Seed', location: 'Jaipur', founded: 2022, team: 19,
    pitch: 'Provenance-verified crafts with export logistics bundled — AOV ₹2,340, 32% repeat, shipping to 14 countries.',
    problem: 'Artisans capture 9% of final retail value; export paperwork blocks 97% from selling abroad.',
    solution: 'Craft-passport provenance, consolidated export logistics, and AI-assisted product photography/cataloguing.',
    market: '₹8.4 Lakh Cr global handicraft demand; India export share growing 21% YoY.',
    model: '18% marketplace commission + logistics margin + white-label storefront SaaS.',
    founder: { name: 'Devika Joshi', title: 'Founder', bio: '3rd-gen textile exporter; NIFT + LSE.', qualifications: ['NIFT Delhi', 'LSE MSc'], experience: ['6 yrs exports'] },
    askL: 400, equityPct: 10, raisedL: 140,
    cashL: 305, burnL: 18.6, revenueL: 21.5, prevRevenueL: 18.2,
    revSeries: [6, 7.4, 8.8, 10.2, 11.6, 13.1, 14.8, 16.2, 17.4, 18.6, 18.2, 21.5],
    burnSeries: [22, 21.6, 21.2, 20.8, 20.4, 20, 19.6, 19.4, 19.2, 19, 18.6, 18.6],
    months: M12, cac: 380, ltv: 3150, growthPct: 18,
    traction: [{ label: 'GMV (TTM)', value: '₹9.1 Cr' }, { label: 'Repeat rate', value: '32%' }, { label: 'Countries', value: '14' }],
    highlights: ['Government e-marketplace empanelled', 'Etsy strategic pilot'], tags: ['marketplace', 'export', 'artisan'],
    milestones: [{ id: 'ms-ck1', label: 'Seed round', detail: '₹4 Cr — export corridors', amountL: 400, date: 'May 2025', status: 'active', progress: 44 }],
    readiness: 69, hue: 18,
  },
  {
    id: 'st-8', ownerId: 'u-ql', name: 'QuantumLeap AI', tagline: 'Audit-grade AI agents for BFSI operations',
    sector: 'AI/ML', stage: 'Series A', location: 'Bengaluru', founded: 2021, team: 52,
    pitch: 'Compliance-locked LLM agents process 2.1M lending documents/month for 9 banks and NBFCs — 84% straight-through.',
    problem: 'BFSI back-offices drown in documents; generic LLMs fail audit and hallucinate on numerics.',
    solution: 'Deterministic extraction cores + LLM reasoning inside a full audit envelope; every answer traceable to source pixels.',
    market: '₹31,000 Cr Indian BFSI-ops automation by 2029.',
    model: 'Usage-based per document + annual platform licence (₹60L–₹2.4Cr ACV).',
    founder: { name: 'Arvind Subramanian', title: 'Co-founder & CEO', bio: 'Ex-Google Research; 12 papers, 1 NeurIPS best-paper.', qualifications: ['PhD CS, IISc', 'Ex-Google Research'], experience: ['11 yrs ML systems'] },
    askL: 2000, equityPct: 7, raisedL: 1600,
    cashL: 1240, burnL: 88, revenueL: 142, prevRevenueL: 121,
    revSeries: [31, 38, 44, 52, 61, 71, 82, 94, 108, 121, 133, 142],
    burnSeries: [96, 95, 94, 93, 92, 92, 91, 90, 90, 89, 88, 88],
    months: M12, cac: 240000, ltv: 6200000, growthPct: 17,
    traction: [{ label: 'Docs/month', value: '2.1 M' }, { label: 'STP rate', value: '84%' }, { label: 'Banks + NBFCs', value: '9' }],
    highlights: ['RBI sandbox grad', 'ISO 42001', 'NeurIPS best paper'], tags: ['agents', 'bfsi', 'document-ai'],
    milestones: [{ id: 'ms-ql1', label: 'Series B prep', detail: '₹20 Cr — SEA expansion', amountL: 2000, date: 'Q2 2026', status: 'active', progress: 22 }],
    deck: { name: 'QuantumLeap_SeriesA.pdf', pages: 19, sizeKB: 7100, updatedAt: now - 4 * DAY, sharedWith: ['inv-1'] },
    readiness: 91, hue: 256,
  },
  {
    id: 'st-9', ownerId: 'u-un', name: 'UrbanNest', tagline: 'Managed co-living at PG price points',
    sector: 'PropTech', stage: 'Pre-Seed', location: 'Mumbai', founded: 2024, team: 6,
    pitch: 'Asset-light co-living pods in 3 Mumbai micro-markets — 96% occupancy, ₹14,500 beds with meals + Wi-Fi.',
    problem: 'Migrant professionals face 5-month deposits and dire PG quality; landlords leave 22% vacancy.',
    solution: 'Revenue-share leases, modular pod fit-outs in 11 days, community ops run from one app.',
    market: '₹1.9 Lakh Cr urban rental; 11M migrant professionals in top-8 cities.',
    model: 'Rev-share spread ₹4,200/bed/month + add-on services.',
    founder: { name: 'Rahul Bhatia', title: 'Founder', bio: 'Ex-OYO city head; hospitality family business.', qualifications: ['IHM Mumbai'], experience: ['6 yrs hospitality ops'] },
    askL: 150, equityPct: 11, raisedL: 20,
    cashL: 64, burnL: 6.8, revenueL: 5.2, prevRevenueL: 4.1,
    revSeries: [0.8, 1.2, 1.7, 2.2, 2.7, 3.1, 3.5, 3.9, 4.3, 4.1, 4.6, 5.2],
    burnSeries: [7.6, 7.5, 7.4, 7.3, 7.2, 7.1, 7, 7, 6.9, 6.9, 6.8, 6.8],
    months: M12, growthPct: 26,
    traction: [{ label: 'Beds live', value: '412' }, { label: 'Occupancy', value: '96%' }, { label: 'Waitlist', value: '380' }],
    highlights: ['3 landlord rev-shares signed'], tags: ['co-living', 'proptech', 'rental'],
    milestones: [{ id: 'ms-un1', label: 'Pre-seed', detail: '₹1.5 Cr — 4 new buildings', amountL: 150, date: 'Apr 2025', status: 'active', progress: 18 }],
    readiness: 58, hue: 330,
  },
];

/* --------------------------------------------------------------- investors */
export const seedInvestors: Investor[] = [
  {
    id: 'inv-1', userId: 'u-investor', name: 'Meera Krishnan', firm: 'Ardent Peak Capital', title: 'Partner',
    email: 'meera@ardentpeak.vc', phone: '+91 99870 22014', location: 'Mumbai', hue: 232,
    bio: 'Fifteen years across B2B software and fintech. Led 22 early rounds; two portfolio IPOs. Operator-first diligence — I read your ledger before your deck.',
    thesis: 'Backs workflow-heavy SaaS and regulated fintech at Seed–Series A where distribution is already proven and capital extends the moat.',
    sectors: ['SaaS', 'Fintech', 'AI/ML'], stages: ['Seed', 'Series A'], geos: ['Bengaluru', 'Mumbai', 'Chennai', 'Pan-India'],
    chequeMinL: 200, chequeMaxL: 1200,
    qualifications: ['IIM Ahmedabad', 'Chartered Accountant', 'Ex-Avendus Capital', 'Kauffman Fellow'],
    collaborations: ['Co-invested with Peak XV ×3', 'Blume-adjacent syndicate', '100X.VC follow-on partner'],
    portfolio: [{ name: 'Ledgerly', sector: 'SaaS' }, { name: 'PayOrbit', sector: 'Fintech' }, { name: 'Doxa AI', sector: 'AI/ML' }, { name: 'Fleetbase', sector: 'SaaS' }],
    deals: 22, aumCr: 2400, response: 93, medCloseDays: 34, verified: true, active: true,
  },
  {
    id: 'inv-2', name: 'Vikram Malhotra', firm: 'Independent Angel · ex-Flipkart VP', title: 'Angel Investor',
    email: 'vikram@vmangels.in', phone: '+91 98452 08710', location: 'Bengaluru', hue: 18,
    bio: 'Built Flipkart\'s category P&Ls for six years. Now angel cheques into consumer and commerce infra. Fast decisions — 10 days, coffee to commitment.',
    thesis: 'Consumer brands and marketplaces with authentic supply. Cheque: ₹25L–₹1.2Cr, pre-seed to seed.',
    sectors: ['D2C', 'Consumer', 'Marketplace'], stages: ['Idea', 'Pre-Seed', 'Seed'], geos: ['Bengaluru', 'Delhi NCR', 'Pan-India'],
    chequeMinL: 25, chequeMaxL: 120,
    qualifications: ['IIT Delhi', 'Ex-Flipkart VP Category', '46 angel cheques since 2018'],
    collaborations: ['AngelList India syndicate', 'KA Angels'],
    portfolio: [{ name: 'Snacc', sector: 'D2C' }, { name: 'MysteryBox', sector: 'Consumer' }, { name: 'KiranaClub-Seller', sector: 'Marketplace' }],
    deals: 46, aumCr: 90, response: 88, medCloseDays: 12, verified: true, active: true,
  },
  {
    id: 'inv-3', name: 'Ananya Sharma', firm: 'NorthArc Ventures', title: 'Principal',
    email: 'ananya@northarc.vc', phone: '+91 98110 37765', location: 'Delhi NCR', hue: 272,
    bio: 'Deep-tech and health operator turned investor. I care about clinical/regulatory depth and honest unit economics over founder theatre.',
    thesis: 'HealthTech and EdTech with measurable outcomes; vernacular-first distribution earns a second meeting instantly.',
    sectors: ['HealthTech', 'EdTech', 'DeepTech'], stages: ['Pre-Seed', 'Seed', 'Series A'], geos: ['Delhi NCR', 'Hyderabad', 'Pune', 'Pan-India'],
    chequeMinL: 150, chequeMaxL: 600,
    qualifications: ['AIIMS Delhi (MD)', 'Stanford GSB', 'Ex-Practo'],
    collaborations: ['ACT Capital health syndicate', 'ION Life co-invest'],
    portfolio: [{ name: 'ClinikOne', sector: 'HealthTech' }, { name: 'VernEd', sector: 'EdTech' }, { name: 'GenomeCart', sector: 'DeepTech' }],
    deals: 14, aumCr: 860, response: 81, medCloseDays: 41, verified: true, active: true,
  },
  {
    id: 'inv-4', name: 'Rohan Iyer', firm: 'TigerPeak Global', title: 'Managing Director, India',
    email: 'rohan@tigerpeak.com', phone: '+91 98200 67112', location: 'Mumbai', hue: 205,
    bio: 'Growth-stage cheques into category leaders. We move with conviction and bring global follow-on pools.',
    thesis: 'Series A/B — ₹10–50 Cr cheques into fintech, SaaS and AI with >₹3 Cr ARR and efficient growth.',
    sectors: ['Fintech', 'SaaS', 'AI/ML'], stages: ['Series A', 'Series B', 'Growth'], geos: ['Pan-India', 'Global'],
    chequeMinL: 1000, chequeMaxL: 5000,
    qualifications: ['Wharton MBA', 'Ex-Warburg Pincus', 'Ixigo board observer'],
    collaborations: ['Tiger global pool', 'Temasek co-invest'],
    portfolio: [{ name: 'Banklite', sector: 'Fintech' }, { name: 'Querydesk', sector: 'SaaS' }],
    deals: 31, aumCr: 18000, response: 72, medCloseDays: 55, verified: true, active: true,
  },
  {
    id: 'inv-5', name: 'Priya Nair', firm: 'Sakhi Impact Capital', title: 'Founding Partner',
    email: 'priya@sakhicapital.in', phone: '+91 97402 55631', location: 'Kochi', hue: 96,
    bio: 'Impact-first, returns-proud. I fund climate and agri founders who measure outcomes in soil and sky, not just spreadsheets.',
    thesis: 'Pre-seed/seed climate, agri and circular-economy startups with field pilots >2 seasons.',
    sectors: ['Climate', 'AgriTech'], stages: ['Idea', 'Pre-Seed', 'Seed'], geos: ['Pan-India'],
    chequeMinL: 40, chequeMaxL: 250,
    qualifications: ['TISS Mumbai', 'Acumen Fellow', 'NABARD advisor'],
    collaborations: ['Green Angles Network', 'Caspian co-invest'],
    portfolio: [{ name: 'SoilDNA', sector: 'AgriTech' }, { name: 'ReCircle', sector: 'Climate' }],
    deals: 19, aumCr: 320, response: 90, medCloseDays: 28, verified: true, active: true,
  },
  {
    id: 'inv-6', name: 'Arjun Deshmukh', firm: 'K2 Angels Network', title: 'Lead — DeepTech Circle',
    email: 'arjun@k2angels.in', phone: '+91 80875 11904', location: 'Pune', hue: 150,
    bio: 'Mechanical engineer who fell into venture. Syndicate of 140 operators writing ₹50L–₹3Cr pooled cheques into hard tech.',
    thesis: 'DeepTech, AI/ML and EV-adjacent hardware with defensible IP; founder must out-explain the room.',
    sectors: ['DeepTech', 'AI/ML', 'Climate'], stages: ['Pre-Seed', 'Seed', 'Series A'], geos: ['Pune', 'Bengaluru', 'Chennai', 'Pan-India'],
    chequeMinL: 50, chequeMaxL: 300,
    qualifications: ['COEP Pune', 'Ex-Tata Motors R&D', 'IE(I) chartered'],
    collaborations: ['IIT-B SINE syndicate', 'Venture Catalysts pool'],
    portfolio: [{ name: 'TorqMotors', sector: 'DeepTech' }, { name: 'LatticeAI', sector: 'AI/ML' }],
    deals: 27, aumCr: 140, response: 85, medCloseDays: 21, verified: true, active: true,
  },
  {
    id: 'inv-7', name: 'Kavitha Rao', firm: 'Meridian Ventures', title: 'General Partner',
    email: 'kavitha@meridian.vc', phone: '+91 96321 84520', location: 'Bengaluru', hue: 326,
    bio: 'Enterprise SaaS specialist. Former founder (exit to Freshworks). I open US doors — half my portfolio lands first US logos through our network.',
    thesis: 'B2B SaaS seed with >₹50L MRR run-rate trajectory and founder-led sales that we help institutionalise.',
    sectors: ['SaaS', 'Marketplace', 'AI/ML'], stages: ['Seed', 'Series A'], geos: ['Bengaluru', 'Chennai', 'Global'],
    chequeMinL: 300, chequeMaxL: 1500,
    qualifications: ['NIT Trichy', 'Ex-founder (acq. Freshworks)', 'SaaSBoomi council'],
    collaborations: ['SaaSBoomi syndicate', 'Accel seed pool'],
    portfolio: [{ name: 'Supportly', sector: 'SaaS' }, { name: 'RecruiterGrid', sector: 'Marketplace' }],
    deals: 18, aumCr: 1900, response: 89, medCloseDays: 38, verified: true, active: true,
  },
  {
    id: 'inv-8', name: 'Siddharth Bose', firm: 'Horizon Peak Partners', title: 'Founder',
    email: 'sid@horizonpeak.in', phone: '+91 90074 20318', location: 'Kolkata', hue: 46,
    bio: 'East-India focused micro-VC. Consumer insight from the bazaar, not from Twitter. Small cheques, deep involvement.',
    thesis: 'Consumer, edtech and proptech serving Tier-2/3 demand; pre-seed first money is our home turf.',
    sectors: ['Consumer', 'EdTech', 'PropTech'], stages: ['Idea', 'Pre-Seed'], geos: ['Kolkata', 'Delhi NCR', 'Mumbai', 'Pan-India'],
    chequeMinL: 15, chequeMaxL: 90,
    qualifications: ['St. Xavier\'s Kolkata', 'Ex-ITC consumer insights'],
    collaborations: ['Calcutta Angels', 'IAN East pool'],
    portfolio: [{ name: 'Boithata', sector: 'Consumer' }, { name: 'Pathshala+', sector: 'EdTech' }],
    deals: 33, aumCr: 210, response: 94, medCloseDays: 16, verified: true, active: true,
  },
];

/* ------------------------------------------------------------- connections */
export const seedConnections = [
  { id: 'cn-1', startupId: 'st-own', investorId: 'inv-1', fromRole: 'founder' as const, message: 'Meera — your Ledgerly playbook on workflow SaaS resonated. Nexaflow is at ₹20L MRR growing 9%/mo; raising ₹3 Cr seed. Deck attached, would value 30 minutes.', status: 'accepted' as const, createdAt: now - 16 * DAY, stage: 'diligence' as const },
  { id: 'cn-2', startupId: 'st-own', investorId: 'inv-4', fromRole: 'investor' as const, message: 'Aarav — Nexaflow came through our Bengaluru scan. Growth-stage is slightly early for your round, but I\'d like to track. Open to a follow-connection?', status: 'pending' as const, createdAt: now - 2 * DAY, stage: 'intro' as const },
  { id: 'cn-3', startupId: 'st-own', investorId: 'inv-7', fromRole: 'founder' as const, message: 'Kavitha — B2B SaaS + US doors is exactly our next chapter. Sharing readiness report and deck.', status: 'pending' as const, createdAt: now - 5 * HOUR, stage: 'intro' as const },
  { id: 'cn-4', startupId: 'st-2', investorId: 'inv-1', fromRole: 'investor' as const, message: 'Ishita — FinEdge\'s NPA discipline at this scale is rare. Ardent Peak would like first look at the Series A extension.', status: 'accepted' as const, createdAt: now - 34 * DAY, stage: 'term-sheet' as const },
  { id: 'cn-5', startupId: 'st-6', investorId: 'inv-1', fromRole: 'investor' as const, message: 'Sanjana — fleet charging uptime SLAs are the moat. Can we schedule an ops deep-dive?', status: 'accepted' as const, createdAt: now - 12 * DAY, stage: 'diligence' as const },
  { id: 'cn-6', startupId: 'st-8', investorId: 'inv-1', fromRole: 'founder' as const, message: 'Meera — audit-grade agents for BFSI; we think Ardent Peak\'s regulatory lens fits the round.', status: 'pending' as const, createdAt: now - 26 * HOUR, stage: 'intro' as const },
];

/* ----------------------------------------------------------------- threads */
export const seedThreads: Thread[] = [
  {
    id: 'th-1', connId: 'cn-1', typing: false, deckShared: true,
    pair: [
      { userId: 'u-founder', name: 'Aarav Mehta', org: 'Nexaflow · Founder', hue: 36, online: true },
      { userId: 'u-investor', name: 'Meera Krishnan', org: 'Ardent Peak Capital · Partner', hue: 232, online: true },
    ],
    msgs: [
      { id: 'm1', senderId: 'u-investor', ts: now - 15 * DAY, text: 'Aarav, thanks for the deck — the reconciliation wedge is sharp. Two things before our IC pre-read: cohort retention by onboarding month, and how the AI anomaly engine handles Tally inventory vouchers.', reactions: {} },
      { id: 'm2', senderId: 'u-founder', ts: now - 15 * DAY + 2 * HOUR, text: 'Sharing the cohort sheet now. Short version: month-3 retention 94%, month-6 is 91%. Tally inventory vouchers are excluded from auto-match today — flagged for human review; that boundary is deliberate.', reactions: { '👍': 1 } },
      { id: 'm3', senderId: 'u-founder', ts: now - 15 * DAY + 2 * HOUR, file: { name: 'Nexaflow_Cohort_Retention_Feb.xlsx', sizeKB: 212 }, reactions: { '🙏': 1 } },
      { id: 'm4', senderId: 'u-investor', ts: now - 14 * DAY, text: 'This is the right answer — deliberate boundaries beat magic demos. Moving you to diligence. Sharing our standard data-room checklist.', reactions: { '🎉': 2 } },
      { id: 'm5', senderId: 'u-investor', ts: now - 14 * DAY, file: { name: 'ArdentPeak_DD_Checklist_Seed.pdf', sizeKB: 386 }, reactions: {} },
      { id: 'm6', senderId: 'u-founder', ts: now - 6 * DAY, text: 'Data room is 80% loaded — audited financials, GST returns, and the two enterprise pilot LOIs. Pending: cap-table affidavit from CS, expected Thursday.', reactions: {} },
      { id: 'm7', senderId: 'u-investor', ts: now - 5 * DAY, text: 'Great pace. One commercial question: your ₹65K tier ACVs are 4.6x entry — is that expansion organic or sales-led? Affects how we model the raise.', reactions: {} },
      { id: 'm8', senderId: 'u-founder', ts: now - 5 * DAY + 3 * HOUR, text: '70% organic — teams start with AP, then add close-management once auditors adopt it. Sales-led only on logistics clusters where we bought distribution.', reactions: { '🔥': 1 } },
      { id: 'm9', senderId: 'u-investor', ts: now - 2 * HOUR, text: 'IC is scheduled next Tuesday. Come ready to walk the audit trail live — one of our partners will try to break it. 😄', reactions: {} },
    ],
  },
  {
    id: 'th-2', connId: 'cn-4', typing: false, deckShared: true,
    pair: [
      { userId: 'u-fin', name: 'Ishita Rao', org: 'FinEdge · Co-founder & CEO', hue: 210, online: false },
      { userId: 'u-investor', name: 'Meera Krishnan', org: 'Ardent Peak Capital · Partner', hue: 232, online: true },
    ],
    msgs: [
      { id: 'mf1', senderId: 'u-investor', ts: now - 30 * DAY, text: 'Ishita — the 2.1% NPA at 2.9L active kiranas is the best vintage curve we\'ve seen this year. Sending a soft-circled term sheet frame for the extension.', reactions: {} },
      { id: 'mf2', senderId: 'u-investor', ts: now - 30 * DAY, file: { name: 'ArdentPeak_TS_Frame_FinEdge.pdf', sizeKB: 448 }, reactions: { '🙏': 1 } },
      { id: 'mf3', senderId: 'u-fin', ts: now - 29 * DAY, text: 'Received — two points for the partner call: we want the collections infra line-item unbundled, and board seat construct as discussed. Otherwise aligned.', reactions: {} },
      { id: 'mf4', senderId: 'u-investor', ts: now - 1 * DAY, text: 'Agreed on unbundling. Legal is turning the redline tonight; expect the marked draft by tomorrow EOD.', reactions: {} },
    ],
  },
];

/* -------------------------------------------------------------- communities */
export const founderChannels: Channel[] = [
  {
    id: 'fc-1', kind: 'text', name: 'welcome-and-wins', desc: 'Announcements, milestones, and victory laps', unread: 2,
    threads: [{ title: 'March wins thread — drop yours', count: 23 }],
    msgs: [
      { id: 'fm1', author: 'Ishita Rao', hue: 210, roleTag: 'FinEdge · CEO', ts: now - 3 * DAY, text: 'Closed our Series A extension with Ardent Peak this morning. 14 months of diligence discipline paid off. AMA on fintech diligence this weekend. 🙌', reactions: { '🎉': 34, '🔥': 18, '👏': 9 } },
      { id: 'fm2', author: 'Kabir Chawla', hue: 96, roleTag: 'AgriSense', ts: now - 2 * DAY, text: '18,000 pilot acres now live. A farmer in Nashik sent us a voice note saying the advisory saved his pomegranate crop. This is why we build.', reactions: { '🌾': 21, '❤️': 12 } },
      { id: 'fm3', author: 'Tanya Sethi', hue: 268, roleTag: 'Edumentor', ts: now - 26 * HOUR, text: 'Crossed 82K monthly learners. If anyone is selling into BFSI, my DM is open — their procurement cycle is… an experience.', reactions: { '😂': 15, '💪': 7 } },
      { id: 'fm4', author: 'Sanjana Pillai', hue: 140, roleTag: 'GreenGrid', ts: now - 8 * HOUR, text: 'Hub #34 went live in Coimbatore. Fleet uptime SLA holding at 99.2% across the network.', reactions: { '⚡': 19 } },
    ],
  },
  {
    id: 'fc-2', kind: 'text', name: 'fundraising-war-room', desc: 'Term sheets, valuations, diligence battle stories', unread: 5,
    threads: [{ title: 'What dilution did you take at seed?', count: 47 }, { title: 'Data-room checklist exchange', count: 18 }],
    msgs: [
      { id: 'fm5', author: 'Arvind Subramanian', hue: 256, roleTag: 'QuantumLeap AI', ts: now - 5 * HOUR, text: 'Reminder for first-timers: a term sheet is not a deal. Until money hits the bank, keep three conversations warm. Learned this the hard way in 2023.', reactions: { '💯': 28, '🙏': 11 } },
      { id: 'fm6', author: 'Devika Joshi', hue: 18, roleTag: 'CraftKart', ts: now - 4 * HOUR, text: 'Question: investor wants a 2x liquidation preference at seed. Am I overreacting, or is that a walk-away term in this market?', reactions: { '🚩': 16 } },
      { id: 'fm7', author: 'Ishita Rao', hue: 210, roleTag: 'FinEdge · CEO', ts: now - 3 * HOUR, text: 'Walk. 2x non-participating at seed will poison every future round. 1x non-participating is the only sane default. Happy to share our redline.', reactions: { '🙏': 9, '👍': 6 }, reply: 'Question: investor wants a 2x liquidation preference…' },
      { id: 'fm8', author: 'Aarav Mehta', hue: 36, roleTag: 'Nexaflow · CEO', ts: now - 45 * MIN, text: 'IC with Ardent Peak on Tuesday. They want to "break the audit trail live". Sending good vibes appreciated — will report back.', reactions: { '🤞': 22, '🔥': 8 } },
    ],
  },
  {
    id: 'fc-3', kind: 'text', name: 'pitch-feedback', desc: 'Drop your deck — get honest, structured critique', unread: 3,
    threads: [{ title: 'Deck tear-down: AgriSense v4', count: 12 }],
    msgs: [
      { id: 'fm9', author: 'Rahul Bhatia', hue: 330, roleTag: 'UrbanNest', ts: now - 7 * HOUR, text: 'Posted UrbanNest v3 in the thread. Torn between leading with occupancy (96%) or the rev-share unit economics. Thoughts?', reactions: { '📊': 5 } },
      { id: 'fm10', author: 'Tanya Sethi', hue: 268, roleTag: 'Edumentor', ts: now - 6 * HOUR, text: 'Occupancy is the hook, rev-share is the moat. Lead with the number that makes a VC lean forward — that\'s 96% with a 380 waitlist.', reactions: { '👍': 8 } },
    ],
  },
  {
    id: 'fc-4', kind: 'text', name: 'growth-and-gtm', desc: 'Playbooks that actually moved revenue', unread: 0,
    msgs: [
      { id: 'fm11', author: 'Devika Joshi', hue: 18, roleTag: 'CraftKart', ts: now - 2 * DAY, text: 'Export corridors experiment results: DDP pricing reduced cart abandonment 23% on EU orders. Eating the duty upfront is worth it.', reactions: { '📈': 14 } },
      { id: 'fm12', author: 'Arvind Subramanian', hue: 256, roleTag: 'QuantumLeap AI', ts: now - 1 * DAY, text: 'BFSI GTM note: RBI sandbox graduation cut our security review from 11 weeks to 3. If you sell to banks, regulatory badges are GTM assets, not compliance chores.', reactions: { '💡': 21, '🎯': 6 } },
    ],
  },
  {
    id: 'fc-5', kind: 'text', name: 'hiring-and-culture', desc: 'Comp benchmarks, offers, hard people calls', unread: 0,
    msgs: [
      { id: 'fm13', author: 'Sanjana Pillai', hue: 140, roleTag: 'GreenGrid', ts: now - 3 * DAY, text: 'Field-ops hiring insight: ex-DISCOM linemen outperform every "EV-certified" candidate pool we tried. Train for software, hire for grid instincts.', reactions: { '⚡': 11, '👏': 5 } },
    ],
  },
  {
    id: 'fc-6', kind: 'text', name: 'founder-vent-circle', desc: 'Confidential. What\'s said here stays here.', unread: 1,
    msgs: [
      { id: 'fm14', author: 'Anonymous · verified founder', hue: 200, roleTag: 'Stealth', ts: now - 12 * HOUR, text: 'Co-founder conversation I\'ve avoided for 6 months is happening tonight. Any scripts for equity restructuring without nuking the friendship?', reactions: { '🫂': 18 } },
      { id: 'fm15', author: 'Kabir Chawla', hue: 96, roleTag: 'AgriSense', ts: now - 10 * HOUR, text: 'Been there. Bring a mediator, agree the principle before the numbers, and write everything down the same night. DMs open.', reactions: { '❤️': 9 } },
    ],
  },
  {
    id: 'fc-v1', kind: 'voice', name: 'Pitch Practice Lounge', desc: 'Live pitch reps — camera optional',
    voiceMembers: [
      { name: 'Tanya Sethi', hue: 268, speaking: true },
      { name: 'Rahul Bhatia', hue: 330 },
      { name: 'Devika Joshi', hue: 18 },
    ],
  },
  {
    id: 'fc-v2', kind: 'voice', name: 'Chai & Capital — Office Hours', desc: 'Thursdays 5pm · investors drop in',
    voiceMembers: [{ name: 'Kabir Chawla', hue: 96, speaking: true }, { name: 'Aarav M (you)', hue: 36 }],
  },
];

export const investorChannels: Channel[] = [
  {
    id: 'ic-1', kind: 'text', name: 'deal-flow-desk', desc: 'What crossed your desk this week — verbatim', unread: 4,
    threads: [{ title: 'BFSI automation deals — who\'s seeing what', count: 31 }],
    msgs: [
      { id: 'im1', author: 'Kavitha Rao', hue: 326, roleTag: 'Meridian · GP', ts: now - 4 * HOUR, text: 'Saw three workflow-SaaS seeds this week, all claiming "AI agents". Only one could show audit-grade determinism. The bar is now: show me the failure envelope, not the demo.', reactions: { '💯': 22, '🎯': 9 } },
      { id: 'im2', author: 'Rohan Iyer', hue: 205, roleTag: 'TigerPeak · MD', ts: now - 3 * HOUR, text: 'Growth desk note: fintech infra multiples re-rated upward — quality NPA stories are pricing like SaaS again. If your lending portfolio is clean, now is the window.', reactions: { '📈': 15 } },
      { id: 'im3', author: 'Meera Krishnan', hue: 232, roleTag: 'Ardent Peak · Partner', ts: now - 50 * MIN, text: 'Nexaflow IC on Tuesday. Anyone with Tally-warefare scar tissue want to join the technical deep-dive as scout? Carry on the deal available.', reactions: { '🙋': 6, '🤝': 3 } },
    ],
  },
  {
    id: 'ic-2', kind: 'text', name: 'due-diligence-library', desc: 'Checklists, red flags, forensic vendors that deliver', unread: 2,
    threads: [{ title: 'Forensic accountants — honest reviews', count: 19 }],
    msgs: [
      { id: 'im4', author: 'Ananya Sharma', hue: 272, roleTag: 'NorthArc · Principal', ts: now - 1 * DAY, text: 'New red flag library entry: "GST returns filed but e-invoice IRN count mismatched by 40%". Took our vendor 2 hours to surface; would\'ve been a painful post-term-sheet find.', reactions: { '🚩': 12, '🙏': 7 } },
      { id: 'im5', author: 'Arjun Deshmukh', hue: 150, roleTag: 'K2 Angels', ts: now - 8 * HOUR, text: 'Sharing our 41-point hardware DD checklist (supply chain, BOM drift, certification). Steal it, improve it, send back diffs.', reactions: { '📋': 17, '🔥': 5 } },
    ],
  },
  {
    id: 'ic-3', kind: 'text', name: 'sector-deep-dives', desc: 'Monthly thesis maps — this month: agentic AI', unread: 0,
    msgs: [
      { id: 'im6', author: 'Rohan Iyer', hue: 205, roleTag: 'TigerPeak · MD', ts: now - 2 * DAY, text: 'Agentic AI map v2 is posted. TL;DR — value concentrates where audit trails are mandatory: BFSI ops, pharma QC, legal discovery. Horizontal agents get commoditised by the model vendors themselves.', reactions: { '🧠': 19, '👍': 8 } },
    ],
  },
  {
    id: 'ic-4', kind: 'text', name: 'co-investment-board', desc: 'Syndication opportunities and allocation swaps', unread: 1,
    msgs: [
      { id: 'im7', author: 'Priya Nair', hue: 96, roleTag: 'Sakhi Impact', ts: now - 6 * HOUR, text: '₹60L allocation open in a precision-agri pre-seed we\'re leading. Field-validated, 2 seasons of data. DM for the vault link — closes in 10 days.', reactions: { '🤝': 8, '🌱': 6 } },
    ],
  },
  {
    id: 'ic-5', kind: 'text', name: 'portfolio-support', desc: 'Operator asks from our companies — intros, hires, pilots', unread: 0,
    msgs: [
      { id: 'im8', author: 'Kavitha Rao', hue: 326, roleTag: 'Meridian · GP', ts: now - 3 * DAY, text: 'Portfolio ask: Supportly needs a VP Eng who has scaled a 30-person team past Series A. Referred candidates get my reference within 24h.', reactions: { '🙌': 4 } },
    ],
  },
  {
    id: 'ic-6', kind: 'text', name: 'lp-updates-and-market', desc: 'Macro, exits, LP sentiment — signal only', unread: 0,
    msgs: [
      { id: 'im9', author: 'Rohan Iyer', hue: 205, roleTag: 'TigerPeak · MD', ts: now - 2 * DAY, text: 'LP sentiment index up 14% QoQ — India allocation remains the top EM overweight. Dry powder is real but bar for Series B has structurally moved to efficient growth. Share with your portfolios.', reactions: { '📊': 13 } },
    ],
  },
  {
    id: 'ic-v1', kind: 'voice', name: 'Morning Deals Briefing', desc: 'Weekdays 9:30am · 15-min standup',
    voiceMembers: [
      { name: 'Rohan Iyer', hue: 205, speaking: true },
      { name: 'Ananya Sharma', hue: 272 },
      { name: 'Arjun Deshmukh', hue: 150 },
    ],
  },
  {
    id: 'ic-v2', kind: 'voice', name: 'Allocation Circle', desc: 'Syndicate coordination — members only',
    voiceMembers: [{ name: 'Priya Nair', hue: 96, speaking: true }, { name: 'Meera K (you)', hue: 232 }],
  },
];

/* ------------------------------------------------------------ notifications */
export const seedNotices: Notice[] = [
  { id: 'n1', type: 'connect', title: 'Connection accepted', body: 'Meera Krishnan (Ardent Peak) accepted your request — a private room is now open.', ts: now - 16 * DAY, read: true, link: '/app/messages/th-1' },
  { id: 'n2', type: 'match', title: 'New 92% investor match', body: 'Kavitha Rao · Meridian Ventures — sector, stage and geography all align.', ts: now - 9 * HOUR, read: false, link: '/app/matching' },
  { id: 'n3', type: 'connect', title: 'Inbound interest', body: 'Rohan Iyer · TigerPeak Global wants to track Nexaflow. Review and respond.', ts: now - 2 * DAY, read: false, link: '/app/connections' },
  { id: 'n4', type: 'milestone', title: 'Milestone check-in due', body: '“Seed round — ₹3 Cr” is at 62%. Update progress for your tracker.', ts: now - 5 * HOUR, read: false, link: '/app/tracker' },
  { id: 'n5', type: 'security', title: 'New sign-in · Chrome on macOS', body: 'Bengaluru, IN · If this wasn\'t you, reset your password immediately.', ts: now - 1 * DAY, read: true, link: '/app/notifications' },
  { id: 'n6', type: 'match', title: 'Deck opened 3× this week', body: 'Your pitch deck was opened by 2 verified investors (controlled sharing on).', ts: now - 3 * DAY, read: true, link: '/app/startup/st-own' },
  { id: 'n7', type: 'system', title: 'Profile completeness 86%', body: 'Add CAC/LTV verification to lift your readiness score by ~4 points.', ts: now - 4 * DAY, read: true, link: '/app/startup/st-own' },
  { id: 'n8', type: 'message', title: 'Office hours starting', body: 'Chai & Capital voice lounge is live with 2 founders.', ts: now - 3 * HOUR, read: false, link: '/app/community' },
];

/* ------------------------------------------------------------------ events */
export const seedEvents: VEvent[] = [
  { id: 'ev-1', title: 'VentureSetu Demo Day — Cohort VII', kind: 'Demo Day', date: 'Sat, 22 Mar 2025', time: '10:00 IST', where: 'Virtual + Bengaluru hub', host: 'VentureSetu', seats: 400, left: 57, featured: true, desc: 'Nine curated startups across fintech, climate and AI present 6-minute pitches to 120+ verified investors with live Q&A and follow-up rooms.', tags: ['Pitch', 'Seed', 'All sectors'] },
  { id: 'ev-2', title: 'Term Sheet Teardown — Live Redlining', kind: 'Workshop', date: 'Thu, 13 Mar 2025', time: '17:30 IST', where: 'Virtual', host: 'Ardent Peak × IndusLaw', seats: 150, left: 23, desc: 'A real seed term sheet redlined live by a partner and a startup lawyer. Liquidation prefs, anti-dilution, board constructs — explained line by line.', tags: ['Legal', 'Fundraising'] },
  { id: 'ev-3', title: 'Fintech Founders × RBI Innovation Hub', kind: 'Roundtable', date: 'Tue, 18 Mar 2025', time: '15:00 IST', where: 'Mumbai · BKC', host: 'RBIH Community', seats: 60, left: 8, desc: 'Closed-door roundtable on the compliance sandbox journey — what the Hub expects from lending and payments applicants in 2025.', tags: ['Fintech', 'Regulatory'] },
  { id: 'ev-4', title: 'Climate Capital Conclave — South Chapter', kind: 'Conference', date: 'Fri, 28 Mar 2025', time: '09:30 IST', where: 'Chennai · IIT-MRP', host: 'Sakhi Impact', seats: 220, left: 104, desc: 'Agri, EV and circular-economy founders meet 40 impact funds. Field-pilot showcases, blended-finance panels and 1:1 curated meetings.', tags: ['Climate', 'AgriTech'] },
  { id: 'ev-5', title: 'Angel Syndicate Open House', kind: 'Networking', date: 'Wed, 12 Mar 2025', time: '19:00 IST', where: 'Bengaluru · UB City', host: 'K2 Angels', seats: 80, left: 31, desc: 'New-to-venture operators learn syndicate mechanics: carry, SPVs, and how pooled ₹50L–₹3Cr cheques are constructed.', tags: ['Angels', 'First cheque'] },
  { id: 'ev-6', title: 'GAAP for Founders — Close the Books Faster', kind: 'Masterclass', date: 'Mon, 24 Mar 2025', time: '16:00 IST', where: 'Virtual', host: 'Ledgerly Academy', seats: 300, left: 181, desc: 'From 9-day closes to 36 hours: the exact workflow stack, controls and audit practices used by the fastest finance teams.', tags: ['Finance', 'Ops'] },
];

/* ---------------------------------------------------------------- learning */
export const seedTracks: Track[] = [
  { id: 'lt-1', title: 'Seed Fundraising, End to End', level: 'Core', mins: 240, lessons: 12, done: 8, author: 'Meera Krishnan · Ardent Peak', hue: 232, desc: 'From narrative construction to data rooms, IC dynamics and closing mechanics — taught from the investor side of the table.', tags: ['Fundraising', 'Seed'] },
  { id: 'lt-2', title: 'Financial Mastery for Non-Finance Founders', level: 'Core', mins: 180, lessons: 9, done: 5, author: 'Ledgerly Finance Guild', hue: 36, desc: 'Burn, runway, CAC/LTV, burn multiples, revenue recognition — the exact metrics investors will interrogate, with worksheets.', tags: ['Finance', 'Metrics'] },
  { id: 'lt-3', title: 'The Pitch-Deck Studio', level: 'Workshop', mins: 150, lessons: 7, done: 0, author: 'Narrative Lab', hue: 205, desc: 'Slide-by-slide archetypes for problem, wedge, moat and ask — annotated from 200 decks that raised.', tags: ['Deck', 'Story'] },
  { id: 'lt-4', title: 'Regulatory Readiness: Fintech & Health', level: 'Advanced', mins: 210, lessons: 10, done: 2, author: 'IndusLaw × RBIH alumni', hue: 96, desc: 'Sandbox strategy, FLDG constructs, ABDM integration, and the licensing map founders misread most.', tags: ['Compliance'] },
  { id: 'lt-5', title: 'B2B GTM: Founder-Led Sales to Scale', level: 'Growth', mins: 160, lessons: 8, done: 0, author: 'Kavitha Rao · Meridian', hue: 326, desc: 'ICP discipline, pricing conversations, hiring the first AE, and the transition investors underwrite.', tags: ['GTM', 'Sales'] },
  { id: 'lt-6', title: 'Cap Tables & ESOPs Without Regret', level: 'Core', mins: 90, lessons: 5, done: 1, author: 'Trust & Equity Project', hue: 18, desc: 'Dilution math, pool sizing, co-founder vesting, and the clauses that matter three rounds later.', tags: ['Legal', 'Equity'] },
];

/* ----------------------------------------------------------------- schemes */
export const seedSchemes: Scheme[] = [
  { id: 'sc-1', name: 'Startup India Seed Fund Scheme (SISFS)', by: 'DPIIT · Ministry of Commerce', benefit: 'Up to ₹20 L grants · ₹50 L investment via incubators', sector: ['All'], stage: 'Idea — Pre-Seed', deadline: 'Rolling', hue: 36, elig: ['DPIIT-recognised, <2 yrs incorporated', 'Not raised >₹10 L monetary', '31%+ Indian shareholding'] },
  { id: 'sc-2', name: 'Fund of Funds for Startups (FFS)', by: 'SIDBI', benefit: '₹10,000 Cr corpus deployed via SEBI AIFs', sector: ['All'], stage: 'Seed — Growth', deadline: 'Via AIFs', hue: 205, elig: ['Apply through SIDBI-backed AIFs', 'DPIIT recognition preferred', 'No direct application'] },
  { id: 'sc-3', name: 'CGTMSE Credit Guarantee', by: 'MSME Ministry × SIDBI', benefit: 'Guarantee cover up to ₹5 Cr on collateral-free loans', sector: ['Manufacturing', 'Services'], stage: 'Early revenue', deadline: 'Rolling', hue: 96, elig: ['Udyam-registered MSME', 'Via 130+ member lenders', 'New + existing units'] },
  { id: 'sc-4', name: 'Karnataka Elevate 2025', by: 'Govt. of Karnataka · K-Tech', benefit: '₹25 L non-dilutive grant + incubation', sector: ['DeepTech', 'Rural', 'Women-led'], stage: 'Idea — Seed', deadline: 'Apr 2025', hue: 268, elig: ['Karnataka-registered', 'Pitch via Unnati/Elevate', 'Sector-special tracks'] },
  { id: 'sc-5', name: 'TIDE 2.0 — MeitY', by: 'Ministry of Electronics & IT', benefit: '₹4–7 L EIR grants + lab access via 51 incubators', sector: ['ICT', 'IoT', 'AI/ML'], stage: 'Prototype', deadline: 'Incubator-wise', hue: 150, elig: ['Tech prototype stage', 'Apply to listed incubators', 'IP in India preferred'] },
  { id: 'sc-6', name: 'Stand-Up India', by: 'Banking network · DFS', benefit: 'Composite loans ₹10 L – ₹1 Cr', sector: ['All'], stage: 'Greenfield', deadline: 'Rolling', hue: 326, elig: ['SC/ST or women promoters', 'Greenfield enterprise', '85% project cost ceiling'] },
];

/* -------------------------------------------------------------------- news */
export const seedNews: News[] = [
  { id: 'nw-1', title: 'Indian startup funding hits ₹96,000 Cr annualised run-rate — seed leads the recovery', src: 'VentureSetu Research', ts: Date.now() - 3 * HOUR, tag: 'Funding Pulse', mins: 6, featured: true, desc: 'Seed-stage cheques grew 38% QoQ while Series B+ stayed selective. Fintech, SaaS and climate absorbed 61% of all capital. Our monthly barometer of 410 disclosed deals.' },
  { id: 'nw-2', title: 'RBI Innovation Hub opens 2025 cohort for lending and payments infra', src: 'Regulatory Desk', ts: Date.now() - 7 * HOUR, tag: 'Policy', mins: 4, desc: 'Applications remain open for six weeks; this cycle adds a dedicated track for MSME cash-flow underwriting models.' },
  { id: 'nw-3', title: 'Why audit-grade AI is absorbing BFSI automation budgets', src: 'Sector Maps', ts: Date.now() - 1 * DAY, tag: 'Deep Dive', mins: 8, desc: 'Banks now demand deterministic extraction envelopes around LLM reasoning. The winners are rebuilds, not wrappers.' },
  { id: 'nw-4', title: 'DPIIT recognition crosses 1.57 lakh startups; Tier-2/3 share rises to 48%', src: 'Data Desk', ts: Date.now() - 1 * DAY, tag: 'Ecosystem', mins: 3, desc: 'Recognition benefits — self-certification, tax exemptions, fast-track patents — remain under-used outside metros.' },
  { id: 'nw-5', title: 'Vernacular commerce GMV grows 3.1× — voice-first funnels lead conversion', src: 'Sector Maps', ts: Date.now() - 2 * DAY, tag: 'Consumer', mins: 5, desc: 'The post-UPI wave: discovery in 9 languages, checkout in 30 seconds, and cre dit habits forming in kirana ledgers.' },
  { id: 'nw-6', title: 'Green grants: blended finance structures unlock ₹2,100 Cr for climate pilots', src: 'Climate Desk', ts: Date.now() - 2 * DAY, tag: 'Climate', mins: 6, desc: 'First-loss capital from philanthropy is de-risking agri and EV infrastructure rounds for commercial funds.' },
  { id: 'nw-7', title: 'ESOP taxation reform enters consultation — startups push for exercise-time deferral', src: 'Policy Watch', ts: Date.now() - 3 * DAY, tag: 'Policy', mins: 4, desc: 'Founder collectives propose taxing at liquidity events instead of exercise; feedback window closes next month.' },
  { id: 'nw-8', title: 'Inside the 36-hour close: finance automation teardowns from 12 mid-market CFOs', src: 'Operator Series', ts: Date.now() - 4 * DAY, tag: 'Playbook', mins: 9, desc: 'The exact stack — capture, routing, reconciliation, audit trail — and where humans stay in the loop.' },
];

/* --------------------------------------------------------------------- faq */
export const seedFaqs: Faq[] = [
  { cat: 'Getting Started', q: 'Who can join VentureSetu?', a: 'Founders who have incorporated (or are actively building) a startup, and investors deploying capital — angels, micro-VCs, funds and syndicate leads. Every profile passes verification: founders confirm incorporation or DPIIT status, investors confirm cheque history. Admins review edge cases within 48 hours.' },
  { cat: 'Getting Started', q: 'Is VentureSetu free for founders?', a: 'Creating a startup profile, receiving matches, joining the founder community and one active connection are free forever. Growth plans unlock unlimited connections, advanced analytics on deck views and priority placement in investor discovery.' },
  { cat: 'Getting Started', q: 'How is this different from AngelList or LinkedIn?', a: 'We are not a directory. VentureSetu runs a stateful lifecycle — Discover → Evaluate → Connect → Discuss → Fund → Track — with verified financials, controlled deck sharing, Discord-grade private rooms and a funding tracker that persists past the handshake.' },
  { cat: 'Matching & AI', q: 'How does AI matching actually work?', a: 'Four compatibility axes are scored transparently: sector overlap, stage fit, cheque-range vs your ask, and geography. Signals like traction velocity and investor response rates tune the final score. Every match shows its full breakdown — we never present a number without the "why".' },
  { cat: 'Matching & AI', q: 'Can I appear more often in investor recommendations?', a: 'Yes — readiness drives ranking. Complete financials, an uploaded deck, verified traction metrics and recent milestones compound your score. Profiles above 75 readiness appear in ~4× more investor feeds.' },
  { cat: 'Security & Privacy', q: 'Who can see my pitch deck and financials?', a: 'Only you by default. Deck sharing is per-connection and revocable — you grant access after accepting a connection, and watermarked previews prevent redistribution. Aggregated, anonymised stats (like "opened 3× this week") are the only signals the other side ever sees without grant.' },
  { cat: 'Security & Privacy', q: 'How are sessions and passwords secured?', a: 'Passwords are hashed with SHA-256 (salted per-user, strengthened at rest). Sessions use expiring tokens with refresh on activity, optional MFA via 6-digit codes, role-based access on every route, and a full audit log — sign-ins, connection events and admin actions are recorded.' },
  { cat: 'Communities', q: 'Why are founder and investor communities separate?', a: 'Deliberately. Founders need a safe room for term-sheet questions; investors need one for allocation candidness. Cross-pollination happens only through the structured connection flow, where both parties consent. Membership is enforced by role at the platform level.' },
  { cat: 'Funding & Tracking', q: 'What is the Funding Tracker?', a: 'A living timeline of your round: milestones, amounts and dates, connected to your real metrics. Founders see progress toward their target with runway context; investors see a pipeline view of every opportunity from intro to funded.' },
  { cat: 'Funding & Tracking', q: 'Does VentureSetu take a success fee?', a: 'No placement or success fees. We monetise through growth subscriptions and investor intelligence products. Capital moves directly between parties — we never touch the money.' },
];

/* ------------------------------------------------------------------- admin */
export const seedAudits: Audit[] = [
  { id: 'au-1', ts: now - 2 * HOUR, actor: 'meera@ardentpeak.vc', action: 'SESSION_LOGIN', target: 'self', ip: '49.207.•.•' },
  { id: 'au-2', ts: now - 5 * HOUR, actor: 'aarav@nexaflow.in', action: 'DECK_VIEW_INV1', target: 'Nexaflow_Seed_Deck_v7.pdf', ip: '106.51.•.•' },
  { id: 'au-3', ts: now - 9 * HOUR, actor: 'admin@venturesetu.in', action: 'USER_VERIFY', target: 'rahul@urbannest.in', ip: '10.0.•.•' },
  { id: 'au-4', ts: now - 1 * DAY, actor: 'aarav@nexaflow.in', action: 'CONN_SEND', target: 'inv-7 · Meridian Ventures', ip: '106.51.•.•' },
  { id: 'au-5', ts: now - 1 * DAY, actor: 'system', action: 'MATCH_REGEN', target: '218 pairs scored', ip: '—' },
  { id: 'au-6', ts: now - 2 * DAY, actor: 'rohan@tigerpeak.com', action: 'CONN_SEND', target: 'st-own · Nexaflow', ip: '101.56.•.•' },
  { id: 'au-7', ts: now - 2 * DAY, actor: 'aarav@nexaflow.in', action: 'SESSION_LOGIN_MFA_SKIP', target: 'self', ip: '106.51.•.•' },
  { id: 'au-8', ts: now - 3 * DAY, actor: 'admin@venturesetu.in', action: 'CONTENT_FLAG_RESOLVE', target: 'flag fc2-msg-88', ip: '10.0.•.•' },
];

export const seedFlags: Flag[] = [
  { id: 'fl-1', content: '"Guaranteed 3x returns — wire to this UPI to lock allocation" — posted in #deal-flow-desk', author: 'guest-8821 (unverified)', reason: 'Suspected investment fraud', ts: now - 4 * HOUR, status: 'open' },
  { id: 'fl-2', content: 'Deck link shared publicly in #pitch-feedback with watermark disabled request', author: 'anon-founder', reason: 'ToS circumvention', ts: now - 1 * DAY, status: 'open' },
  { id: 'fl-3', content: 'Spam recruitment post in #hiring-and-culture', author: 'agency-blr', reason: 'Spam', ts: now - 3 * DAY, status: 'resolved' },
];

/* -------------------------------------------------------------- market access */
export interface MarketProgram { id: string; title: string; org: string; kind: string; desc: string; points: string[]; hue: number; tags: string[] }
export const seedMarket: MarketProgram[] = [
  { id: 'mp-1', title: 'GeM Seller Onboarding Sprint', org: 'Government e-Marketplace', kind: 'Public Procurement', hue: 36, tags: ['B2G', 'Certification'], desc: 'A 4-week guided sprint to win your first government purchase orders — catalogue listing, bid mechanics and payment-cycle playbooks.', points: ['GeM + Udyam registration done-for-you', 'Bid library of 120 won tenders', 'Dedicated category mapping session'] },
  { id: 'mp-2', title: 'Enterprise Pilot Exchange', org: 'VentureSetu Corporate Network', kind: 'Corporate Access', hue: 205, tags: ['Pilots', 'B2B'], desc: 'Curated 1:1 meetings with innovation teams at 40+ enterprises running active pilots in fintech, manufacturing and retail.', points: ['2 curated intros per month', 'Pilot-to-contract legal templates', 'Reference-architecture reviews'] },
  { id: 'mp-3', title: 'Export Readiness — EU & GCC', org: 'FIEO × VentureSetu', kind: 'Export', hue: 96, tags: ['Export', 'Compliance'], desc: 'From IEC to first container: CE/GCC compliance mapping, logistics corridor selection and DDP pricing strategy.', points: ['Compliance gap report in 10 days', 'Freight-forwarder rate card access', 'Buyer matching at 2 trade fairs'] },
  { id: 'mp-4', title: 'Retail Shelf Access Program', org: 'Trade Guild Alliance', kind: 'Distribution', hue: 18, tags: ['D2C', 'Retail'], desc: 'Modern-trade and GT distributors accepting startup brands this quarter, with margin benchmarks and listing-fee negotiation support.', points: ['12 distributor intros per cohort', 'Listing-fee benchmarks by category', 'Merchandising audit before pitch'] },
  { id: 'mp-5', title: 'Bank Partnership Lounges', org: 'RBIH Community × 4 banks', kind: 'Fintech Rails', hue: 268, tags: ['Fintech', 'Banking'], desc: 'Structured office hours with bank innovation desks evaluating co-lending, UPI, and BaaS partnerships.', points: ['Fit assessment against live RFPs', 'Sandbox application review', 'Security-review readiness kit'] },
  { id: 'mp-6', title: 'Global Demo Corridors', org: 'VentureSetu International', kind: 'Expansion', hue: 326, tags: ['US', 'SEA', 'GTM'], desc: 'Week-long curated corridors to Singapore and the Bay Area: customer meetings, partner channels and relocation counsel.', points: ['10+ pre-qualified meetings', 'Entity & visa counsel sessions', 'Alumni founder host network'] },
];

/* ----------------------------------------------------------- landing stats */
export const landingStats = [
  { value: 2400, suffix: '+', label: 'Verified investors' },
  { value: 96, suffix: ',000 Cr', prefix: '₹', label: 'Capital deployed via intros' },
  { value: 7800, suffix: '+', label: 'Funded startups tracked' },
  { value: 34, suffix: ' days', label: 'Median intro-to-term-sheet' },
];

export const testimonials = [
  { quote: 'The match reasoning told me exactly why three funds fit before I sent a single deck. We closed our seed in 34 days — every step tracked in one private room.', name: 'Fenil Desai', role: 'Founder, Logiware (Series A)', hue: 205 },
  { quote: 'Readiness scores changed how I source. I meet four founders a week who arrive with data rooms ready, and the audit trail on deck access is genuinely compliance-grade.', name: 'Ritika Sen', role: 'Partner, Crestline India', hue: 326 },
  { quote: 'The founder community is the only place I\'d ask "is 2x liquidation preference normal" at 11pm. Answers in minutes, scars included.', name: 'Imran Qureshi', role: 'Founder, Medloop', hue: 150 },
];
