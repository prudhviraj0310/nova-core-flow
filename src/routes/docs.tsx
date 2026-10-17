import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Swatch } from "@/components/AppShell";
import { useDS } from "@/lib/ds/store";
import { groupOf } from "@/lib/ds/engine";
import { ComponentPreview } from "./components";

export const Route = createFileRoute("/docs")({
  head: () => ({
    meta: [
      { title: "Documentation — Nexus Design OS" },
      { name: "description", content: "Living documentation generated from your tokens and components." },
      { property: "og:title", content: "Documentation — Nexus Design OS" },
      { property: "og:description", content: "Living documentation generated from your tokens and components." },
    ],
  }),
  component: DocsPage,
});

function DocsPage() {
  const { resolved, components, releases } = useDS();
  const groups = [...new Set(resolved.map((t) => groupOf(t.path)))];
  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader title="Living docs" subtitle={`Always in sync · ${releases[0] ? `v${releases[0].version}` : "unreleased draft"}`} />
      <article className="glass space-y-10 p-8">
        <section>
          <h2 className="text-xl font-semibold">Getting started</h2>
          <p className="mt-2 text-sm text-muted-foreground">Install the generated package and import the CSS variables once at your app root.</p>
          <pre className="mt-3 overflow-x-auto rounded-xl bg-code-bg p-4 font-mono text-xs text-code-fg">{`npm i @nexus/tokens\nimport "@nexus/tokens/tokens.css";`}</pre>
        </section>
        {groups.map((g) => (
          <section key={g}>
            <h2 className="text-xl font-semibold capitalize">{g}</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {resolved.filter((t) => groupOf(t.path) === g).map((t) => (
                <div key={t.path} className="flex items-center gap-3 rounded-xl border bg-card p-3">
                  {t.type === "color" ? <Swatch value={t.resolved} className="h-10 w-10 rounded-lg" /> : t.type === "dimension" ? <span className="h-3 rounded bg-primary" style={{ width: t.resolved ?? 0, maxWidth: 80 }} /> : null}
                  <div className="min-w-0">
                    <p className="truncate font-mono text-xs">{t.path}</p>
                    <p className="text-xs text-muted-foreground">{t.resolved}{t.aliasOf && ` ← ${t.aliasOf}`}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
        <section>
          <h2 className="text-xl font-semibold">Components</h2>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            {components.map((c) => (
              <div key={c.id} className="rounded-xl border bg-card p-4">
                <div className="grid h-24 place-items-center rounded-lg bg-muted"><ComponentPreview id={c.id} /></div>
                <p className="mt-2 font-medium">{c.name} <span className="text-xs capitalize text-muted-foreground">· {c.status}</span></p>
                <p className="text-sm text-muted-foreground">{c.description}</p>
              </div>
            ))}
          </div>
        </section>
      </article>
    </div>
  );
}
