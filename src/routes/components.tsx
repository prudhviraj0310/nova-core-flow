import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/AppShell";
import { useDS } from "@/lib/ds/store";
import { ComponentPreview } from "@/components/ComponentPreview";
import { cn } from "@/lib/utils";
import type { DSComponent } from "@/lib/ds/seed";

export const Route = createFileRoute("/components")({
  head: () => ({
    meta: [
      { title: "Components — Nexus Design OS" },
      { name: "description", content: "Component inventory with live previews rendered from your tokens." },
      { property: "og:title", content: "Components — Nexus Design OS" },
      { property: "og:description", content: "Component inventory with live previews rendered from your tokens." },
    ],
  }),
  component: ComponentsPage,
});

const STATUSES: DSComponent["status"][] = ["stable", "beta", "deprecated"];

function ComponentsPage() {
  const { components, updateComponent } = useDS();
  return (
    <div>
      <PageHeader title="Components" subtitle="Previews update instantly when you change a token." />
      <div className="grid gap-5 md:grid-cols-2">
        {components.map((c) => (
          <section key={c.id} className="glass p-6">
            <div className="grid h-36 place-items-center rounded-2xl bg-muted"><ComponentPreview id={c.id} /></div>
            <div className="mt-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">{c.name}</h2>
              <div className="flex gap-1">
                {STATUSES.map((s) => (
                  <button key={s} onClick={() => updateComponent({ ...c, status: s })} className={cn("rounded-full px-2.5 py-0.5 text-xs capitalize", c.status === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>{s}</button>
                ))}
              </div>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{c.description}</p>
            <div className="mt-3 flex flex-wrap gap-1">
              {c.tokens.map((t) => <span key={t} className="rounded-full bg-accent px-2 py-0.5 font-mono text-[11px] text-accent-foreground">{t}</span>)}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
