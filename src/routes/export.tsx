import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Copy, Download } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { useDS } from "@/lib/ds/store";
import { EXPORT_TARGETS, exportTokens, type ExportTarget } from "@/lib/ds/engine";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/export")({
  head: () => ({
    meta: [
      { title: "Code export — Nexus Design OS" },
      { name: "description", content: "Generate CSS, Tailwind, TypeScript, Swift and Kotlin from your tokens." },
      { property: "og:title", content: "Code export — Nexus Design OS" },
      { property: "og:description", content: "Generate CSS, Tailwind, TypeScript, Swift and Kotlin from your tokens." },
    ],
  }),
  component: ExportPage,
});

function ExportPage() {
  const { tokens } = useDS();
  const [target, setTarget] = useState<ExportTarget>("css");
  const meta = EXPORT_TARGETS.find((t) => t.id === target)!;
  const code = exportTokens(tokens, target);

  const download = () => {
    const url = URL.createObjectURL(new Blob([code], { type: "text/plain" }));
    const a = Object.assign(document.createElement("a"), { href: url, download: meta.file });
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <PageHeader title="Code export" subtitle="Deterministic output for every platform, straight from your tokens." />
      <div className="grid gap-5 lg:grid-cols-[240px_1fr]">
        <div className="glass h-fit p-2">
          {EXPORT_TARGETS.map((t) => (
            <button key={t.id} onClick={() => setTarget(t.id)} className={cn("flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm", target === t.id ? "bg-primary text-primary-foreground" : "hover:bg-accent")}>
              {t.label}<span className="font-mono text-[10px] opacity-70">{t.file}</span>
            </button>
          ))}
        </div>
        <div className="glass overflow-hidden">
          <div className="flex items-center justify-between border-b px-5 py-3">
            <span className="font-mono text-sm">{meta.file}</span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="rounded-full" onClick={() => { navigator.clipboard.writeText(code); toast.success("Copied"); }}><Copy className="h-3.5 w-3.5" />Copy</Button>
              <Button size="sm" className="rounded-full" onClick={download}><Download className="h-3.5 w-3.5" />Download</Button>
            </div>
          </div>
          <pre className="max-h-[70vh] overflow-auto bg-code-bg p-5 font-mono text-xs leading-relaxed text-code-fg">{code}</pre>
        </div>
      </div>
    </div>
  );
}
