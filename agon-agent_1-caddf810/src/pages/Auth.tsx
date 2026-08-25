import { useState, type ReactNode, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Landmark, Rocket, ShieldCheck, Eye, EyeOff, KeyRound, MailCheck, Copy, Check } from 'lucide-react';
import { Logo, Btn, Input, Field, toast } from '../components/ui';
import { useApp } from '../lib/store';

/* ------------------------------------------------------------ backdrop */
function AuthShell({ children, side }: { children: ReactNode; side: 'founder' | 'investor' }) {
  return (
    <div data-role={side} className="flex min-h-screen bg-ink-950">
      {/* brand rail */}
      <div className="relative hidden w-[44%] overflow-hidden lg:block">
        <div className="aurora-pan absolute inset-0 bg-[url('/img/network.jpg')] bg-cover bg-center opacity-55" />
        <div className={`absolute inset-0 bg-gradient-to-tr ${side === 'founder' ? 'from-ink-950 via-ink-950/72 to-gold-600/20' : 'from-ink-950 via-ink-950/72 to-iris-600/25'}`} />
        <div className="relative flex h-full flex-col justify-between p-10">
          <Link to="/"><Logo size={34} /></Link>
          <div>
            <p className="serif-i text-[30px] leading-snug text-white/90">“Every great round begins as a conversation — we just make sure it‛s the right one.”</p>
            <div className="mt-5 flex items-center gap-3">
              <span className="h-10 w-10 rounded-full bg-gradient-to-br from-gold-400 to-gold-600" />
              <div>
                <div className="text-[13.5px] font-semibold text-white">Meera Krishnan</div>
                <div className="text-[11.5px] text-white/50">Partner, Ardent Peak Capital</div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-5 font-mono text-[10.5px] uppercase tracking-[0.16em] text-white/35">
            <span className="flex items-center gap-1.5"><ShieldCheck size={12} className="text-emerald-400" /> Audited</span>
            <span>SHA-256</span><span>MFA-ready</span><span>DPDP</span>
          </div>
        </div>
      </div>
      {/* form side */}
      <div className="relative flex flex-1 items-center justify-center px-5 py-12">
        <div className="absolute inset-0 bg-[url('/img/aurora.jpg')] bg-cover bg-center opacity-[.12] lg:hidden" />
        <div className="absolute inset-0 bg-ink-950/70 lg:hidden" />
        <div className="relative w-full max-w-[430px]">
          <Link to="/" className="mb-8 inline-flex items-center gap-2 text-[12.5px] font-medium text-white/45 transition hover:text-white"><ArrowLeft size={14} /> Back to home</Link>
          {children}
        </div>
      </div>
    </div>
  );
}

function StepDots({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex gap-1.5">
      {[...Array(total)].map((_, i) => (
        <span key={i} className={`h-1 rounded-full transition-all duration-500 ${i <= step ? 'w-7 a-grad' : 'w-3 bg-white/12'}`} style={i <= step ? { background: 'linear-gradient(90deg, rgb(var(--acc2)), rgb(var(--acc)))' } : {}} />
      ))}
    </div>
  );
}

function PassInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input type={show ? 'text' : 'password'} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder ?? '••••••••'} autoComplete="current-password" />
      <button type="button" onClick={() => setShow(s => !s)} aria-label={show ? 'Hide password' : 'Show password'}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/35 transition hover:text-white/75">
        {show ? <EyeOff size={15} /> : <Eye size={15} />}
      </button>
    </div>
  );
}

