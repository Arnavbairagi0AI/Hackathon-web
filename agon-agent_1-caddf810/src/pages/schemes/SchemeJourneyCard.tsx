import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BadgeIndianRupee, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Card, CardHead, Btn, Chip } from '../../components/ui';
import { useScheme } from '../../lib/schemeStore';
import { useApp, activeStartup } from '../../lib/store';
import { recommendSchemes } from '../../lib/eligibility';

/* ============================================================
   Founder-dashboard card wiring the scheme-eligibility flow
   into the investor-matching platform. Shows journey progress
   and, when the profile is complete, the top scheme match.
   ============================================================ */

export default function SchemeJourneyCard() {
  const scheme = useScheme();
  const { db, user } = useApp();
  const nav = useNavigate();
  const st = activeStartup(db, user);

  const valid = Boolean(
    scheme.profile.education && scheme.profile.projectType && scheme.profile.location &&
    scheme.profile.projectCostL > 0 && scheme.profile.requiredLoanL > 0,
  );

  const top = useMemo(() => (valid ? recommendSchemes(scheme.profile).find(m => m.status !== 'not-eligible') : undefined), [valid, scheme.profile]);

  const doneCount = [
    valid,
    scheme.completed.eligibility,
    scheme.completed.repayment,
    scheme.completed.partner,
  ].filter(Boolean).length;

  const sectorHint = st ? `Tune answers for ${st.name}'s sector (${st.sector.toLowerCase()}).` : 'Plan scheme-linked finance alongside your raise.';

  return (
    <Card>
      <CardHead
        title={
          <span className="flex items-center gap-2">
            <BadgeIndianRupee size={14} className="text-gold-300" /> Government scheme eligibility
          </span>
        }
        sub="Can I qualify? → What will I repay? → Where should I go?"
        right={<Chip tone={doneCount === 4 ? 'jade' : 'gold'}>{doneCount}/4 steps</Chip>}
      />
      <div className="px-5 py-4">
        {top ? (
          <div className="mb-3 rounded-xl border border-white/[.07] bg-white/[.02] px-4 py-3">
            <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/35">Top match for your profile</div>
            <div className="mt-0.5 text-[13.5px] font-semibold text-white/90">{top.scheme.name}</div>
            <div className="mt-0.5 font-mono text-[11px] text-white/40">
              ₹{top.scheme.terms.loanRangeL[0]}L–₹{top.scheme.terms.loanRangeL[1]}L · {top.scheme.terms.interestRatePct}% p.a. · EMI from {top.scheme.terms.tenureMonths}mo
            </div>
          </div>
        ) : (
          <p className="mb-3 text-[12.5px] leading-relaxed text-white/50">{sectorHint}</p>
        )}

        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            {['Profile', 'Eligibility', 'Repayment', 'Partner'].map((label, i) => {
              const done = [valid, scheme.completed.eligibility, scheme.completed.repayment, scheme.completed.partner][i];
              return (
                <span key={label} className={`flex items-center gap-1 text-[10.5px] font-medium ${done ? 'text-emerald-300/80' : 'text-white/30'}`}>
                  {done ? <CheckCircle2 size={11} /> : <span className="h-1.5 w-1.5 rounded-full bg-white/15" />}
                  {label}
                </span>
              );
            })}
          </div>
          <Btn size="sm" variant={doneCount === 4 ? 'outline' : 'accent'} onClick={() => nav('/app/schemes/profile')}>
            {doneCount === 0 ? 'Check eligibility' : doneCount === 4 ? 'Review plan' : 'Continue'} <ArrowRight size={13} />
          </Btn>
        </div>

        <p className="mt-3 text-[10.5px] leading-relaxed text-white/30">
          Prototype scheme data — not real-time government decisions. Verify with the concerned authority.
        </p>
      </div>
    </Card>
  );
}
