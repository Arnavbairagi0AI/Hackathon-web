import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calculator, Table2, ArrowRight, Info } from 'lucide-react';
import { Card, CardHead, Chip, Field, Input, Btn } from '../../components/ui';
import { Donut } from '../../components/charts';
import { SchemePageHead, JourneyStrip, BackLink } from './parts';
import { useScheme } from '../../lib/schemeStore';
import { schemeById } from '../../data/schemes';
import { computeRepayment, inr } from '../../utils/repayment';

/* ============================================================
   /app/schemes/repayment — selected scheme auto-fills rate,
   tenure, moratorium; user sets loan amount. Math comes
   verbatim from utils/repayment.ts (computeRepayment).
   ============================================================ */

export default function Repayment() {
  const schemeStore = useScheme();
  const { selectedSchemeId, profile } = schemeStore;
  const navigate = useNavigate();
  const scheme = selectedSchemeId ? schemeById(selectedSchemeId) : undefined;

  const [loanL, setLoanL] = useState<number>(profile.modelledLoanL ?? profile.requiredLoanL ?? scheme?.terms.loanRangeL[1] ?? 5);
  const [showFullTable, setShowFullTable] = useState(false);

  const summary = useMemo(
    () => (scheme ? computeRepayment(loanL, scheme.terms) : null),
    [scheme, loanL],
  );

  // Keep the modelled amount for the recommendation page.
  useEffect(() => {
    if (scheme && loanL > 0 && loanL !== profile.modelledLoanL) {
      schemeStore.setProfile({ modelledLoanL: loanL });
    }
  }, [scheme, loanL, profile.modelledLoanL]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!scheme || !summary) {
    return (
      <div className="mx-auto max-w-[980px]">
        <JourneyStrip />
        <SchemePageHead icon={<Calculator size={18} />} title="Repayment calculator" />
        <Card>
          <CardHead
            title="Select a scheme first"
            sub="The calculator pre-fills interest rate, tenure and moratorium from your chosen scheme."
            right={<Link to="/app/schemes/eligibility"><Btn size="sm">Go to eligibility results <ArrowRight size={14} /></Btn></Link>}
          />
        </Card>
      </div>
    );
  }

  const [minL, maxL] = scheme.terms.loanRangeL;
  const tableRows = showFullTable ? summary.schedule : summary.schedule.slice(0, 12);
  const outOfRange = loanL < minL || loanL > maxL;

  return (
    <div className="mx-auto max-w-[1100px]">
      <JourneyStrip />
      <SchemePageHead
        icon={<Calculator size={18} />}
        title="Repayment calculator"
        sub={<>Estimated Repayment — <strong className="font-semibold text-white/70">for demonstration purposes only</strong>. Actual rates and terms depend on the lender and the guidelines in force.</>}
        right={<BackLink to="/app/schemes/eligibility" label="Back to matches" />}
      />

      {/* selected scheme context */}
      <Card className="mb-5 flex flex-wrap items-center gap-3 px-5 py-4">
        <div className="mr-auto">
          <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/35">Selected scheme</div>
          <div className="text-[14px] font-semibold text-white/90">{scheme.name}</div>
        </div>
        <Chip tone="jade">{scheme.terms.interestRatePct}% p.a. (auto)</Chip>
        <Chip tone="jade">{scheme.terms.tenureMonths}-month tenure (auto)</Chip>
        <Chip tone="jade">{scheme.terms.moratoriumMonths}-month moratorium (auto)</Chip>
      </Card>

      <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
        {/* input */}
        <Card className="h-fit">
          <CardHead title="Loan amount" sub="The only field you need to set" />
          <div className="space-y-4 px-5 py-5">
            <Field label="Loan amount" hint="₹ lakh" required>
              <Input
                type="number" min={0} step={0.5} inputMode="decimal"
                value={loanL || ''}
                onChange={e => setLoanL(Math.max(0, Number(e.target.value) || 0))}
              />
            </Field>
            <input
              type="range" min={minL * 100000} max={maxL * 100000} step={25000}
              value={Math.min(Math.max(loanL, minL), maxL) * 100000}
              onChange={e => setLoanL(Number(e.target.value) / 100000)}
              className="w-full accent-[var(--acc)]"
              aria-label="Loan amount slider"
            />
            <div className="flex justify-between font-mono text-[11px] text-white/35">
              <span>₹{minL}L</span><span>₹{maxL}L</span>
            </div>
            {outOfRange && (
              <p className="rounded-xl border border-gold-400/25 bg-gold-400/[.07] px-3.5 py-2.5 text-[11.5px] leading-relaxed text-gold-200">
                Outside the scheme band — numbers still compute so you can compare, but this scheme funds ₹{minL}L–₹{maxL}L.
              </p>
            )}
          </div>
        </Card>

        {/* results */}
        <div className="space-y-5">
          <Card>
            <CardHead title="Estimated Repayment" sub="For demonstration purposes only — actual offers differ by lender" />
            <div className="grid gap-5 px-5 py-5 xl:grid-cols-[1fr_auto] xl:items-center">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  ['Monthly EMI', inr(summary.emi), summary.moratoriumMonths > 0 ? `after ${summary.moratoriumMonths}-mo moratorium` : 'from month 1'],
                  ['Total Interest', inr(summary.totalInterest), 'over full tenure'],
                  ['Total Repayment', inr(summary.totalRepayment), 'principal + interest'],
                  ['Tenure', `${summary.tenureMonths} mo`, summary.moratoriumMonths > 0 ? `${(summary.tenureMonths / 12).toFixed(1)} yrs · ${summary.moratoriumMonths}-mo moratorium` : 'no moratorium'],
                ].map(([label, value, sub]) => (
                  <div key={label} className="rounded-xl border border-white/[.07] bg-white/[.02] px-3.5 py-3">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/35">{label}</div>
                    <div className="mt-0.5 font-mono text-[16px] font-bold text-white/92">{value}</div>
                    <div className="mt-0.5 text-[10.5px] text-white/40">{sub}</div>
                  </div>
                ))}
              </div>
              <div className="xl:pl-2">
                <Donut
                  size={148}
                  segs={[
                    { label: 'Principal', value: summary.loanInr, color: '#d4a253' },
                    { label: 'Interest', value: summary.totalInterest, color: '#6f82f2' },
                  ]}
                  center={inr(summary.loanInr + summary.totalInterest)}
                  centerSub="total outflow"
                />
              </div>
            </div>
          </Card>

          {/* amortization */}
          <Card>
            <CardHead
              title={<span className="flex items-center gap-2"><Table2 size={14} /> Amortization schedule</span>}
              sub={`Month-by-month split · ${summary.moratoriumMonths > 0 ? `first ${summary.moratoriumMonths} months are interest-only moratorium` : 'EMI from month 1'}`}
              right={
                <button onClick={() => setShowFullTable(s => !s)} className="rounded-lg border border-white/15 px-3 py-1.5 text-[11.5px] text-white/70 transition hover:border-white/30 hover:bg-white/[.05]">
                  {showFullTable ? 'Show first year' : `Show all ${summary.schedule.length} months`}
                </button>
              }
            />
            <div className="max-h-[420px] overflow-auto">
              <table className="w-full min-w-[540px] text-[12px]">
                <thead className="sticky top-0 bg-ink-900/95 backdrop-blur">
                  <tr className="border-b border-white/[.07] text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-white/35">
                    <th className="px-5 py-2.5">Month</th>
                    <th className="px-5 py-2.5 text-right">Principal</th>
                    <th className="px-5 py-2.5 text-right">Interest</th>
                    <th className="px-5 py-2.5 text-right">EMI</th>
                    <th className="px-5 py-2.5 text-right">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {tableRows.map(r => (
                    <tr key={r.month} className={`border-b border-white/[.04] last:border-0 ${r.principal === 0 ? 'bg-gold-400/[.05]' : ''}`}>
                      <td className="px-5 py-2 font-mono font-medium text-white/85">
                        {r.month}
                        {r.month <= summary.moratoriumMonths && <span className="ml-1.5 text-[9px] font-semibold uppercase text-gold-300">moratorium</span>}
                      </td>
                      <td className="px-5 py-2 text-right font-mono text-white/65">{inr(r.principal)}</td>
                      <td className="px-5 py-2 text-right font-mono text-white/65">{inr(r.interest)}</td>
                      <td className="px-5 py-2 text-right font-mono text-white/65">{inr(r.emi)}</td>
                      <td className="px-5 py-2 text-right font-mono font-medium text-white/90">{inr(r.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
            <p className="flex items-center gap-2 text-[12.5px] text-white/55">
              <Info size={14} className="text-iris-400" />
              Happy with the estimate? Find who processes this scheme near you.
            </p>
            <Btn size="sm" onClick={() => { schemeStore.markComplete('repayment'); navigate('/app/schemes/partners'); }}>
              Continue to partner locator <ArrowRight size={14} />
            </Btn>
          </Card>
        </div>
      </div>
    </div>
  );
}