function Strength({ pass }: { pass: string }) {
  const score = [pass.length >= 8, /[A-Z]/.test(pass), /\d/.test(pass), /[^A-Za-z0-9]/.test(pass)].filter(Boolean).length;
  if (!pass) return null;
  const labels = ['Weak', 'Fair', 'Good', 'Strong'];
  return (
    <div className="mt-2">
      <div className="flex gap-1">{[0, 1, 2, 3].map(i => (
        <span key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < score ? (score <= 1 ? 'bg-rose-400' : score === 2 ? 'bg-amber-400' : score === 3 ? 'bg-lime-400' : 'bg-emerald-400') : 'bg-white/10'}`} />
      ))}</div>
      <p className="mt-1 text-[11px] text-white/40">{score > 0 ? labels[score - 1] : 'Weak'} — use 8+ chars with a number & symbol.</p>
    </div>
  );
}

function DemoInbox({ code, label }: { code: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="mb-5 rounded-xl border border-gold-500/30 bg-gold-500/[.07] p-4">
      <div className="mb-1.5 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-gold-300">
        <MailCheck size={13} /> Demo inbox — verification code
      </div>
      <p className="text-[12px] text-white/50">{label}</p>
      <div className="mt-2.5 flex items-center gap-2">
        <span className="rounded-lg border border-white/12 bg-ink-900 px-4 py-2 font-mono text-[22px] font-bold tracking-[0.35em] text-white">{code}</span>
        <button type="button" onClick={() => { navigator.clipboard?.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/12 text-white/60 transition hover:bg-white/[.07] hover:text-white" aria-label="Copy code">
          {copied ? <Check size={15} className="text-emerald-400" /> : <Copy size={15} />}
        </button>
      </div>
    </motion.div>
  );
}

/* ================================================================ LOGIN */
export function LoginPage() {
  const { login, user, verifyMfa, mfaChallenge } = useApp();
  const nav = useNavigate();
  const [email, setEmail] = useState('aarav@nexaflow.in');
  const [pass, setPass] = useState('founder123');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [mfaCode, setMfaCode] = useState('');
  const [shake, setShake] = useState(0);

  if (user) return <Navigate to={user.onboarded ? '/app/dashboard' : `/onboarding/${user.role}`} replace />;

  const doLogin = async (e?: FormEvent, e2 = email, p = pass) => {
    e?.preventDefault();
    setBusy(true); setErr('');
    const r = await login(e2, p);
    setBusy(false);
    if ('err' in r) { setErr(r.err); setShake(s => s + 1); return; }
    if (r.ok === 'mfa') { toast('MFA enabled — enter the 6-digit code'); return; }
    toast('Welcome back');
    nav('/app/dashboard');
  };

  return (
    <AuthShell side="founder">
      <motion.div key={shake} animate={shake ? { x: [0, -9, 9, -5, 5, 0] } : {}} transition={{ duration: 0.4 }}>
        <h1 className="text-display text-[30px] font-medium text-white">Welcome back to the <span className="serif-i text-grad-gold">bridge</span>.</h1>
        <p className="mt-2 text-[13.5px] text-white/50">Sign in to your verified workspace.</p>
      </motion.div>

      <AnimatePresence mode="wait">
        {mfaChallenge ? (
          <motion.div key="mfa" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="mt-8">
            <DemoInbox code={mfaChallenge.code} label="MFA is enabled on this account. In production this arrives via authenticator app — the demo surfaces it here." />
            <Field label="6-digit MFA code" required>
              <Input value={mfaCode} onChange={e => setMfaCode(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="000000" className="py-3 text-center font-mono text-[20px] tracking-[0.4em]" autoFocus />
            </Field>
            {err && <p className="mt-3 text-[12.5px] text-rose-300">{err}</p>}
            <Btn className="mt-6 w-full" size="lg" onClick={async () => {
              const r = await verifyMfa(mfaCode);
              if ('err' in r) { setErr(r.err); setShake(s => s + 1); return; }
              toast('Identity verified'); nav('/app/admin');
            }}>Verify & sign in <ShieldCheck size={16} /></Btn>
          </motion.div>
        ) : (
          <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 space-y-4.5" onSubmit={doLogin}>
            <Field label="Work email" required>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.in" autoComplete="email" />
            </Field>
            <Field label="Password" required hint={<Link to="/forgot" className="a-text transition hover:brightness-125">Forgot?</Link>}>
              <PassInput value={pass} onChange={setPass} />
            </Field>
            {err && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-lg bg-rose-500/10 px-3.5 py-2.5 text-[12.5px] text-rose-300">{err}</motion.p>}
            <Btn type="submit" size="lg" className="w-full" disabled={busy}>{busy ? 'Verifying…' : 'Sign in'} <ArrowRight size={16} /></Btn>

            <div className="relative py-1 text-center"><span className="relative z-10 bg-ink-950 px-3 text-[11px] uppercase tracking-widest text-white/30">or try a demo persona</span><span className="absolute inset-x-0 top-1/2 h-px bg-white/[.07]" /></div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { l: 'Founder', e: 'aarav@nexaflow.in', p: 'founder123', icon: <Rocket size={13} /> },
                { l: 'Investor', e: 'meera@ardentpeak.vc', p: 'investor123', icon: <Landmark size={13} /> },
                { l: 'Admin', e: 'admin@venturesetu.in', p: 'admin123', icon: <ShieldCheck size={13} /> },
              ].map(d => (
                <button key={d.l} type="button" onClick={() => { setEmail(d.e); setPass(d.p); doLogin(undefined, d.e, d.p); }}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-white/[.09] bg-white/[.03] px-3 py-2.5 text-[12px] font-medium text-white/70 transition hover:-translate-y-0.5 hover:border-white/25 hover:text-white">
                  {d.icon}{d.l}
                </button>
              ))}
            </div>
            <p className="pt-1 text-center text-[12.5px] text-white/45">New to VentureSetu? <Link to="/signup" className="a-text font-medium hover:brightness-125">Create an account</Link></p>
          </motion.form>
        )}
      </AnimatePresence>
    </AuthShell>
  );
}

/* ================================================================ SIGNUP */
export function SignupPage() {
  const { signup, verifyEmail, pendingReg, user } = useApp();
  const nav = useNavigate();
  const [sp] = useSearchParams();
  const [role, setRole] = useState<'founder' | 'investor'>((sp.get('role') as 'founder' | 'investor') || 'founder');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [mfa, setMfa] = useState(true);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [step, setStep] = useState<'form' | 'verify'>('form');
  const [code, setCode] = useState('');

  if (user) return <Navigate to={user.onboarded ? '/app/dashboard' : `/onboarding/${user.role}`} replace />;

  return (
    <AuthShell side={role}>
      <StepDots step={step === 'form' ? 0 : 1} total={2} />
      <AnimatePresence mode="wait">
        {step === 'form' ? (
          <motion.div key="f" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
            <h1 className="text-display mt-5 text-[30px] font-medium text-white">Create your <span className="a-grad-txt serif-i">{role === 'founder' ? 'founder' : 'investor'}</span> account.</h1>
            <p className="mt-2 text-[13.5px] text-white/50">Verified profiles only. Takes about a minute.</p>

            <div className="mt-7 grid grid-cols-2 gap-2 rounded-2xl border border-white/[.08] bg-white/[.03] p-1.5" role="radiogroup" aria-label="Choose role">
              {([
                { id: 'founder', icon: <Rocket size={16} />, t: 'I\u2019m building', d: 'Raise & track my round' },
                { id: 'investor', icon: <Landmark size={16} />, t: 'I invest', d: 'Source verified deal flow' },
              ] as const).map(o => (
                <button type="button" key={o.id} onClick={() => setRole(o.id)} role="radio" aria-checked={role === o.id}
                  className={`relative rounded-xl border p-3.5 text-left transition-all duration-200 ${role === o.id ? 'border-transparent' : 'border-white/[.06] hover:border-white/20'}`}
                  style={role === o.id ? { background: 'linear-gradient(135deg, rgb(var(--acc)/.18), rgb(var(--acc)/.06))', boxShadow: '0 0 0 1.5px rgb(var(--acc)/.55)' } : {}}>
                  <span className={`flex items-center gap-2 text-[13.5px] font-semibold ${role === o.id ? 'a-text' : 'text-white/80'}`}>{o.icon}{o.t}</span>
                  <span className="mt-1 block text-[11px] text-white/40">{o.d}</span>
                </button>
              ))}
            </div>

            <form className="mt-5 space-y-4" onSubmit={async e => {
              e.preventDefault(); setBusy(true); setErr('');
              const r = await signup(name, email, pass, role, mfa);
              setBusy(false);
              if ('err' in r) { setErr(r.err); return; }
              setStep('verify');
              toast('Verification code issued');
            }}>
              <Field label="Full name" required><Input value={name} onChange={e => setName(e.target.value)} placeholder="Ananya Iyer" autoComplete="name" /></Field>
              <Field label="Work email" required><Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.in" autoComplete="email" /></Field>
              <Field label="Password" required><PassInput value={pass} onChange={setPass} placeholder="Min. 8 characters" /><Strength pass={pass} /></Field>
              <button type="button" onClick={() => setMfa(m => !m)} className="flex w-full items-center justify-between rounded-xl border border-white/[.09] bg-white/[.03] px-4 py-3 text-left transition hover:border-white/20" aria-pressed={mfa}>
                <span>
                  <span className="flex items-center gap-2 text-[13px] font-medium text-white/85"><KeyRound size={14} className="a-text" /> Enable MFA (recommended)</span>
                  <span className="mt-0.5 block text-[11px] text-white/40">6-digit code at every sign-in, on top of your password.</span>
                </span>
                <span className={`relative h-6 w-11 rounded-full transition-colors ${mfa ? 'bg-emerald-500/80' : 'bg-white/12'}`}>
                  <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${mfa ? 'left-[22px]' : 'left-0.5'}`} />
                </span>
              </button>
              {err && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-lg bg-rose-500/10 px-3.5 py-2.5 text-[12.5px] text-rose-300">{err}</motion.p>}
              <Btn type="submit" size="lg" className="w-full" disabled={busy}>{busy ? 'Creating…' : 'Create account'} <ArrowRight size={16} /></Btn>
              <p className="text-center text-[11px] leading-relaxed text-white/35">By continuing you agree to the verification protocol, acceptable-use policy and DPDP-aligned privacy terms.</p>
            </form>
          </motion.div>
        ) : (
          <motion.div key="v" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="mt-5">
            <h1 className="text-display text-[30px] font-medium text-white">Verify your <span className="serif-i a-grad-txt">email</span>.</h1>
            <p className="mt-2 text-[13.5px] text-white/50">We sent a 6-digit code to <span className="font-medium text-white/80">{pendingReg?.email}</span>.</p>
            <div className="mt-6">
              {pendingReg && <DemoInbox code={pendingReg.code} label="This demo has no SMTP server — in production the code lands in your inbox. It is surfaced here so you can complete the flow." />}
              <Field label="Verification code" required>
                <Input value={code} onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="000000" className="py-3 text-center font-mono text-[20px] tracking-[0.4em]" autoFocus />
              </Field>
              {err && <p className="mt-3 rounded-lg bg-rose-500/10 px-3.5 py-2.5 text-[12.5px] text-rose-300">{err}</p>}
              <Btn size="lg" className="mt-6 w-full" disabled={code.length !== 6 || busy} onClick={async () => {
                setBusy(true); setErr('');
                const r = await verifyEmail(pendingReg?.email ?? '', code);
                setBusy(false);
                if ('err' in r) { setErr(r.err); return; }
                toast('Email verified — welcome aboard');
                nav(`/onboarding/${role}`);
              }}>Verify & continue <ArrowRight size={16} /></Btn>
              <button className="mt-3 w-full text-center text-[12px] text-white/40 transition hover:text-white/70" onClick={() => setStep('form')}>← Use a different email</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {step === 'form' && <p className="mt-5 text-center text-[12.5px] text-white/45">Already verified? <Link to="/login" className="a-text font-medium hover:brightness-125">Sign in</Link></p>}
    </AuthShell>
  );
}

/* ================================================================ FORGOT */
export function ForgotPage() {
  const { forgot, resetPass, resetChallenge } = useApp();
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [next, setNext] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  return (
    <AuthShell side="founder">
      <StepDots step={resetChallenge ? 1 : 0} total={2} />
      <h1 className="text-display mt-5 text-[30px] font-medium text-white">Reset your <span className="serif-i text-grad-gold">password</span>.</h1>
      <p className="mt-2 text-[13.5px] text-white/50">{resetChallenge ? 'Enter the code and choose a new password.' : 'We\u2019ll issue a one-time reset code to your email.'}</p>
      <form className="mt-7 space-y-4" onSubmit={async e => {
        e.preventDefault(); setBusy(true); setErr('');
        if (!resetChallenge) {
          const r = await forgot(email);
          setBusy(false);
          if ('err' in r) setErr(r.err); else toast('Reset code issued');
        } else {
          const r = await resetPass(email, code, next);
          setBusy(false);
          if ('err' in r) { setErr(r.err); return; }
          toast('Password updated — sign in with it now');
          nav('/login');
        }
      }}>
        {!resetChallenge ? (
          <Field label="Account email" required><Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.in" autoFocus /></Field>
        ) : (
          <>
            <DemoInbox code={resetChallenge.code} label={`Reset code for ${email}. Surfaced here because the demo has no SMTP server.`} />
            <Field label="Reset code" required><Input value={code} onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="000000" className="py-3 text-center font-mono text-[20px] tracking-[0.4em]" autoFocus /></Field>
            <Field label="New password" required><PassInput value={next} onChange={setNext} placeholder="Min. 8 characters" /><Strength pass={next} /></Field>
          </>
        )}
        {err && <p className="rounded-lg bg-rose-500/10 px-3.5 py-2.5 text-[12.5px] text-rose-300">{err}</p>}
        <Btn type="submit" size="lg" className="w-full" disabled={busy}>{busy ? 'Working…' : resetChallenge ? 'Set new password' : 'Send reset code'} <ArrowRight size={16} /></Btn>
      </form>
      <p className="mt-5 text-center text-[12.5px] text-white/45"><Link to="/login" className="a-text font-medium hover:brightness-125">← Back to sign in</Link></p>
    </AuthShell>
  );
}
