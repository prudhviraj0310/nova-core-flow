import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/AppShell";
import { Textarea } from "@/components/ui/textarea";
import { useDS } from "@/lib/ds/store";
import { auditCode } from "@/lib/ds/engine";

export const Route = createFileRoute("/audit")({
  head: () => ({
    meta: [
      { title: "Code audit — Nexus Design OS" },
      { name: "description", content: "Find hardcoded colors and spacing that should use design tokens." },
      { property: "og:title", content: "Code audit — Nexus Design OS" },
      { property: "og:description", content: "Find hardcoded colors and spacing that should use design tokens." },
    ],
  }),
  component: AuditPage,
});

const SAMPLE = `.button {\n  background: #34466e;\n  padding: 16px 24px;\n  color: #ff00aa;\n  margin-top: 13px;\n}`;

function AuditPage() {
  const { tokens } = useDS();
  const [code, setCode] = useState(SAMPLE);
  const issues = auditCode(code, tokens);
  return (
    <div>
      <PageHeader title="Compliance audit" subtitle="Paste code to catch values that bypass the design system." />
      <div className="grid gap-5 lg:grid-cols-2">
        <Textarea value={code} onChange={(e) => setCode(e.target.value)} rows={16} className="glass font-mono text-xs" />
        <div className="glass p-5">
          <p className="mb-3 text-sm font-medium">{issues.length} issues</p>
          {!issues.length && <p className="flex items-center gap-2 text-sm text-success"><CheckCircle2 className="h-4 w-4" />All values use tokens.</p>}
          <ul className="space-y-2">
            {issues.map((i, n) => (
              <li key={n} className="rounded-xl border bg-card p-3 text-sm">
                <span className="text-muted-foreground">Line {i.line} · </span>{i.message} <code className="font-mono">{i.match}</code>
                <p className="mt-1 text-xs">{i.suggestion ? <>Use <code className="font-mono text-primary">{i.suggestion}</code></> : <span className="text-destructive">No matching token</span>}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
