import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Tag, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { diffTokens, useDS } from "@/lib/ds/store";

export const Route = createFileRoute("/releases")({
  head: () => ({
    meta: [
      { title: "Releases — Nexus Design OS" },
      { name: "description", content: "Version your design system and track token changes between releases." },
      { property: "og:title", content: "Releases — Nexus Design OS" },
      { property: "og:description", content: "Version your design system and track token changes between releases." },
    ],
  }),
  component: ReleasesPage,
});

function ReleasesPage() {
  const { releases, tokens, publishRelease, replaceTokens } = useDS();
  const [note, setNote] = useState("");
  const pending = diffTokens(releases[0]?.snapshot ?? [], tokens);
  const has = pending.added + pending.changed + pending.removed > 0;
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Releases" subtitle="Snapshot tokens into a version your teams can depend on." />
      <section className="glass p-6">
        <p className="text-sm text-muted-foreground">Pending: +{pending.added} added · ~{pending.changed} changed · −{pending.removed} removed</p>
        <div className="mt-3 flex gap-2">
          <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Release notes" className="rounded-full" />
          <Button className="rounded-full" disabled={!has} onClick={() => { const r = publishRelease(note || "Token updates"); setNote(""); toast.success(`Published v${r.version}`); }}>Publish</Button>
        </div>
      </section>
      <ol className="mt-6 space-y-3">
        {releases.map((r) => (
          <li key={r.version} className="glass flex items-center gap-4 p-5">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground"><Tag className="h-4 w-4" /></span>
            <div className="flex-1">
              <p className="font-semibold">v{r.version} <span className="text-xs font-normal text-muted-foreground">· {new Date(r.date).toLocaleString()}</span></p>
              <p className="text-sm text-muted-foreground">{r.note} · {r.tokenCount} tokens · +{r.changes.added} ~{r.changes.changed} −{r.changes.removed}</p>
            </div>
            <Button size="sm" variant="outline" className="rounded-full" onClick={() => { replaceTokens(r.snapshot); toast(`Restored tokens from v${r.version}`); }}><RotateCcw className="h-3.5 w-3.5" />Restore</Button>
          </li>
        ))}
        {!releases.length && <p className="py-8 text-center text-sm text-muted-foreground">No releases yet.</p>}
      </ol>
    </div>
  );
}
