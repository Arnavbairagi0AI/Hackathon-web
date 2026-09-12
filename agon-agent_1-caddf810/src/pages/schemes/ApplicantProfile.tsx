import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, Lock, CheckCircle2, ArrowRight } from 'lucide-react';
import { Card, CardHead, Chip, Field, Input, Select, Btn } from '../../components/ui';
import { SchemePageHead, JourneyStrip, BackLink } from './parts';
import { useScheme } from '../../lib/schemeStore';
import {
  APPLICANT_CATEGORIES, EDUCATION_LEVELS, INCOME_BANDS, PROJECT_TYPES, STATES,
  type Profile,
} from '../../lib/schemeTypes';

/* ============================================================
   /app/schemes/profile — the seven-field applicant profile.
   Presentation rebuilt on the platform design system; the
   validation rules and data shape are unchanged.
   ============================================================ */


export default function ApplicantProfile() {
  const scheme = useScheme();
  const { profile } = scheme;
  const navigate = useNavigate();
  const [touched, setTouched] = useState<Partial<Record<keyof Profile, boolean>>>({});

  const valid = Boolean(
    profile.education && profile.projectType && profile.location &&
    profile.projectCostL > 0 && profile.requiredLoanL > 0 &&
    profile.requiredLoanL <= (profile.projectCostL || Infinity),
  );

  const set = <K extends keyof Profile>(k: K, v: Profile[K]) => {
    scheme.setProfile({ [k]: v } as Partial<Profile>);
    setTouched(t => ({ ...t, [k]: true }));
  };

  const errCls = (k: keyof Profile, ok: boolean) =>
    touched[k] && !ok ? 'border-rose-400/50 bg-rose-400/[.06]' : touched[k] && ok ? 'border-emerald-400/40' : '';
  const fieldError = (k: keyof Profile, msg: string) =>
    touched[k] ? <span role="alert" className="mt-1 block text-[11px] font-medium text-rose-300">{msg}</span> : null;

  const submit = () => {
    setTouched({ projectType: true, projectCostL: true, requiredLoanL: true, location: true, education: true });
    if (valid) {
      scheme.markComplete('profile');
      navigate('/app/schemes/eligibility');
    }
  };

  return (
    <div className="mx-auto max-w-[980px]">
      <JourneyStrip />
      <SchemePageHead
        icon={<ClipboardList size={18} />}
        title="Scheme eligibility — applicant profile"
        sub="Seven quick questions. The recommender checks these against each scheme's requirements — answers stay in this browser."
        right={<Chip tone={valid ? 'jade' : 'gold'}>{valid ? 'Ready to check' : 'Fill all fields'}</Chip>}
      />

      <Card>
        <CardHead
          title="Your details"
          sub="Fields marked * are required · no sensitive documents or credentials are collected"
          right={<BackLink to="/app/dashboard" label="Dashboard" />}
        />
        <div className="grid gap-4 px-5 py-5 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Applicant category">
            <Select
              value={profile.applicantCategory}
              onChange={e => set('applicantCategory', e.target.value as Profile['applicantCategory'])}
            >
              {APPLICANT_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </Select>
          </Field>

          <Field label="Annual family income" hint="for ceiling checks">
            <Select
              value={profile.annualFamilyIncomeBand}
              onChange={e => set('annualFamilyIncomeBand', e.target.value as Profile['annualFamilyIncomeBand'])}
            >
              {INCOME_BANDS.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
            </Select>
          </Field>

          <Field label="Education" required>
            <Select
              className={errCls('education', !!profile.education)}
              value={profile.education}
              onChange={e => set('education', e.target.value as Profile['education'])}
            >
              <option value="">Select education…</option>
              {EDUCATION_LEVELS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
            </Select>
            {fieldError('education', 'Select your education level.')}
          </Field>

          <Field label="Project type" required>
            <Select
              className={errCls('projectType', !!profile.projectType)}
              value={profile.projectType}
              onChange={e => set('projectType', e.target.value)}
            >
              <option value="">Select project type…</option>
              {PROJECT_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
            </Select>
            {fieldError('projectType', 'Select your project type.')}
          </Field>

          <Field label="Project cost" hint="₹ lakh" required>
            <Input
              type="number" min={0} step={0.5} inputMode="decimal"
              className={errCls('projectCostL', profile.projectCostL > 0)}
              value={profile.projectCostL || ''}
              onChange={e => set('projectCostL', Math.max(0, Number(e.target.value) || 0))}
              placeholder="e.g. 8"
            />
            {fieldError('projectCostL', 'Enter the estimated project cost.')}
          </Field>

          <Field
            label="Required loan amount"
            hint={touched.requiredLoanL && profile.projectCostL > 0 && profile.requiredLoanL > profile.projectCostL
              ? <span className="text-rose-300">exceeds project cost</span>
              : '₹ lakh'}
            required
          >
            <Input
              type="number" min={0} step={0.5} inputMode="decimal"
              className={errCls('requiredLoanL', profile.requiredLoanL > 0 && profile.requiredLoanL <= (profile.projectCostL || Infinity))}
              value={profile.requiredLoanL || ''}
              onChange={e => set('requiredLoanL', Math.max(0, Number(e.target.value) || 0))}
              placeholder="e.g. 5"
            />
            {fieldError('requiredLoanL', 'Enter the loan amount you need.')}
          </Field>

          <Field label="Location" hint="state" required>
            <Select
              className={errCls('location', !!profile.location)}
              value={profile.location}
              onChange={e => set('location', e.target.value)}
            >
              <option value="">Select state…</option>
              {STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </Select>
            {fieldError('location', 'Select your state.')}
          </Field>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[.06] px-5 py-4">
          <p className="flex items-center gap-1.5 text-[11.5px] text-white/40">
            <Lock size={12} /> No Aadhaar, PAN, OTP or passwords — this form never collects credentials.
          </p>
          <div className="flex gap-2">
            <Btn variant="outline" size="sm" onClick={() => scheme.resetScheme()}>Reset</Btn>
            <Btn size="sm" onClick={submit} disabled={!valid}>
              Check My Eligibility <ArrowRight size={14} />
            </Btn>
          </div>
        </div>
      </Card>

      {valid && (
        <p className="mt-3 flex items-center gap-1.5 text-[12px] text-emerald-300/80">
          <CheckCircle2 size={13} /> Saved in this browser — continue anytime.
        </p>
      )}
    </div>
  );
}
