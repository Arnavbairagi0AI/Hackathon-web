import { useState } from 'react';
import { ExternalLink, Check, Landmark } from 'lucide-react';
import { Card, CardHead, Btn, Chip } from '../../components/ui';
import { EligibilityReason, StatusChip } from './parts';
import type { SchemeMatch } from '../../lib/schemeTypes';

/* ============================================================
   One scheme result, restyled in the platform design system.
   Logic is untouched — renders the SchemeMatch produced by
   lib/eligibility.ts.
   ============================================================ */

export default function SchemeCard({ match, selected, onSelect }: {
  match: SchemeMatch;
  selected: boolean;
  onSelect: () => void;
}) {
  const [open, setOpen] = useState(false);
  const m = match;
  const eligible = m.status !== 'not-eligible';
  const [minL, maxL] = m.scheme.terms.loanRangeL;

  return (
    <Card hover className={selected ? 'border border-gold-400/50' : ''}>
      <CardHead
        title={
          <span className="flex flex-wrap items-center gap-2">
            <Landmark size={14} className="text-gold-300" />
            {m.scheme.name}
          </span>
        }
        sub={m.scheme.category}
        right={<StatusChip status={m.status} />}
      />
      <div className="px-5 py-4">
        {/* terms row */}
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-[12px] sm:grid-cols-4">
          {[
            ['Loan range', `₹${minL}L – ₹${maxL}L`],
            ['Interest', m.scheme.terms.interestRatePct > 0 ? `${m.scheme.terms.interestRatePct}% p.a.` : 'Nil (training)'],
            ['Tenure', `${m.scheme.terms.tenureMonths} months`],
            ['Moratorium', m.scheme.terms.moratoriumMonths > 0 ? `${m.scheme.terms.moratoriumMonths} mo` : 'None'],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/35">{label}</dt>
              <dd className="mt-0.5 font-mono text-[12.5px] font-medium text-white/85">{value}</dd>
            </div>
          ))}
        </dl>

        {/* why this matches / not eligible */}
        <div className="mt-4">
          {eligible ? (
            <>
              <button
                onClick={() => setOpen(o => !o)}
                aria-expanded={open}
                className="w-full rounded-xl border border-white/[.08] bg-white/[.03] px-3.5 py-2.5 text-left text-[12.5px] font-medium text-white/80 transition hover:border-white/20 hover:bg-white/[.06]"
              >
                Why this matches
              </button>
              {open && (
                <div className="mt-2.5 rounded-xl border border-white/[.07] bg-white/[.02] px-4 py-3.5">
                  <EligibilityReason criteria={m.criteria} />
                  <div className="mt-2.5 border-t border-white/[.05] pt-2 font-mono text-[10.5px] text-white/35">
                    score {m.score}% · prototype rules
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="rounded-xl border border-rose-400/20 bg-rose-400/[.06] px-4 py-3">
              <p className="text-[12px] font-semibold text-rose-200">Not eligible under prototype rules</p>
              <div className="mt-2">
                <EligibilityReason criteria={m.criteria.filter(c => c.status !== 'meets')} compact />
              </div>
            </div>
          )}
        </div>

        {/* actions */}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {eligible && (
            selected
              ? <Btn variant="dark" size="sm" disabled><Check size={13} /> Scheme selected</Btn>
              : <Btn size="sm" onClick={onSelect}>Select Scheme</Btn>
          )}
          <a
            href={m.scheme.officialSource}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-[12px] font-medium text-gold-300/90 transition hover:text-gold-200"
          >
            Official portal <ExternalLink size={12} />
          </a>
          {selected && <Chip tone="jade">carries into repayment</Chip>}
        </div>
      </div>
    </Card>
  );
}
