import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { EMPTY_PROFILE, type Profile, type StepId } from './schemeTypes';

/* ============================================================
   Scheme-flow store — ported from the standalone prototype,
   adapted to the platform's context pattern (same shape as
   lib/store.tsx: provider + hook). Persists to localStorage so
   a founder's scheme journey survives reloads. No backend.
   ============================================================ */


const KEY = 'venturesetu.scheme.v1';

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

function load(): Persisted {
  try {
    const raw = localStorage.getItem(KEY);
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
  const [state, setState] = useState<Persisted>(load);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* session-only mode */
    }
  }, [state]);

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
