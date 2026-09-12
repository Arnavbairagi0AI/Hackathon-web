import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useApp } from './store';
import { EMPTY_PROFILE, type Profile, type StepId } from './schemeTypes';

/* ============================================================
   Scheme-flow store — ported from the standalone prototype,
   adapted to the platform's context pattern (same shape as
   lib/store.tsx: provider + hook). Persists to localStorage per
   signed-in user so two founders never share journey state.
   Falls back to an anonymous slot when signed out. No backend.
   ============================================================ */

const KEY_PREFIX = 'venturesetu.scheme.v1';
const LEGACY_KEY = 'venturesetu.scheme.v1';
const keyFor = (userId: string | null) => `${KEY_PREFIX}:${userId ?? 'anon'}`;

interface Persisted {
  profile: Profile;
  completed: Partial<Record<StepId, boolean>>;
  selectedSchemeId: string | null;
  selectedPartnerId: string | null;
}

const initial: Persisted = {
  profile: { ...EMPTY_PROFILE },
  completed: {},
  selectedSchemeId: null,
  selectedPartnerId: null,
};

function load(key: string): Persisted {
  try {
    let raw = localStorage.getItem(key);
    // One-time adoption of the pre-per-user key so a founder who
    // completed the journey before this change doesn't lose it.
    if (!raw) {
      raw = localStorage.getItem(LEGACY_KEY);
      if (raw) {
        localStorage.setItem(key, raw);
        localStorage.removeItem(LEGACY_KEY);
      }
    }
    if (!raw) return initial;
    const p = JSON.parse(raw) as Partial<Persisted>;
    return {
      profile: { ...initial.profile, ...(p.profile ?? {}) },
      completed: p.completed ?? {},
      selectedSchemeId: p.selectedSchemeId ?? null,
      selectedPartnerId: p.selectedPartnerId ?? null,
    };
  } catch {
    return initial;
  }
}

interface SchemeCtx extends Persisted {
  setProfile: (patch: Partial<Profile>) => void;
  markComplete: (step: StepId) => void;
  selectScheme: (id: string | null) => void;
  selectPartner: (id: string | null) => void;
  resetScheme: () => void;
}

const Ctx = createContext<SchemeCtx | null>(null);

export function SchemeProvider({ children }: { children: ReactNode }) {
  const { user } = useApp();
  const uid = user?.id ?? null;
  const [state, setState] = useState<Persisted>(() => load(keyFor(uid)));

  // Swap the in-memory state when the signed-in user changes — set
  // during render (React's documented "adjust state when a prop
  // changes" pattern), so the new user's journey shows immediately.
  const [prevUid, setPrevUid] = useState(uid);
  if (prevUid !== uid) {
    setPrevUid(uid);
    setState(load(keyFor(uid)));
  }

  useEffect(() => {
    try {
      localStorage.setItem(keyFor(uid), JSON.stringify(state));
    } catch {
      /* session-only mode */
    }
  }, [state, uid]);

  const store: SchemeCtx = {
    ...state,
    setProfile: patch => setState(s => ({ ...s, profile: { ...s.profile, ...patch } })),
    markComplete: step => setState(s => ({ ...s, completed: { ...s.completed, [step]: true } })),
    selectScheme: id => setState(s => ({ ...s, selectedSchemeId: id })),
    selectPartner: id => setState(s => ({ ...s, selectedPartnerId: id })),
    resetScheme: () => setState({ ...initial, profile: { ...EMPTY_PROFILE } }),
  };

  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useScheme(): SchemeCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error('useScheme must be used inside SchemeProvider');
  return v;
}
