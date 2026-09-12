import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { User, Startup, Investor, Connection, Thread, Msg, Channel, Notice, Audit, Flag, Session, Role, Lang } from './types';
import {
  seedUsers, seedStartups, seedInvestors, seedConnections, seedThreads,
  founderChannels, investorChannels, seedNotices, seedAudits, seedFlags,
} from './data';
import { uid, MIN, DAY, fmtL } from './format';

const DB_KEY = 'vs_db_v3';
const SS_KEY = 'vs_session_v1';

async function sha256(s: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('venturesetu::' + s));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}
const code6 = (seedStr: string) => String(Math.abs([...seedStr + Date.now()].reduce((a, c) => (a * 31 + c.charCodeAt(0)) | 0, 7))).slice(-6).padStart(6, '0');

interface DB {
  users: User[]; startups: Startup[]; investors: Investor[];
  connections: Connection[]; threads: Thread[];
  fChannels: Channel[]; iChannels: Channel[];
  noticesF: Notice[]; noticesI: Notice[];
  rsvps: string[]; audits: Audit[]; flags: Flag[];
  hashed: boolean;
}

function freshDB(): DB {
  return JSON.parse(JSON.stringify({
    users: seedUsers, startups: seedStartups, investors: seedInvestors,
    connections: seedConnections, threads: seedThreads,
    fChannels: founderChannels, iChannels: investorChannels,
    noticesF: seedNotices,
    noticesI: [
      { id: 'ni1', type: 'match', title: '3 startups crossed 85% match', body: 'Nexaflow, QuantumLeap AI and MediQuick now exceed your watch threshold.', ts: Date.now() - 4 * 3_600_000, read: false, link: '/app/matching' },
      { id: 'ni2', type: 'message', title: 'FinEdge redlines tonight', body: 'Ishita Rao aligned on unbundling — legal turns the draft by EOD.', ts: Date.now() - 1 * DAY, read: false, link: '/app/messages/th-2' },
      { id: 'ni3', type: 'connect', title: 'New inbound deck', body: 'QuantumLeap AI shared their data-room index for first review.', ts: Date.now() - 26 * 3_600_000, read: false, link: '/app/connections' },
      { id: 'ni4', type: 'milestone', title: 'Pipeline review Friday 9:30', body: 'Morning Deals Briefing voice room — 3 active opportunities on agenda.', ts: Date.now() - 2 * DAY, read: true, link: '/app/community' },
      { id: 'ni5', type: 'security', title: 'New sign-in · Safari on iPhone', body: 'Mumbai, IN · verified device.', ts: Date.now() - 6 * 3_600_000, read: true, link: '/app/notifications' },
    ] as Notice[],
    rsvps: ['ev-2'], audits: seedAudits, flags: seedFlags,
    hashed: false,
  }));
}

export interface PendingReg { email: string; name: string; pass: string; role: Role; mfa: boolean; code: string }

