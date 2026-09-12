import { Link } from 'react-router-dom';
import { CheckCircle2, AlertTriangle, XCircle, MinusCircle, ArrowLeft, Info } from 'lucide-react';
import { Chip } from '../../components/ui';
import { useScheme } from '../../lib/schemeStore';
import type { Criterion, EligibilityStatus } from '../../lib/schemeTypes';

/* ============================================================
   Shared presentation pieces for the scheme flow. Pure render —
   all logic lives in lib/eligibility.ts and utils/repayment.ts,
   which are ported verbatim.
   ============================================================ */

export function SchemePageHead({ icon, title, sub, right }: {
  icon: React.ReactNode; title: string; sub?: React.ReactNode; right?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="flex items-center gap-2.5 text-[24px] font-bold tracking-tight text-white sm:text-[27px]">
          <span className="a-soft flex h-10 w-10 items-center justify-center rounded-xl">{icon}</span>
          {title}
        </h1>
        {sub && <p className="mt-1.5 max-w-2xl text-[13px] leading-relaxed text-white/45">{sub}</p>}
      </div>
      {right}
    </div>
  );
}

export function BackLink({ to, label }: { to: string; label: string }) {
  return (
    <Link to={to} className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-white/50 transition hover:text-white/85">
      <ArrowLeft size={14} /> {label}
    </Link>
  );
}

const STATUS_CHIP: Record<EligibilityStatus, { tone: 'jade' | 'gold' | 'rose'; label: string }> = {
  'eligible': { tone: 'jade', label: 'Eligible' },
  'partially-eligible': { tone: 'gold', label: 'Partially eligible' },
  'not-eligible': { tone: 'rose', label: 'Not eligible' },
};

export function StatusChip({ status }: { status: EligibilityStatus }) {
  const s = STATUS_CHIP[status];
  return <Chip tone={s.tone}>{s.label}</Chip>;
}

const CRIT_META = {
  meets: { icon: CheckCircle2, cls: 'text-emerald-400', word: 'Meets' },
  partial: { icon: AlertTriangle, cls: 'text-gold-400', word: 'Partial' },
  unmet: { icon: XCircle, cls: 'text-rose-400', word: 'Gap' },
} as const;

export function EligibilityReason({ criteria, compact = false }: { criteria: Criterion[]; compact?: boolean }) {
  return (
    <ul className={compact ? 'space-y-1.5' : 'space-y-2.5'}>
      {criteria.map(c => {
        const m = CRIT_META[c.status];
        const Icon = m.icon;
        return (
          <li key={c.id} className="flex items-start gap-2.5">
            <Icon size={15} className={`mt-0.5 shrink-0 ${m.cls}`} />
            <div className="min-w-0">
              <span className={`text-[12.5px] font-medium ${c.status === 'meets' ? 'text-white/85' : c.status === 'partial' ? 'text-gold-200' : 'text-rose-200'}`}>
                {c.label} · {m.word}
              </span>
              {!compact && <span className="block text-[11.5px] leading-snug text-white/40">{c.detail}</span>}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function MockDataNote({ className = '' }: { className?: string }) {
  return (
    <p className={`flex items-start gap-2 text-[11px] leading-relaxed text-white/35 ${className}`}>
      <Info size={12} className="mt-0.5 shrink-0" />
      Based on prototype scheme data — not real-time government decisions. Verify current scheme terms
      with the concerned authority before acting.
    </p>
  );
}

/** The Profile → Eligibility → Repayment → Partner → Recommendation strip. */
const STEPS: { id: 'profile' | 'eligibility' | 'repayment' | 'partner'; label: string; to: string }[] = [
  { id: 'profile', label: 'Profile', to: '/app/schemes/profile' },
  { id: 'eligibility', label: 'Eligibility', to: '/app/schemes/eligibility' },
  { id: 'repayment', label: 'Repayment', to: '/app/schemes/repayment' },
  { id: 'partner', label: 'Partner', to: '/app/schemes/partners' },
];

export function JourneyStrip() {
  const scheme = useScheme();
  const profileDone = Boolean(scheme.profile.projectType && scheme.profile.location && scheme.profile.projectCostL > 0);
  return (
    <ol className="mb-6 flex flex-wrap items-center gap-x-1 gap-y-1.5 text-[11.5px]" aria-label="Scheme journey progress">
      {STEPS.map((s, i) => {
        const done = s.id === 'profile' ? profileDone : Boolean(scheme.completed[s.id]);
        return (
          <li key={s.id} className="flex items-center">
            <Link
              to={s.to}
              className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 transition ${
                done ? 'text-emerald-300/90 hover:bg-white/[.05]' : 'text-white/35 hover:bg-white/[.05]'
              }`}
            >
              <span className={`flex h-[18px] w-[18px] items-center justify-center rounded-full text-[9.5px] font-bold ${
                done ? 'bg-emerald-400/90 text-ink-950' : 'border border-white/15 text-white/40'
              }`}>
                {done ? '✓' : i + 1}
              </span>
              {s.label}
            </Link>
            {i < STEPS.length - 1 && <MinusCircle size={10} className="mx-1 text-white/15" aria-hidden />}
          </li>
        );
      })}
    </ol>
  );
}
