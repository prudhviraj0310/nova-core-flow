import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Search, Trash2, Upload, Link2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, Swatch } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDS } from "@/lib/ds/store";
import { groupOf, parseDTCG, type Token, type TokenType } from "@/lib/ds/engine";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tokens")({
  head: () => ({
    meta: [
      { title: "Tokens — Nexus Design OS" },
      { name: "description", content: "Manage design tokens with aliases, groups and DTCG import." },
      { property: "og:title", content: "Tokens — Nexus Design OS" },
      { property: "og:description", content: "Manage design tokens with aliases, groups and DTCG import." },
    ],
  }),
  component: TokensPage,
});

const TYPES: TokenType[] = ["color", "dimension", "fontFamily", "fontWeight", "duration", "number", "shadow"];

function TokensPage() {
  const { resolved, upsertToken, removeToken, replaceTokens, tokens } = useDS();
  const [q, setQ] = useState("");
  const [group, setGroup] = useState("all");
  const [editing, setEditing] = useState<{ token: Token; original?: string } | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const [importText, setImportText] = useState("");

  const groups = useMemo(() => ["all", ...new Set(tokens.map((t) => groupOf(t.path)))], [tokens]);
  const list = resolved.filter(
    (t) => (group === "all" || groupOf(t.path) === group) && t.path.toLowerCase().includes(q.toLowerCase()),
  );

  const save = () => {
    if (!editing) return;
    const t = editing.token;
    if (!/^[\w-]+(\.[\w-]+)+$/.test(t.path)) { toast.error("Path must look like group.name"); return; }
    if (!t.value.trim()) { toast.error("Value is required"); return; }
    if (editing.original !== t.path && tokens.some((x) => x.path === t.path)) { toast.error("That path already exists"); return; }
    upsertToken(t, editing.original);
    setEditing(null);
    toast.success("Token saved");
  };

  const doImport = (mode: "merge" | "replace") => {
    try {
      const parsed = parseDTCG(JSON.parse(importText));
      if (!parsed.length) { toast.error("No tokens found in that JSON"); return; }
      if (mode === "replace") replaceTokens(parsed);
      else {
        const map = new Map(tokens.map((t) => [t.path, t]));
        parsed.forEach((t) => map.set(t.path, t));
        replaceTokens([...map.values()]);
      }
      toast.success(`Imported ${parsed.length} tokens`);
      setImportOpen(false);
      setImportText("");
    } catch {
      toast.error("Invalid JSON");
    }
  };

  return (
    <div>
      <PageHeader
        title="Tokens"
        subtitle="W3C DTCG tokens with alias chains like {color.primitive.navy.700}."
        actions={
          <>
            <Button variant="outline" className="rounded-full" onClick={() => setImportOpen(true)}><Upload className="h-4 w-4" />Import JSON</Button>
            <Button className="rounded-full" onClick={() => setEditing({ token: { path: `${group === "all" ? "color" : group}.new`, type: "color", value: "#000000" } })}>
              <Plus className="h-4 w-4" />New token
            </Button>
          </>
        }
      />
      <div className="glass p-4">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <div className="relative mr-auto w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search tokens" className="rounded-full pl-9" />
          </div>
          {groups.map((g) => (
            <button key={g} onClick={() => setGroup(g)} className={cn("rounded-full px-3 py-1 text-sm capitalize", group === g ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
              {g}
            </button>
          ))}
        </div>
        <div className="divide-y">
          {list.map((t) => (
            <div key={t.path} className="group flex items-center gap-4 py-3">
              {t.type === "color" ? <Swatch value={t.resolved} className="h-9 w-9 rounded-full" /> : <span className="grid h-9 w-9 place-items-center rounded-full bg-muted text-[10px] text-muted-foreground">{t.type.slice(0, 3)}</span>}
              <button className="min-w-0 flex-1 text-left" onClick={() => setEditing({ token: { ...t }, original: t.path })}>
                <p className="truncate font-mono text-sm">{t.path}</p>
                <p className="truncate text-xs text-muted-foreground">{t.description ?? t.type}</p>
              </button>
              {t.aliasOf && <span className="hidden items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-xs text-accent-foreground sm:flex"><Link2 className="h-3 w-3" />{t.aliasOf}</span>}
              <span className={cn("w-40 truncate text-right font-mono text-sm", t.error && "text-destructive")}>{t.error ?? t.resolved}</span>
              <button aria-label={`Delete ${t.path}`} onClick={() => { removeToken(t.path); toast("Token deleted"); }} className="text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          {!list.length && <p className="py-10 text-center text-sm text-muted-foreground">No tokens match.</p>}
        </div>
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing?.original ? "Edit token" : "New token"}</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-3">
              <Input value={editing.token.path} onChange={(e) => setEditing({ ...editing, token: { ...editing.token, path: e.target.value } })} placeholder="color.semantic.brand" className="font-mono" />
              <Select value={editing.token.type} onValueChange={(v) => setEditing({ ...editing, token: { ...editing.token, type: v as TokenType } })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
              <div className="flex gap-2">
                {editing.token.type === "color" && !editing.token.value.startsWith("{") && (
                  <input type="color" aria-label="Pick color" value={editing.token.value.slice(0, 7)} onChange={(e) => setEditing({ ...editing, token: { ...editing.token, value: e.target.value } })} className="h-9 w-12 rounded border" />
                )}
                <Input value={editing.token.value} onChange={(e) => setEditing({ ...editing, token: { ...editing.token, value: e.target.value } })} placeholder="#ffffff or {color.primitive.blue.500}" className="font-mono" />
              </div>
              <Input value={editing.token.description ?? ""} onChange={(e) => setEditing({ ...editing, token: { ...editing.token, description: e.target.value || undefined } })} placeholder="Description (optional)" />
            </div>
          )}
          <DialogFooter><Button onClick={save}>Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={importOpen} onOpenChange={setImportOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Import DTCG / Tokens Studio JSON</DialogTitle></DialogHeader>
          <Textarea rows={12} value={importText} onChange={(e) => setImportText(e.target.value)} className="font-mono text-xs" placeholder={'{ "color": { "$type": "color", "brand": { "$value": "#4f6596" } } }'} />
          <DialogFooter>
            <Button variant="outline" onClick={() => doImport("replace")}>Replace all</Button>
            <Button onClick={() => doImport("merge")}>Merge</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
