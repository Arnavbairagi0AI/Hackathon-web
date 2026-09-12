import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  FileCheck2, Printer, ShieldAlert, CheckCircle2, MapPin, Building2, ExternalLink, ArrowRight,
} from 'lucide-react';
import { Card, CardHead, Chip, Btn } from '../../components/ui';
import { SchemePageHead, JourneyStrip, BackLink, EligibilityReason } from './parts';
import { useScheme } from '../../lib/schemeStore';
import { recommendSchemes } from '../../lib/eligibility';
import { schemeById } from '../../data/schemes';
import { PARTNERS } from '../../data/partners';
import { computeRepayment, inr } from '../../utils/repayment';

/* ============================================================
   /app/schemes/recommendation — one-page final output. Calls
   the ported engine (recommendSchemes, computeRepayment)
   verbatim; only rendering is rebuilt.
   ============================================================ */

export default function Recommendation() {
  const schemeStore = useScheme();
  const { profile, selectedSchemeId, selectedPartnerId } = schemeStore;

  const valid = Boolean(
    profile.education && profile.projectType && profile.location && profile.projectCostL > 0 && profile.requiredLoanL > 0,
  );

  const matches = useMemo(() => (valid ? recommendSchemes(profile) : []), [valid, profile]);
  const scheme = selectedSchemeId ? schemeById(selectedSchemeId) : matches.find(m => m.status !== 'not-eligible')?.scheme;

  const partner = useMemo(() => {
    if (selectedPartnerId) return PARTNERS.find(p => p.id === selectedPartnerId);
    if (!scheme) return undefined;
    return PARTNERS.filter(p => p.authorizedSchemeIds.includes(scheme.id)).sort((a, b) => a.distanceKm - b.distanceKm)[0];
  }, [selectedPartnerId, scheme]);

  const summary = useMemo(
    () => (scheme ? computeRepayment((profile.modelledLoanL ?? profile.requiredLoanL) || scheme.terms.loanRangeL[0], scheme.terms) : null),
    [scheme, profile.modelledLoanL, profile.requiredLoanL],
  );

  const whyMatch = useMemo(
    () => (scheme ? matches.find(m => m.scheme.id === scheme.id) : undefined),
    [matches, scheme],
  );

  if (!valid) {
    return (
      <div className="mx-auto max-w-[980px]">
        <JourneyStrip />
        <SchemePageHead icon={<FileCheck2 size={18} />} title="Final recommendation" />
        <Card>
          <CardHead
            title="Complete the journey steps first"
            sub="Fill the applicant profile and review your eligibility results — this page assembles your one-page summary automatically."
            right={<Link to="/app/schemes/profile"><Btn size="sm">Start with the profile <ArrowRight size={14} /></Btn></Link>}
          />
        </Card>
      </div>
    );
  }

  if (!scheme || !summary) {
    return (
      <div className="mx-auto max-w-[980px]">
        <JourneyStrip />
        <SchemePageHead icon={<FileCheck2 size={18} />} title="Final recommendation" />
        <Card>
          <CardHead
            title="No eligible scheme selected yet"
            sub="Review your matches and select a scheme so this page can assemble your recommendation."
            right={<Link to="/app/schemes/eligibility"><Btn size="sm">Go to eligibility results <ArrowRight size={14} /></Btn></Link>}
          />
        </Card>
      </div>
    );
  }

  const [minL, maxL] = scheme.terms.loanRangeL;

  return (
    <div className="mx-auto max-w-[1000px]">
      <JourneyStrip />
      <SchemePageHead
        icon={<FileCheck2 size={18} />}
        title="Final recommendation"
        sub={<>Assembled from <strong className="font-semibold text-white/70">prototype data</strong> for planning and verification — not a sanction decision.</>}
        right={
          <div className="flex items-center gap-3">
            <BackLink to="/app/schemes/partners" label="Back to partners" />
            <Btn variant="outline" size="sm" onClick={() => window.print()}><Printer size={14} /> Print / PDF</Btn>
          </div>
        }
      />

      {/* recommended scheme */}
      <Card className="mb-5 border-gold-400/25">
        <CardHead
          title={<span className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/40">Recommended scheme</span>}
          sub="Closest fit under prototype rules — always verify on the official portal"
          right={<Chip tone="gold">{scheme.category}</Chip>}
        />
        <div className="flex flex-wrap items-center gap-4 px-5 py-5">
          <span className="a-soft flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"><Building2 size={20} /></span>
          <div className="min-w-0 flex-1">
            <h2 className="text-[18px] font-bold tracking-tight text-white">{scheme.name}</h2>
            <dl className="mt-2 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[12px] text-white/60">
              <div><dt className="inline text-white/35">Loan range: </dt><dd className="inline font-semibold text-white/85">₹{minL}L – ₹{maxL}L</dd></div>
              <div><dt className="inline text-white/35">Interest: </dt><dd className="inline font-semibold text-white/85">{scheme.terms.interestRatePct}% p.a.</dd></div>
              <div><dt className="inline text-white/35">Tenure: </dt><dd className="inline font-semibold text-white/85">{scheme.terms.tenureMonths} mo</dd></div>
              <div><dt className="inline text-white/35">Moratorium: </dt><dd className="inline font-semibold text-white/85">{scheme.terms.moratoriumMonths} mo</dd></div>
            </dl>
          </div>
          <a href={scheme.officialSource} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[12px] font-medium text-gold-300/90 transition hover:text-gold-200">
            Official portal <ExternalLink size={12} />
          </a>
        </div>
      </Card>

      <div className="mb-5 grid gap-5 lg:grid-cols-2">
        {/* why you match */}
        <Card>
          <CardHead title="Why you match" sub="Checked against this scheme's prototype requirements" />
          <div className="px-5 py-5">
            {whyMatch
              ? <EligibilityReason criteria={whyMatch.criteria} />
              : <p className="text-[12.5px] text-white/45">Criteria will appear after matching runs.</p>}
            {whyMatch?.criteria.every(c => c.status === 'meets') && (
              <p className="mt-3 flex items-center gap-1.5 text-[12px] text-emerald-300/80">
                <CheckCircle2 size={13} /> All criteria satisfied.
              </p>
            )}
          </div>
        </Card>

        {/* estimated repayment */}
        <Card>
          <CardHead title="Estimated repayment" sub="For demonstration purposes only — actual offers differ by lender" />
          <div className="grid grid-cols-2 gap-3 px-5 py-5">
            <div className="rounded-xl border border-white/[.07] bg-white/[.02] px-3.5 py-3">
              <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/35">Loan amount</div>
              <div className="mt-0.5 font-mono text-[15px] font-bold text-white/90">{inr(summary.loanInr)}</div>
            </div>
            <div className="rounded-xl border border-white/[.07] bg-white/[.02] px-3.5 py-3">
              <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/35">Interest rate</div>
              <div className="mt-0.5 font-mono text-[15px] font-bold text-white/90">{scheme.terms.interestRatePct}% p.a.</div>
            </div>
            <div className="rounded-xl border border-gold-400/30 bg-gold-400/[.06] px-3.5 py-3">
              <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gold-200/70">Estimated EMI</div>
              <div className="mt-0.5 font-mono text-[15px] font-bold text-white">{inr(summary.emi)}</div>
            </div>
            <div className="rounded-xl border border-white/[.07] bg-white/[.02] px-3.5 py-3">
              <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/35">Total interest</div>
              <div className="mt-0.5 font-mono text-[15px] font-bold text-white/90">{inr(summary.totalInterest)}</div>
            </div>
            <div className="col-span-2 rounded-xl border border-white/[.07] bg-white/[.02] px-3.5 py-3">
              <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/35">Tenure</div>
              <div className="mt-0.5 text-[13px] font-semibold text-white/85">
                {summary.tenureMonths} months
                {summary.moratoriumMonths > 0 && <span className="font-normal text-white/45"> · includes a {summary.moratoriumMonths}-month moratorium</span>}
              </div>
            </div>
          </div>
          <div className="border-t border-white/[.06] px-5 py-3">
            <Link to="/app/schemes/repayment" className="text-[12px] font-medium text-gold-300/90 transition hover:text-gold-200">
              Open the full calculator →
            </Link>
          </div>
        </Card>
      </div>

      {/* authorized partner */}
      <Card className="mb-5">
        <CardHead title="Authorized partner" sub="Where this route is typically processed — verify before visiting" />
        {partner ? (
          <div className="flex flex-wrap items-center gap-4 px-5 py-5">
            <span className="a-soft flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"><Building2 size={18} /></span>
            <div className="min-w-0 flex-1">
              <h3 className="text-[14.5px] font-semibold text-white/90">{partner.name}</h3>
              <p className="text-[12px] text-white/45">{partner.type}</p>
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[12px] text-white/60">
              <span className="flex items-center gap-1.5"><MapPin size={12} className="text-white/35" /> {partner.location}</span>
              <span className="font-mono">{partner.distanceKm} km <span className="text-white/30">(mock)</span></span>
              <Chip tone={partner.authorization === 'authorized' ? 'jade' : partner.authorization === 'empanelled' ? 'gold' : 'iris'}>
                {partner.authorization === 'authorized' ? 'Authorized' : partner.authorization === 'empanelled' ? 'Empanelled' : 'Referral desk'}
              </Chip>
            </div>
          </div>
        ) : (
          <div className="px-5 py-5 text-[13px] text-white/55">
            No partner is catalogued for this scheme — ask your District Industries Centre for the current list of handling institutions.
          </div>
        )}
        <div className="border-t border-white/[.06] px-5 py-3">
          <Link to="/app/schemes/partners" className="text-[12px] font-medium text-gold-300/90 transition hover:text-gold-200">
            Browse all partners & filters →
          </Link>
        </div>
      </Card>

      {/* next steps */}
      <Card className="mb-5">
        <CardHead title="Next steps" sub="In order" />
        <ol className="grid gap-3 px-5 py-5 sm:grid-cols-2">
          {[
            { t: 'Review scheme eligibility', d: 'Read the full criteria on the official portal and confirm nothing has changed.', to: '/app/schemes/eligibility' },
            { t: 'Review repayment estimate', d: 'Adjust the loan amount and check the month-by-month schedule.', to: '/app/schemes/repayment' },
            { t: 'Contact the authorized partner', d: `Call or visit ${partner ? partner.name : 'the handling institution'} and confirm they process this scheme.`, to: '/app/schemes/partners' },
            { t: 'Verify current scheme terms', d: 'Rates, ceilings and guidelines change — the official portal is always authoritative.', to: '/app/schemes/about' },
          ].map((s, i) => (
            <li key={s.t}>
              <Link to={s.to} className="flex items-start gap-3 rounded-xl border border-white/[.07] bg-white/[.02] px-4 py-3.5 transition hover:border-white/20 hover:bg-white/[.05]">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/[.08] font-mono text-[12px] font-bold text-gold-300">{i + 1}</span>
                <span>
                  <span className="block text-[13px] font-semibold text-white/90">{s.t}</span>
                  <span className="block text-[11.5px] leading-snug text-white/45">{s.d}</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </Card>

      {/* disclaimers */}
      <div className="rounded-xl border border-gold-400/25 bg-gold-400/[.06] px-4 py-3 text-[12.5px] leading-relaxed text-gold-100">
        <strong className="font-semibold">VentureSetu provides scheme matching and repayment estimates.</strong> It does not
        guarantee loan approval, funding availability or disbursement. All figures come from prototype data; only the
        concerned authority and the lending institution can confirm current terms.
      </div>
      <div className="mt-3 flex items-start gap-3 rounded-xl border border-white/[.07] bg-white/[.02] px-4 py-3.5">
        <ShieldAlert size={16} className="mt-0.5 shrink-0 text-gold-400" />
        <p className="text-[12px] leading-relaxed text-white/55">
          <strong className="font-semibold text-white/80">Fraud reminder:</strong> never pay anyone who claims they can
          "confirm" your scheme loan. Official applications are free; decisions arrive only from the lending institution in writing.
        </p>
      </div>

      <Card className="mt-5 flex flex-wrap items-center justify-between gap-3 px-5 py-4">
        <p className="text-[12.5px] text-white/55">Want to compare a different route?</p>
        <Btn variant="outline" size="sm" onClick={() => schemeStore.selectScheme(null)}>Re-run eligibility</Btn>
      </Card>
    </div>
  );
}
