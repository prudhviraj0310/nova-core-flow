import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/AppShell";
import { useDS } from "@/lib/ds/store";
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

export function useTokenVars() {
  const { resolved } = useDS();
  const v = (p: string) => resolved.find((t) => t.path === p)?.resolved ?? undefined;
  return v;
}

export function ComponentPreview({ id }: { id: string }) {
  const v = useTokenVars();
  // Live previews intentionally render user-defined token values inline.
  const primary = v("color.semantic.primary");
  const surface = v("color.semantic.surface");
  const text = v("color.semantic.text");
  const font = v("font.family.sans");
  switch (id) {
    case "button":
      return <button style={{ background: primary, color: surface, borderRadius: v("radius.pill"), padding: `${v("spacing.sm")} ${v("spacing.lg")}`, fontFamily: font }}>Continue</button>;
    case "card":
      return <div style={{ background: surface, color: text, borderRadius: v("radius.lg"), padding: v("spacing.lg"), fontFamily: font, boxShadow: "0 8px 24px -12px rgba(0,0,0,.2)" }}><b>Card title</b><p style={{ color: v("color.semantic.text-muted"), fontSize: 13 }}>Supporting text</p></div>;
    case "badge":
      return <span style={{ background: v("color.semantic.success"), color: surface, borderRadius: v("radius.pill"), padding: `${v("spacing.xs")} ${v("spacing.sm")}`, fontSize: 12, fontFamily: font }}>Active</span>;
    case "input":
      return <input readOnly value="Search…" style={{ background: surface, color: text, borderRadius: v("radius.md"), padding: v("spacing.sm"), border: `1px solid ${v("color.primitive.slate.200")}`, fontFamily: font }} />;
    default:
      return null;
  }
}

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
