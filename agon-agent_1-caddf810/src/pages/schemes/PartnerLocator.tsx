import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Map as MapIcon, Search, Building2, Phone, ArrowRight } from 'lucide-react';
import { Card, CardHead, Chip, Input, Select, Btn, Modal } from '../../components/ui';
import { SchemePageHead, JourneyStrip, BackLink } from './parts';
import { useScheme } from '../../lib/schemeStore';
import { PARTNERS } from '../../data/partners';
import { schemeById } from '../../data/schemes';
import type { Partner } from '../../lib/schemeTypes';

/* ============================================================
   /app/schemes/partners — filters + mock-distance sort. Data
   comes verbatim from data/partners.ts; rendering rebuilt on
   the platform design system.
   ============================================================ */

const PARTNER_TYPES: Partner['type'][] = [
  'Public sector bank', 'Private bank', 'NBFC', 'Training institute (RSETI)',
  'Handholding agency', 'Regional office',
];

export default function PartnerLocator() {
  const schemeStore = useScheme();
  const { selectedSchemeId } = schemeStore;
  const navigate = useNavigate();

  const [schemeFilter, setSchemeFilter] = useState<string>(selectedSchemeId ?? 'all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [locFilter, setLocFilter] = useState<string>('all');
  const [q, setQ] = useState('');
  const [detail, setDetail] = useState<Partner | null>(null);

  const locations = useMemo(() => [...new Set(PARTNERS.map(p => p.location))].sort(), []);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return PARTNERS
      .filter(p => schemeFilter === 'all' || p.authorizedSchemeIds.includes(schemeFilter))
      .filter(p => typeFilter === 'all' || p.type === typeFilter)
      .filter(p => locFilter === 'all' || p.location === locFilter)
      .filter(p => !needle || `${p.name} ${p.location}`.toLowerCase().includes(needle))
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [schemeFilter, typeFilter, locFilter, q]);

  const schemeName = (id: string) => schemeById(id)?.name ?? id;

  const chooseAndContinue = (p: Partner) => {
    schemeStore.selectPartner(p.id);
    schemeStore.markComplete('partner');
    setDetail(null);
    navigate('/app/schemes/recommendation');
  };

  return (
    <div className="mx-auto max-w-[1100px]">
      <JourneyStrip />
      <SchemePageHead
        icon={<MapPin size={18} />}
        title="Partner locator"
        sub="Institutions that process the selected schemes, sorted by mock distance from your district. Always verify through the institution's own channels."
        right={<BackLink to="/app/schemes/repayment" label="Back to repayment" />}
      />

      {/* filters */}
      <Card className="mb-5 px-5 py-4">
        <div className="grid gap-3 lg:grid-cols-[repeat(3,minmax(0,1fr))_auto]">
          <Select value={schemeFilter} onChange={e => setSchemeFilter(e.target.value)} aria-label="Filter by scheme">
            <option value="all">All authorized schemes</option>
            {selectedSchemeId && <option value={selectedSchemeId}>My selected scheme</option>}
            {[...new Set(PARTNERS.flatMap(p => p.authorizedSchemeIds))].map(id => (
              <option key={id} value={id}>{schemeName(id)}</option>
            ))}
          </Select>
          <Select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} aria-label="Filter by partner type">
            <option value="all">All partner types</option>
            {PARTNER_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </Select>
          <Select value={locFilter} onChange={e => setLocFilter(e.target.value)} aria-label="Filter by location">
            <option value="all">All locations</option>
            {locations.map(l => <option key={l} value={l}>{l}</option>)}
          </Select>
          <div className="relative">
            <Search size={14} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35" />
            <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Search…" className="pl-10" aria-label="Search partners" />
          </div>
        </div>
      </Card>

      {/* map placeholder */}
      <div
        className="glass relative mb-5 flex h-40 items-center justify-center overflow-hidden rounded-2xl"
        style={{
          background:
            'linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px)',
          backgroundSize: '26px 26px, 26px 26px',
        }}
        role="img"
        aria-label="Map placeholder"
      >
        <div className="flex flex-col items-center gap-1.5 text-center">
          <MapIcon size={22} className="text-white/20" />
          <p className="text-[13px] font-medium text-white/50">Map integration — future implementation</p>
          <p className="text-[11px] text-white/30">Distance sorting already works with mock values.</p>
        </div>
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <h2 className="mr-auto text-[14px] font-semibold text-white/90">
          {filtered.length} partner{filtered.length === 1 ? '' : 's'} · sorted by distance
        </h2>
        {schemeFilter !== 'all' && <Chip tone="gold">{schemeName(schemeFilter)}</Chip>}
      </div>

      {/* cards */}
      <div className="grid gap-4 lg:grid-cols-2">
        {filtered.map(p => (
          <Card key={p.id} hover>
            <CardHead
              title={
                <span className="flex items-center gap-2.5">
                  <span className="a-soft flex h-8 w-8 items-center justify-center rounded-lg"><Building2 size={14} /></span>
                  {p.name}
                </span>
              }
              sub={p.type}
              right={
                <Chip tone={p.authorization === 'authorized' ? 'jade' : p.authorization === 'empanelled' ? 'gold' : 'iris'}>
                  {p.authorization === 'authorized' ? 'Authorized' : p.authorization === 'empanelled' ? 'Empanelled' : 'Referral desk'}
                </Chip>
              }
            />
            <div className="space-y-3 px-5 py-4">
              <div className="grid grid-cols-2 gap-3 text-[12px] sm:grid-cols-3">
                <span className="flex items-center gap-1.5 text-white/70"><MapPin size={12} className="text-white/35" /> {p.location}</span>
                <span className="text-white/70"><span className="font-mono font-semibold">{p.distanceKm} km</span> <span className="text-white/30">(mock)</span></span>
                <span className="flex items-center gap-1.5 text-white/70 max-sm:col-span-2"><Phone size={12} className="text-white/35" /> <span className="truncate">{p.contact}</span></span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {p.authorizedSchemeIds.map(id => <Chip key={id} tone="iris">{schemeName(id)}</Chip>)}
              </div>

              {/* capacity — explicitly labelled prototype data */}
              <div className="rounded-xl border border-white/[.07] bg-white/[.02] px-3.5 py-3">
                <div className="flex items-center justify-between text-[10.5px] font-semibold uppercase tracking-wider text-white/40">
                  <span>Prototype indicator — not live data</span>
                  <span className="font-mono">{p.capacityPct}%</span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/[.07]">
                  <div className="h-full rounded-full bg-gradient-to-r from-iris-500 to-iris-400" style={{ width: `${p.capacityPct}%` }} />
                </div>
                <p className="mt-1 text-[10px] text-white/25">Indicative workload band for the demo. Never shows funding availability.</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Btn size="sm" variant="dark" onClick={() => setDetail(p)}>View Partner Details</Btn>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <Card className="px-5 py-12 text-center">
          <p className="text-[13.5px] font-medium text-white/70">No partners match these filters.</p>
          <div className="mt-3">
            <Btn variant="outline" size="sm" onClick={() => { setSchemeFilter('all'); setTypeFilter('all'); setLocFilter('all'); setQ(''); }}>
              Clear filters
            </Btn>
          </div>
        </Card>
      )}

      <Card className="mt-5">
        <CardHead
          title="Next: your final recommendation"
          sub="One page combining scheme, repayment and partner."
          right={
            <Btn size="sm" onClick={() => { schemeStore.markComplete('partner'); navigate('/app/schemes/recommendation'); }}>
              View final recommendation <ArrowRight size={14} />
            </Btn>
          }
        />
      </Card>

      {/* details modal */}
      <Modal open={!!detail} onClose={() => setDetail(null)} title={detail?.name ?? ''}>
        {detail && (
          <div className="space-y-4 text-[13px] leading-relaxed text-white/75">
            <div className="flex flex-wrap gap-2">
              <Chip>{detail.type}</Chip>
              <Chip tone={detail.authorization === 'authorized' ? 'jade' : detail.authorization === 'empanelled' ? 'gold' : 'iris'}>
                {detail.authorization === 'authorized' ? 'Authorized' : detail.authorization === 'empanelled' ? 'Empanelled' : 'Referral desk'}
              </Chip>
            </div>
            <div className="grid grid-cols-2 gap-3 text-[12.5px]">
              <div><span className="text-white/40">Location:</span> <strong className="text-white/90">{detail.location}</strong></div>
              <div><span className="text-white/40">Distance:</span> <strong className="font-mono text-white/90">{detail.distanceKm} km</strong> <span className="text-white/30">(mock)</span></div>
              <div className="col-span-2"><span className="text-white/40">Contact:</span> <strong className="text-white/90">{detail.contact}</strong></div>
            </div>
            <div>
              <h4 className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white/35">Authorized schemes</h4>
              <ul className="space-y-1">{detail.authorizedSchemeIds.map(id => <li key={id}>• {schemeName(id)}</li>)}</ul>
            </div>
            <div className="rounded-xl border border-gold-400/25 bg-gold-400/[.07] px-3.5 py-3 text-[12px] text-gold-200">
              Verify the branch and scheme tie-up through the institution's official website before visiting.
              Genuine partners never charge cash to arrange a scheme loan.
            </div>
            <div className="flex flex-wrap justify-end gap-2 pt-1">
              <Btn variant="outline" size="sm" onClick={() => setDetail(null)}>Close</Btn>
              <Btn size="sm" onClick={() => chooseAndContinue(detail)}>Choose this partner & continue <ArrowRight size={13} /></Btn>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
