import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Boxes, Code2, Layers, Tag, Upload, AlertTriangle } from "lucide-react";
import { PageHeader, Swatch } from "@/components/AppShell";
import { useDS } from "@/lib/ds/store";
import { diffTokens } from "@/lib/ds/store";
import { EXPORT_TARGETS, groupOf } from "@/lib/ds/engine";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Overview — Nexus Design OS" },
      { name: "description", content: "Your design system at a glance: tokens, components, releases and pipelines." },
      { property: "og:title", content: "Overview — Nexus Design OS" },
      { property: "og:description", content: "Your design system at a glance: tokens, components, releases and pipelines." },
    ],
  }),
  component: Overview,
});

function Overview() {
  const { tokens, resolved, components, releases } = useDS();
  const groups = Object.entries(
    tokens.reduce<Record<string, number>>((a, t) => ((a[groupOf(t.path)] = (a[groupOf(t.path)] ?? 0) + 1), a), {}),
  );
  const errors = resolved.filter((t) => t.error);
  const aliases = resolved.filter((t) => t.aliasOf).length;
  const pending = diffTokens(releases[0]?.snapshot ?? [], tokens);
  const pendingCount = pending.added + pending.changed + pending.removed;
  const colors = resolved.filter((t) => t.type === "color" && t.path.includes("semantic"));

  return (
    <div>
      <PageHeader title="Design system" subtitle="Single source of truth — from tokens to shipped code." />
      <div className="grid gap-5 lg:grid-cols-3">
        <section className="glass p-6 lg:row-span-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span className="flex items-center gap-2"><Layers className="h-4 w-4" /> Total tokens</span>
            <Link to="/tokens" className="grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground" aria-label="Open tokens">
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <p className="mt-4 text-5xl font-semibold tracking-tight">{tokens.length}</p>
          <p className="mt-2 inline-block rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
            {aliases} aliases · {errors.length} broken
          </p>
          <p className="mt-6 text-sm font-medium">Quick actions</p>
          <div className="mt-3 grid grid-cols-4 gap-2 text-center text-xs">
            {[
              { to: "/tokens", icon: Upload, l: "Import" },
              { to: "/export", icon: Code2, l: "Export" },
              { to: "/components", icon: Boxes, l: "Components" },
              { to: "/releases", icon: Tag, l: "Release" },
            ].map((a) => (
              <Link key={a.l} to={a.to} className="flex flex-col items-center gap-2">
                <span className="grid h-11 w-11 place-items-center rounded-full border bg-card"><a.icon className="h-4 w-4" /></span>
                {a.l}
              </Link>
            ))}
          </div>
          <p className="mt-8 text-sm font-medium">Groups</p>
          <ul className="mt-2 divide-y">
            {groups.map(([g, n]) => (
              <li key={g} className="flex justify-between py-2.5 text-sm">
                <span className="capitalize">{g}</span><span className="text-muted-foreground">{n}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="glass p-6">
          <p className="text-sm text-muted-foreground">Unreleased changes</p>
          <p className="mt-3 text-4xl font-semibold">{pendingCount}</p>
          <div className="mt-3 flex gap-2 text-xs">
            <span className="rounded-full bg-success-soft px-2 py-0.5 text-success">+{pending.added}</span>
            <span className="rounded-full bg-muted px-2 py-0.5">~{pending.changed}</span>
            <span className="rounded-full bg-danger-soft px-2 py-0.5 text-destructive">−{pending.removed}</span>
          </div>
          <Link to="/releases" className="mt-5 block rounded-full bg-primary py-2.5 text-center text-sm font-medium text-primary-foreground">
            {releases[0] ? `Publish after v${releases[0].version}` : "Publish first release"}
          </Link>
        </section>

        <section className="glass p-6">
          <p className="text-sm text-muted-foreground">Semantic palette</p>
          <div className="mt-4 grid grid-cols-4 gap-3">
            {colors.map((c) => (
              <div key={c.path} className="text-center">
                <Swatch value={c.resolved} className="h-12 w-full rounded-xl" />
                <p className="mt-1 truncate text-[11px] text-muted-foreground">{c.path.split(".").pop()}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="glass p-6 lg:col-span-1">
          <div className="flex justify-between text-sm"><span className="font-medium">Components</span><Link to="/components" className="text-muted-foreground">View all</Link></div>
          <ul className="mt-3 space-y-3">
            {components.map((c) => (
              <li key={c.id} className="flex items-center justify-between">
                <span className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-muted"><Boxes className="h-4 w-4" /></span><span className="text-sm">{c.name}</span></span>
                <span className="text-xs capitalize text-muted-foreground">{c.status}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="relative flex flex-col overflow-hidden rounded-3xl bg-gradient-card p-6 text-primary-foreground shadow-lg">
          <p className="text-sm font-medium text-primary">Pipelines</p>
          <p className="mt-auto pt-10 text-2xl font-semibold">{EXPORT_TARGETS.length} targets</p>
          <p className="text-sm opacity-90">CSS · Tailwind · TS · Swift · Kotlin · JSON</p>
          <Link to="/export" className="mt-4 self-start rounded-full bg-card px-4 py-1.5 text-sm text-foreground">Generate code</Link>
        </section>

        {errors.length > 0 && (
          <section className="glass flex items-start gap-3 border-destructive/40 p-6 lg:col-span-3">
            <AlertTriangle className="mt-0.5 h-4 w-4 text-destructive" />
            <div className="text-sm">
              <p className="font-medium">{errors.length} tokens failed to resolve</p>
              {errors.slice(0, 4).map((e) => <p key={e.path} className="text-muted-foreground">{e.path}: {e.error}</p>)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
