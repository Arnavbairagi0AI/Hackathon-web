import { BookOpenCheck, ShieldAlert, ExternalLink, Info, Lock, Compass } from 'lucide-react';
import { Card, CardHead, Chip } from '../../components/ui';
import { SchemePageHead } from './parts';
import { SCHEMES } from '../../data/schemes';
import { PARTNERS } from '../../data/partners';

/* ============================================================
   /app/schemes/about — methodology, honesty constraints and
   official sources, restyled on the platform design system.
   ============================================================ */

export default function Sources() {
  return (
    <div className="mx-auto max-w-[1000px]">
      <SchemePageHead
        icon={<BookOpenCheck size={18} />}
        title="About the scheme flow"
        sub="A decision-support prototype built for Smart India Hackathon SIH26092. It helps first-generation and marginalized entrepreneurs prepare for scheme-linked enterprise finance — organising public information, explaining trade-offs, and pointing to where official verification happens."
      />

      <div className="mb-5 rounded-xl border border-gold-400/25 bg-gold-400/[.06] px-4 py-3 text-[12.5px] leading-relaxed text-gold-100">
        <strong className="font-semibold">What this flow is NOT.</strong> It is not a lender, not a government portal, and
        not an application channel. It does not approve, guarantee, or intermediate any loan. No result is an offer of
        credit. Final eligibility is decided only by the lending institution or implementing agency under the scheme's
        current guidelines.
      </div>

      <div className="mb-5 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHead title="What it does" sub="Decision support, end to end" />
          <ul className="space-y-2.5 px-5 py-4 text-[12.5px] leading-relaxed text-white/60">
            <li className="flex gap-2.5"><Compass size={15} className="mt-0.5 shrink-0 text-gold-300" /> Captures an applicant profile relevant to Indian enterprise-support schemes.</li>
            <li className="flex gap-2.5"><Compass size={15} className="mt-0.5 shrink-0 text-gold-300" /> Produces an explainable shortlist with per-criterion reasoning.</li>
            <li className="flex gap-2.5"><Compass size={15} className="mt-0.5 shrink-0 text-gold-300" /> Models repayment (EMI with moratorium capitalisation) before you commit.</li>
            <li className="flex gap-2.5"><Compass size={15} className="mt-0.5 shrink-0 text-gold-300" /> Describes the institutions that typically handle these files, with verify-first guidance.</li>
          </ul>
        </Card>
        <Card>
          <CardHead title="What it deliberately avoids" sub="By design" />
          <ul className="space-y-2.5 px-5 py-4 text-[12.5px] leading-relaxed text-white/60">
            <li className="flex gap-2.5"><ShieldAlert size={15} className="mt-0.5 shrink-0 text-gold-400" /> No approvals, sanctions, "guaranteed loans" or approval-probability scores.</li>
            <li className="flex gap-2.5"><ShieldAlert size={15} className="mt-0.5 shrink-0 text-gold-400" /> No claims of partnership with any bank, ministry or scheme.</li>
            <li className="flex gap-2.5"><ShieldAlert size={15} className="mt-0.5 shrink-0 text-gold-400" /> No logins, no document uploads, no data leaving the browser.</li>
            <li className="flex gap-2.5"><ShieldAlert size={15} className="mt-0.5 shrink-0 text-gold-400" /> No agent referrals or fee-based facilitation of any kind.</li>
          </ul>
        </Card>
      </div>

      <Card className="mb-5">
        <CardHead title="How the matching works" sub="Transparent by construction" />
        <div className="grid gap-6 px-5 py-5 lg:grid-cols-2">
          <div className="space-y-3 text-[12.5px] leading-relaxed text-white/60">
            <p>
              Each scheme in the catalogue contributes a small set of <strong className="font-semibold text-white/85">criteria</strong> derived
              from its publicly described focus — who it serves, ticket sizes, and structural conditions. Your profile is
              checked against each criterion and the criterion is marked:
            </p>
            <div className="flex flex-wrap gap-2">
              <Chip tone="jade">Meets</Chip>
              <Chip tone="gold">Partial</Chip>
              <Chip tone="rose">Gap</Chip>
            </div>
            <p>
              The score is the share of assessable criteria satisfied (partial counts half). Some criteria are
              <strong className="font-semibold text-white/85"> hard requirements</strong> — if unmet, the scheme is dropped
              from the shortlist entirely rather than merely scored down. The rules are deliberately simple and readable:
              every result can be traced line by line and checked against the official guidelines.
            </p>
          </div>
          <div className="rounded-xl border border-white/[.07] bg-white/[.02] p-5 text-[12.5px] leading-relaxed text-white/60">
            <h4 className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-white/35">Prototype scope</h4>
            <ul className="list-disc space-y-1.5 pl-4">
              <li>Catalogue summarises {SCHEMES.length} scheme categories and {PARTNERS.length} partner institutions.</li>
              <li>All computation and storage are local to your browser.</li>
              <li>Amounts are indicative and frequently revised — the official portal is always authoritative.</li>
              <li>A production build would sync guideline text from official feeds with dated provenance for each criterion.</li>
            </ul>
          </div>
        </div>
      </Card>

      <Card className="mb-5">
        <CardHead title="Official sources" sub="Start verification here — only these portals are authoritative" />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-[12.5px]">
            <thead>
              <tr className="border-b border-white/[.07] text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-white/35">
                <th className="px-5 py-2.5">Programme</th>
                <th className="px-5 py-2.5">Category</th>
                <th className="px-5 py-2.5">Official portal</th>
              </tr>
            </thead>
            <tbody>
              {SCHEMES.map(s => (
                <tr key={s.id} className="border-b border-white/[.04] last:border-0">
                  <td className="px-5 py-3 font-semibold text-white/85">{s.name}</td>
                  <td className="px-5 py-3 text-white/50">{s.category}</td>
                  <td className="px-5 py-3">
                    <a href={s.officialSource} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 font-medium text-gold-300/90 transition hover:text-gold-200">
                      {s.officialSource.replace(/^https?:\/\//, '')} <ExternalLink size={12} />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHead title={<span className="flex items-center gap-2"><Lock size={14} /> Privacy</span>} sub="Local-only by design" />
          <div className="px-5 py-4 text-[12.5px] leading-relaxed text-white/60">
            Your scheme profile, selections and progress are stored in your browser's localStorage, separate from the rest
            of this platform. Nothing is transmitted to any server. Use the "Reset" button on the profile page to erase it.
          </div>
        </Card>
        <Card>
          <CardHead title={<span className="flex items-center gap-2"><Info size={14} /> Accuracy & maintenance</span>} sub="Prototype caveat" />
          <div className="px-5 py-4 text-[12.5px] leading-relaxed text-white/60">
            Scheme names, bands and terms are summarised from public materials and may be outdated. Treat every number
            here as a prompt to verify, never as the rule itself.
          </div>
        </Card>
      </div>
    </div>
  );
}