interface AppCtx {
  ready: boolean;
  db: DB;
  user: User | null;
  session: Session | null;
  pendingReg: PendingReg | null;
  mfaChallenge: { userId: string; code: string; email: string } | null;
  resetChallenge: { email: string; code: string } | null;
  // auth
  signup: (name: string, email: string, pass: string, role: Role, mfa: boolean) => Promise<{ ok: string } | { err: string }>;
  verifyEmail: (email: string, code: string) => Promise<{ ok: string } | { err: string }>;
  login: (email: string, pass: string) => Promise<{ ok: 'session' | 'mfa' } | { err: string }>;
  verifyMfa: (code: string) => Promise<{ ok: string } | { err: string }>;
  forgot: (email: string) => Promise<{ ok: string } | { err: string }>;
  resetPass: (email: string, code: string, next: string) => Promise<{ ok: string } | { err: string }>;
  logout: () => void;
  completeOnboarding: (patch: Partial<User>, startup?: Partial<Startup>, investorPatch?: Partial<Investor>) => string | undefined;
  createStartup: (min: { name: string; sector: string; stage: string; askL: number }) => string | null;
  setFocusStartup: (startupId: string) => void;
  // data
  sendConnection: (targetId: string, message: string) => { ok: string } | { err: string };
  respondConnection: (connId: string, accept: boolean) => void;
  setConnStage: (connId: string, stage: Connection['stage']) => void;
  sendMsg: (threadId: string, text?: string, file?: { name: string; sizeKB: number }, asSenderId?: string) => void;
  setTyping: (threadId: string, on: boolean) => void;
  reactMsg: (threadId: string, msgId: string, emoji: string) => void;
  postChannelMsg: (role: 'founder' | 'investor', channelId: string, text: string) => void;
  reactChannelMsg: (role: 'founder' | 'investor', channelId: string, msgId: string, emoji: string) => void;
  clearChannelUnread: (role: 'founder' | 'investor', channelId: string) => void;
  markRead: (role: 'founder' | 'investor', id?: string) => void;
  pushNotice: (n: Omit<Notice, 'id' | 'ts' | 'read'>, role?: 'founder' | 'investor') => void;
  rsvp: (eventId: string) => void;
  updateStartup: (id: string, patch: Partial<Startup>) => void;
  toggleDeckShare: (startupId: string, investorId: string) => void;
  attachDeck: (startupId: string, name: string, sizeKB: number) => void;
  bumpMilestone: (startupId: string, msId: string) => void;
  setUserStatus: (userId: string, status: User['status']) => void;
  resolveFlag: (flagId: string) => void;
  audit: (action: string, target: string) => void;
  resetDemo: () => void;
}

