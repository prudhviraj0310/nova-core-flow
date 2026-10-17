import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { resolveTokens, type Token } from "./engine";
import { SEED_COMPONENTS, SEED_TOKENS, type DSComponent } from "./seed";

export interface Release {
  version: string;
  date: string;
  note: string;
  tokenCount: number;
  changes: { added: number; changed: number; removed: number };
  snapshot: Token[];
}

interface State {
  tokens: Token[];
  components: DSComponent[];
  releases: Release[];
}

interface Ctx extends State {
  resolved: ReturnType<typeof resolveTokens>;
  upsertToken: (t: Token, originalPath?: string) => void;
  removeToken: (path: string) => void;
  replaceTokens: (t: Token[]) => void;
  publishRelease: (note: string) => Release;
  updateComponent: (c: DSComponent) => void;
  reset: () => void;
}

const KEY = "nexus-ds-v1";
const initial: State = { tokens: SEED_TOKENS, components: SEED_COMPONENTS, releases: [] };
const DSContext = createContext<Ctx | null>(null);

export function diffTokens(prev: Token[], next: Token[]) {
  const p = new Map(prev.map((t) => [t.path, t.value]));
  const n = new Map(next.map((t) => [t.path, t.value]));
  let added = 0, changed = 0, removed = 0;
  n.forEach((v, k) => (!p.has(k) ? added++ : p.get(k) !== v && changed++));
  p.forEach((_, k) => !n.has(k) && removed++);
  return { added, changed, removed };
}

export function DSProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(initial);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState({ ...initial, ...JSON.parse(raw) });
    } catch {}
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (loaded) localStorage.setItem(KEY, JSON.stringify(state));
  }, [state, loaded]);

  const value = useMemo<Ctx>(() => {
    const resolved = resolveTokens(state.tokens);
    return {
      ...state,
      resolved,
      upsertToken: (t, originalPath) =>
        setState((s) => {
          const key = originalPath ?? t.path;
          const exists = s.tokens.some((x) => x.path === key);
          return {
            ...s,
            tokens: exists ? s.tokens.map((x) => (x.path === key ? t : x)) : [...s.tokens, t],
          };
        }),
      removeToken: (path) => setState((s) => ({ ...s, tokens: s.tokens.filter((t) => t.path !== path) })),
      replaceTokens: (tokens) => setState((s) => ({ ...s, tokens })),
      updateComponent: (c) =>
        setState((s) => ({ ...s, components: s.components.map((x) => (x.id === c.id ? c : x)) })),
      publishRelease: (note) => {
        const last = state.releases[0];
        const [maj = 0, min = 0] = (last?.version ?? "0.0.0").split(".").map(Number);
        const rel: Release = {
          version: `${maj}.${min + 1}.0`,
          date: new Date().toISOString(),
          note,
          tokenCount: state.tokens.length,
          changes: diffTokens(last?.snapshot ?? [], state.tokens),
          snapshot: state.tokens,
        };
        setState((s) => ({ ...s, releases: [rel, ...s.releases] }));
        return rel;
      },
      reset: () => setState(initial),
    };
  }, [state]);

  return <DSContext.Provider value={value}>{children}</DSContext.Provider>;
}

export function useDS() {
  const c = useContext(DSContext);
  if (!c) throw new Error("useDS outside DSProvider");
  return c;
}
