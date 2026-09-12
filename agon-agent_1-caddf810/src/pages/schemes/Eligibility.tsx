import { useEffect, useMemo, useReducer } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, UserRound } from 'lucide-react';
import { Card, CardHead, Chip, Btn, EmptyState } from '../../components/ui';
import SchemeCard from './SchemeCard';
import { SchemePageHead, JourneyStrip, BackLink, MockDataNote } from './parts';
import { useScheme } from '../../lib/schemeStore';
import { recommendSchemes, profileValid } from '../../lib/eligibility';

/* ============================================================
   /app/schemes/eligibility — results first. Calls the ported
   recommendSchemes(profile) verbatim; only the rendering is
   rebuilt on the platform design system.
   ============================================================ */

let lastRunKey: string | null = null;

export default function Eligibility() {
  const scheme = useScheme();
  const { profile, selectedSchemeId } = scheme;
  const navigate = useNavigate();
  const valid = profileValid(profile);

  const matches = useMemo(() => (valid ? recommendSchemes(profile) : []), [valid, profile]);

  // Brief computed-matching pause on the first run for a profile. The
  // "last computed profile" key lives in module scope (survives route
  // remounts) and `loading` is DERIVED from it, so the spinner can never
  // get stuck — any render where the profile matches the last computed
  // one shows results immediately, StrictMode double-invoke included.
  const [, forceRender] = useReducer(x => x + 1, 0);
  const profileKey = `${profile.projectType}|${profile.projectCostL}|${profile.requiredLoanL}|${profile.location}|${profile.education}`;
  const loading = valid && lastRunKey !== profileKey;
  useEffect(() => {
    if (!loading) return;
    const t = setTimeout(() => {
      lastRunKey = profileKey;
      forceRender();
    }, 700);
    return () => clearTimeout(t);
  }, [loading, profileKey]);

  const eligible = matches.filter(m => m.status !== 'not-eligible');
  const notEligible = matches.filter(m => m.status === 'not-eligible');

  const choose = (id: string) => {
    scheme.selectScheme(id);
    scheme.markComplete('eligibility');
  };

  if (!valid) {
    return (
      <div className="mx-auto max-w-[980px]">
        <JourneyStrip />
        <SchemePageHead icon={<Sparkles size={18} />} title="Eligibility results" />
        <Card>
          <EmptyState
            icon={<UserRound size={20} />}
            title="Complete your applicant profile first"
            sub="Education, project type, cost, loan amount and location are needed to check scheme rules."
            action={<Link to="/app/schemes/profile"><Btn size="md">Fill the profile <ArrowRight size={15} /></Btn></Link>}
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[980px]">
      <JourneyStrip />
      <SchemePageHead
        icon={<Sparkles size={18} />}
        title="Eligibility results"
        sub="Checked against prototype scheme data — not real-time government decisions. Verify current terms with the concerned authority."
        right={<BackLink to="/app/schemes/profile" label="Edit profile" />}
      />

      {/* profile summary strip */}
      <Card className="mb-5 px-5 py-3.5">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[12.5px] text-white/60">
          <span className="font-semibold text-white/90">{profile.location}</span>
          <span className="text-white/20">·</span>
          <span>{profile.projectType.replace('-', ' ')}</span>
          <span className="text-white/20">·</span>
          <span>project ₹{profile.projectCostL}L</span>
          <span className="text-white/20">·</span>
          <span className="font-medium text-white/85">loan ₹{profile.requiredLoanL}L</span>
        </div>
      </Card>

      {loading ? (
        <Card className="px-5 py-12">
          <div className="mx-auto flex flex-col items-center gap-3">
            <span className="h-10 w-10 animate-spin rounded-full border-[3px] border-white/10 border-t-gold-400" />
            <p className="text-[13px] font-medium text-white/70">Checking your profile against scheme requirements…</p>
            <p className="text-[11px] text-white/35">Running local prototype rules — nothing is sent anywhere.</p>
          </div>
        </Card>
      ) : (
        <>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <h2 className="mr-auto text-[15px] font-semibold text-white/90">Your matches</h2>
            <Chip tone="jade">{eligible.length} eligible / partial</Chip>
            <Chip tone="rose">{notEligible.length} not eligible</Chip>
          </div>

          <div className="space-y-4">
            {eligible.map(m => (
              <SchemeCard
                key={m.scheme.id}
                match={m}
                selected={selectedSchemeId === m.scheme.id}
                onSelect={() => choose(m.scheme.id)}
              />
            ))}
          </div>

          {eligible.length === 0 && (
            <p className="rounded-xl border border-white/10 bg-white/[.03] px-4 py-3 text-[12px] text-white/50">
              No scheme in the prototype catalogue matches these answers. Try a lower loan amount or a different
              category — the prototype data covers only a small sample of India's schemes.
            </p>
          )}

          {notEligible.length > 0 && (
            <details className="group mt-4">
              <summary className="flex cursor-pointer list-none items-center gap-2 text-[13px] font-medium text-white/50 transition hover:text-white/80">
                {notEligible.length} scheme(s) not matched — show why
              </summary>
              <div className="mt-3 space-y-4">
                {notEligible.map(m => (
                  <SchemeCard key={m.scheme.id} match={m} selected={false} onSelect={() => {}} />
                ))}
              </div>
            </details>
          )}

          <Card className="mt-5">
            <CardHead
              title="Next: estimated repayment"
              sub={selectedSchemeId ? 'Your selected scheme pre-fills interest, tenure and moratorium.' : 'Select a scheme above to pre-fill the calculator.'}
              right={
                <Btn size="sm" disabled={!selectedSchemeId} onClick={() => navigate('/app/schemes/repayment')}>
                  Continue to repayment <ArrowRight size={14} />
                </Btn>
              }
            />
          </Card>

          <MockDataNote className="mt-4" />
        </>
      )}
    </div>
  );
}