const Ctx = createContext<AppCtx | null>(null);
export const useApp = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error('useApp outside provider');
  return v;
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [db, setDb] = useState<DB>(() => {
    try {
      const raw = localStorage.getItem(DB_KEY);
      if (raw) return JSON.parse(raw);
    } catch { /* reseed */ }
    return freshDB();
  });
  const [session, setSession] = useState<Session | null>(() => {
    try {
      const raw = localStorage.getItem(SS_KEY);
      if (raw) {
        const s = JSON.parse(raw) as Session;
        if (s.expires > Date.now()) return s;
      }
    } catch { /* ignore */ }
    return null;
  });
  const [ready, setReady] = useState(false);
  const [pendingReg, setPendingReg] = useState<PendingReg | null>(null);
  const [mfaChallenge, setMfaChallenge] = useState<AppCtx['mfaChallenge']>(null);
  const [resetChallenge, setResetChallenge] = useState<AppCtx['resetChallenge']>(null);

  // bootstrap: hash seed passwords once
  useEffect(() => {
    (async () => {
      setDb(prev => {
        if (prev.hashed) return prev;
        return prev; // async patching below
      });
      let changed = false;
      const users = await Promise.all(db.users.map(async u => {
        if (u.passHash.startsWith('seed:')) {
          changed = true;
          return { ...u, passHash: 's2:' + await sha256(u.passHash.slice(5) + '::' + u.email) };
        }
        return u;
      }));
      if (changed) setDb(prev => ({ ...prev, users: prev.users.map(u => users.find(x => x.id === u.id) ?? u), hashed: true }));
      setReady(true);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try { localStorage.setItem(DB_KEY, JSON.stringify(db)); } catch { /* quota */ }
  }, [db]);
  useEffect(() => {
    try { session ? localStorage.setItem(SS_KEY, JSON.stringify(session)) : localStorage.removeItem(SS_KEY); } catch { /* ignore */ }
  }, [session]);

  const user = useMemo(() => db.users.find(u => u.id === session?.userId) ?? null, [db.users, session]);

  const audit = (action: string, target: string) => {
    setDb(prev => ({
      ...prev,
      audits: [{ id: uid('au'), ts: Date.now(), actor: user?.email ?? 'anonymous', action, target, ip: '103.•.•.•' }, ...prev.audits].slice(0, 60),
    }));
  };

  const grantSession = (u: User) => {
    setSession({ token: uid('tok') + uid(''), userId: u.id, mfaPassed: !u.mfa || !!mfaChallenge || !!u, expires: Date.now() + 7 * DAY });
    setDb(prev => ({ ...prev, audits: [{ id: uid('au'), ts: Date.now(), actor: u.email, action: 'SESSION_LOGIN', target: 'self', ip: '103.•.•.•' }, ...prev.audits] }));
  };

  const api: AppCtx = {
    ready, db, user, session, pendingReg, mfaChallenge, resetChallenge,

    signup: async (name, email, pass, role, mfa) => {
      const em = email.trim().toLowerCase();
      if (!name.trim()) return { err: 'Please enter your full name.' };
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em)) return { err: 'That email address doesn\'t look valid.' };
      if (pass.length < 8) return { err: 'Password must be at least 8 characters.' };
      if (db.users.some(u => u.email === em)) return { err: 'An account with this email already exists.' };
      const code = code6(em);
      setPendingReg({ email: em, name: name.trim(), pass, role, mfa, code });
      return { ok: code };
    },

    verifyEmail: async (email, code) => {
      if (!pendingReg || pendingReg.email !== email) return { err: 'No pending signup for this email — start again.' };
      if (code.trim() !== pendingReg.code) return { err: 'Incorrect verification code. Check the demo inbox card.' };
      const nu: User = {
        id: uid('u'), name: pendingReg.name, email, passHash: 's2:' + await sha256(pendingReg.pass + '::' + email),
        role: pendingReg.role, verified: true, mfa: pendingReg.mfa, status: 'active',
        hue: pendingReg.role === 'founder' ? 36 : 232, createdAt: Date.now(), onboarded: false,
      };
      setDb(prev => ({ ...prev, users: [...prev.users, nu], audits: [{ id: uid('au'), ts: Date.now(), actor: email, action: 'USER_SIGNUP_VERIFY', target: pendingReg.role, ip: '103.•.•.•' }, ...prev.audits] }));
      setPendingReg(null);
      setSession({ token: uid('tok'), userId: nu.id, mfaPassed: true, expires: Date.now() + 7 * DAY });
      return { ok: 'verified' };
    },

    login: async (email, pass) => {
      const em = email.trim().toLowerCase();
      const u = db.users.find(x => x.email === em);
      if (!u) return { err: 'No account found for this email.' };
      if (u.status === 'suspended') return { err: 'This account is suspended. Contact Trust & Safety.' };
      const h = 's2:' + await sha256(pass + '::' + em);
      if (h !== u.passHash) return { err: 'Incorrect password. Try again or reset it.' };
      if (u.mfa) {
        const code = code6(u.id);
        setMfaChallenge({ userId: u.id, code, email: em });
        return { ok: 'mfa' };
      }
      grantSession(u);
      return { ok: 'session' };
    },

    verifyMfa: async (code) => {
      if (!mfaChallenge) return { err: 'No MFA challenge active.' };
      if (code.trim() !== mfaChallenge.code) return { err: 'Incorrect MFA code.' };
      const u = db.users.find(x => x.id === mfaChallenge.userId);
      if (!u) return { err: 'Account not found.' };
      setDb(prev => ({ ...prev, audits: [{ id: uid('au'), ts: Date.now(), actor: u.email, action: 'SESSION_LOGIN_MFA', target: 'self', ip: '103.•.•.•' }, ...prev.audits] }));
      setSession({ token: uid('tok'), userId: u.id, mfaPassed: true, expires: Date.now() + 7 * DAY });
      setMfaChallenge(null);
      return { ok: 'session' };
    },

    forgot: async (email) => {
      const em = email.trim().toLowerCase();
      if (!db.users.some(u => u.email === em)) return { err: 'No account found for this email.' };
      setResetChallenge({ email: em, code: code6('reset' + em) });
      return { ok: em };
    },

    resetPass: async (email, code, next) => {
      if (!resetChallenge || resetChallenge.email !== email) return { err: 'No pending reset — request a new code.' };
      if (code.trim() !== resetChallenge.code) return { err: 'Incorrect reset code.' };
      if (next.length < 8) return { err: 'New password must be at least 8 characters.' };
      const h = 's2:' + await sha256(next + '::' + email);
      setDb(prev => ({ ...prev, users: prev.users.map(u => u.email === email ? { ...u, passHash: h } : u), audits: [{ id: uid('au'), ts: Date.now(), actor: email, action: 'PASSWORD_RESET', target: 'self', ip: '103.•.•.•' }, ...prev.audits] }));
      setResetChallenge(null);
      return { ok: 'Password updated — please sign in.' };
    },

    logout: () => {
      if (user) setDb(prev => ({ ...prev, audits: [{ id: uid('au'), ts: Date.now(), actor: user.email, action: 'SESSION_LOGOUT', target: 'self', ip: '103.•.•.•' }, ...prev.audits] }));
      setSession(null);
    },

    completeOnboarding: (patch, startupPatch, investorPatch) => {
      if (!user) return undefined;
      const ownNow = user.role === 'founder' && startupPatch ? db.startups.find(s => s.ownerId === user.id) : undefined;
      const newStartupId = ownNow?.id ?? uid('st');
      setDb(prev => {
        let users = prev.users.map(u => u.id === user.id ? { ...u, ...patch, onboarded: true } : u);
        let startups = prev.startups;
        let investors = prev.investors;
        if (user.role === 'founder' && startupPatch) {
          if (ownNow) startups = prev.startups.map(s => s.id === ownNow.id ? { ...s, ...startupPatch } : s);
          else startups = [...prev.startups, {
            id: newStartupId, ownerId: user.id, name: startupPatch.name ?? 'Untitled Startup', tagline: startupPatch.tagline ?? '',
            sector: startupPatch.sector ?? 'SaaS', stage: startupPatch.stage ?? 'Idea', location: startupPatch.location ?? 'Bengaluru',
            founded: new Date().getFullYear(), team: 3, pitch: '', problem: '', solution: '', market: '', model: '',
            founder: { name: user.name, title: 'Founder', bio: '', qualifications: [], experience: [] },
            askL: startupPatch.askL ?? 100, equityPct: 10, raisedL: 0, cashL: 50, burnL: 5, revenueL: 0, prevRevenueL: 0,
            revSeries: [1, 1.2, 1.4, 1.5], burnSeries: [4, 4.4, 4.8, 5], months: ['Nov', 'Dec', 'Jan', 'Feb'],
            growthPct: 8, traction: [], highlights: [], tags: [startupPatch.sector?.toLowerCase() ?? 'saas'],
            milestones: [{ id: uid('ms'), label: 'Incorporation + MVP', detail: 'First milestone', date: 'Next quarter', status: 'active', progress: 10 }],
            readiness: 40, hue: 36, ...startupPatch,
          } as Startup];
        }
        if (user.role === 'investor' && investorPatch) {
          const mine = prev.investors.find(i => i.userId === user.id);
          if (mine) investors = prev.investors.map(i => i.id === mine.id ? { ...i, ...investorPatch } : i);
          else {
            const nid = uid('inv');
            investors = [...prev.investors, {
              id: nid, userId: user.id, name: user.name, firm: investorPatch.firm ?? 'Independent', title: investorPatch.title ?? 'Investor',
              email: user.email, phone: investorPatch.phone ?? user.phone ?? '', location: investorPatch.location ?? 'Mumbai', hue: 232,
              bio: investorPatch.bio ?? '', thesis: investorPatch.thesis ?? '', sectors: investorPatch.sectors ?? ['SaaS'],
              stages: investorPatch.stages ?? ['Seed'], geos: investorPatch.geos ?? ['Pan-India'],
              chequeMinL: investorPatch.chequeMinL ?? 25, chequeMaxL: investorPatch.chequeMaxL ?? 200,
              qualifications: investorPatch.qualifications ?? [], collaborations: investorPatch.collaborations ?? [],
              portfolio: [], deals: 0, aumCr: 0, response: 80, medCloseDays: 30, verified: false, active: true,
            }];
            users = users.map(u => u.id === user.id ? { ...u, investorProfileId: nid } : u);
          }
        }
        if (startupPatch) users = users.map(u => u.id === user.id ? { ...u, focusStartupId: newStartupId } : u);
        return { ...prev, users, startups, investors };
      });
      audit('ONBOARDING_COMPLETE', patch.title ?? 'profile');
      return startupPatch ? newStartupId : undefined;
    },

    createStartup: (min) => {
      if (!user || user.role !== 'founder') return null;
      const id = uid('st');
      const nu: Startup = {
        id, ownerId: user.id, name: min.name, tagline: 'New venture — narrative in progress', sector: min.sector, stage: min.stage,
        location: user.location ?? 'Bengaluru', founded: new Date().getFullYear(), team: 2,
        pitch: '', problem: '', solution: '', market: '', model: '',
        founder: { name: user.name, title: user.title ?? 'Founder', bio: '', qualifications: [], experience: [] },
        askL: min.askL, equityPct: 10, raisedL: 0, cashL: 40, burnL: 4, revenueL: 0, prevRevenueL: 0,
        revSeries: [0.5, 0.8, 1.1, 1.4], burnSeries: [3.4, 3.6, 3.8, 4], months: ['Nov', 'Dec', 'Jan', 'Feb'],
        growthPct: 5, traction: [{ label: 'Profile created', value: 'Today' }], highlights: [], tags: [min.sector.toLowerCase()],
        milestones: [
          { id: uid('ms'), label: 'Idea validation', detail: 'Customer discovery sprint', date: 'This quarter', status: 'active', progress: 15 },
          { id: uid('ms'), label: `Raise ${fmtL(min.askL)}`, detail: 'First institutional round', amountL: min.askL, date: 'Next 2 quarters', status: 'upcoming', progress: 0 },
        ],
        readiness: 38, hue: 300,
      };
      setDb(prev => ({
        ...prev,
        startups: [...prev.startups, nu],
        users: prev.users.map(u => u.id === user.id ? { ...u, focusStartupId: id } : u),
      }));
      audit('STARTUP_CREATE', min.name);
      return id;
    },

    setFocusStartup: (startupId) => {
      if (!user) return;
      setDb(prev => ({ ...prev, users: prev.users.map(u => u.id === user.id ? { ...u, focusStartupId: startupId } : u) }));
    },

    sendConnection: (targetId, message) => {
      if (!user) return { err: 'Not signed in' };
      let startupId = '', investorId = '';
      if (user.role === 'founder') {
        const own = activeStartup(db, user);
        if (!own) return { err: 'Create a startup profile first.' };
        startupId = own.id; investorId = targetId;
      } else if (user.role === 'investor') {
        const inv = db.investors.find(i => i.userId === user.id);
        if (!inv) return { err: 'Investor profile not found.' };
        startupId = targetId; investorId = inv.id;
      } else return { err: 'Admins cannot send connection requests.' };
      if (db.connections.some(c => c.startupId === startupId && c.investorId === investorId && c.status !== 'declined'))
        return { err: 'A connection already exists between you two.' };
      const conn: Connection = { id: uid('cn'), startupId, investorId, fromRole: user.role as Role, message, status: 'pending', createdAt: Date.now(), stage: 'intro' };
      setDb(prev => ({ ...prev, connections: [...prev.connections, conn], audits: [{ id: uid('au'), ts: Date.now(), actor: user.email, action: 'CONN_SEND', target: `${startupId} ↔ ${investorId}`, ip: '103.•.•.•' }, ...prev.audits] }));
      return { ok: 'Request sent — you\'ll be notified on acceptance.' };
    },

    respondConnection: (connId, accept) => {
      setDb(prev => {
        const conn = prev.connections.find(c => c.id === connId);
        if (!conn) return prev;
        const connections = prev.connections.map(c => c.id === connId ? { ...c, status: (accept ? 'accepted' : 'declined') as Connection['status'] } : c);
        let threads = prev.threads;
        const inv = prev.investors.find(i => i.id === conn.investorId);
        const st = prev.startups.find(s => s.id === conn.startupId);
        const fUser = prev.users.find(u => u.id === st?.ownerId);
        const iUser = prev.users.find(u => u.id === inv?.userId);
        if (accept && st && inv && !prev.threads.some(t => t.connId === connId)) {
          threads = [...prev.threads, {
            id: uid('th'), connId, typing: false, deckShared: (st.deck?.sharedWith ?? []).includes(inv.id),
            pair: [
              { userId: fUser?.id ?? 'x1', name: st.founder.name, org: `${st.name} · Founder`, hue: st.hue, online: Math.random() > 0.4 },
              { userId: iUser?.id ?? inv.id, name: inv.name, org: `${inv.firm} · ${inv.title}`, hue: inv.hue, online: Math.random() > 0.4 },
            ] as [Party0, Party0],
            msgs: [{ id: uid('m'), senderId: 'system', ts: Date.now(), text: `Private room opened between ${st.name} and ${inv.firm}. Deck sharing is ${(st.deck?.sharedWith ?? []).includes(inv.id) ? 'enabled' : 'request-based'}. All messages are audited & encrypted at rest.`, reactions: {} }],
          } as unknown as Thread];
        }
        return { ...prev, connections, threads };
      });
      if (user) audit(accept ? 'CONN_ACCEPT' : 'CONN_DECLINE', connId);
    },

    setConnStage: (connId, stage) => {
      setDb(prev => ({ ...prev, connections: prev.connections.map(c => c.id === connId ? { ...c, stage } : c) }));
      audit('OPP_STAGE', `${connId} → ${stage}`);
    },

    sendMsg: (threadId, text, file, asSenderId) => {
      if (!user || (!text && !file)) return;
      const msg: Msg = { id: uid('m'), senderId: asSenderId ?? user.id, ts: Date.now(), text, file, reactions: {} };
      setDb(prev => ({ ...prev, threads: prev.threads.map(t => t.id === threadId ? { ...t, msgs: [...t.msgs, msg] } : t) }));
    },

    setTyping: (threadId, on) => {
      setDb(prev => ({ ...prev, threads: prev.threads.map(t => t.id === threadId ? { ...t, typing: on } : t) }));
    },

    reactMsg: (threadId, msgId, emoji) => {
      setDb(prev => ({
        ...prev, threads: prev.threads.map(t => t.id !== threadId ? t : {
          ...t, msgs: t.msgs.map(m => {
            if (m.id !== msgId) return m;
            const cur = m.reactions[emoji] ?? 0;
            const reactions = { ...m.reactions };
            if (cur > 0) { if (reactions[emoji] === 1) delete reactions[emoji]; else reactions[emoji] = reactions[emoji] - 1; }
            else reactions[emoji] = 1;
            return { ...m, reactions };
          }),
        }),
      }));
    },

    postChannelMsg: (role, channelId, text) => {
      if (!user || !text.trim()) return;
      const m: import('./types').ChannelMsg = { id: uid('cm'), author: user.name, hue: user.hue, roleTag: user.company ? `${user.company}` : (user.role === 'founder' ? 'Founder' : 'Investor'), ts: Date.now(), text: text.trim(), reactions: {} };
      setDb(prev => role === 'founder'
        ? { ...prev, fChannels: prev.fChannels.map(c => c.id === channelId ? { ...c, msgs: [...(c.msgs ?? []), m] } : c) }
        : { ...prev, iChannels: prev.iChannels.map(c => c.id === channelId ? { ...c, msgs: [...(c.msgs ?? []), m] } : c) });
    },

    reactChannelMsg: (role, channelId, msgId, emoji) => {
      const mapC = (c: Channel): Channel => c.id !== channelId ? c : {
        ...c, msgs: (c.msgs ?? []).map(m => {
          if (m.id !== msgId) return m;
          const reactions = { ...m.reactions };
          if (reactions[emoji]) { if (reactions[emoji] === 1) delete reactions[emoji]; else reactions[emoji]--; } else reactions[emoji] = 1;
          return { ...m, reactions };
        }),
      };
      setDb(prev => role === 'founder'
        ? { ...prev, fChannels: prev.fChannels.map(mapC) }
        : { ...prev, iChannels: prev.iChannels.map(mapC) });
    },

    clearChannelUnread: (role, channelId) => {
      const zero = (c: Channel) => c.id === channelId ? { ...c, unread: 0 } : c;
      setDb(prev => role === 'founder' ? { ...prev, fChannels: prev.fChannels.map(zero) } : { ...prev, iChannels: prev.iChannels.map(zero) });
    },

    markRead: (role, id) => {
      const key = role === 'founder' ? 'noticesF' : 'noticesI';
      setDb(prev => ({ ...prev, [key]: (prev[key] as Notice[]).map(n => (!id || n.id === id) ? { ...n, read: true } : n) } as DB));
    },

    pushNotice: (n, role) => {
      const r = role ?? (user?.role === 'investor' ? 'investor' : 'founder');
      const key = r === 'founder' ? 'noticesF' : 'noticesI';
      setDb(prev => ({ ...prev, [key]: [{ ...n, id: uid('n'), ts: Date.now(), read: false }, ...(prev[key] as Notice[])].slice(0, 30) } as DB));
    },

    rsvp: (eventId) => setDb(prev => ({ ...prev, rsvps: prev.rsvps.includes(eventId) ? prev.rsvps.filter(x => x !== eventId) : [...prev.rsvps, eventId] })),

    updateStartup: (id, patch) => setDb(prev => ({ ...prev, startups: prev.startups.map(s => s.id === id ? { ...s, ...patch } : s) })),

    toggleDeckShare: (startupId, investorId) => setDb(prev => ({
      ...prev, startups: prev.startups.map(s => {
        if (s.id !== startupId || !s.deck) return s;
        const has = s.deck.sharedWith.includes(investorId);
        return { ...s, deck: { ...s.deck, sharedWith: has ? s.deck.sharedWith.filter(x => x !== investorId) : [...s.deck.sharedWith, investorId] } };
      }),
    })),

    attachDeck: (startupId, name, sizeKB) => setDb(prev => ({
      ...prev, startups: prev.startups.map(s => s.id === startupId ? { ...s, deck: { name, pages: 14, sizeKB, updatedAt: Date.now(), sharedWith: s.deck?.sharedWith ?? [] }, readiness: Math.min(100, s.readiness + 6) } : s),
    })),

    bumpMilestone: (startupId, msId) => setDb(prev => ({
      ...prev, startups: prev.startups.map(s => s.id !== startupId ? s : {
        ...s, milestones: s.milestones.map(m => m.id === msId ? { ...m, progress: Math.min(100, m.progress + 12), status: m.progress + 12 >= 100 ? 'done' : m.status } : m),
      }),
    })),

    setUserStatus: (userId, status) => setDb(prev => ({ ...prev, users: prev.users.map(u => u.id === userId ? { ...u, status } : u) })),
    resolveFlag: (flagId) => setDb(prev => ({ ...prev, flags: prev.flags.map(f => f.id === flagId ? { ...f, status: 'resolved' } : f) })),

    audit,

    resetDemo: () => {
      localStorage.removeItem(DB_KEY); localStorage.removeItem(SS_KEY);
      window.location.reload();
    },
  };

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

type Party0 = { userId: string; name: string; org: string; hue: number; online: boolean };
export { MIN };

/** Which of a founder's (possibly several) startups is currently in focus. */
export function activeStartup(db: { startups: Startup[] }, user: User | null): Startup | undefined {
  if (!user) return undefined;
  const owned = db.startups.filter(s => s.ownerId === user.id);
  return owned.find(s => s.id === user.focusStartupId) ?? owned[0];
}
