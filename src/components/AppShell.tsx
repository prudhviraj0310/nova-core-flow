import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { BookOpen, Boxes, Code2, Home, Layers, ShieldCheck, Tag } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { DSProvider } from "@/lib/ds/store";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Overview", icon: Home },
  { to: "/tokens", label: "Tokens", icon: Layers },
  { to: "/components", label: "Components", icon: Boxes },
  { to: "/docs", label: "Docs", icon: BookOpen },
  { to: "/export", label: "Code export", icon: Code2 },
  { to: "/audit", label: "Audit", icon: ShieldCheck },
  { to: "/releases", label: "Releases", icon: Tag },
] as const;

export function AppShell() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const current = NAV.find((n) => (n.to === "/" ? path === "/" : path.startsWith(n.to)));
  return (
    <DSProvider>
      <div className="relative min-h-screen overflow-x-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-glow" />
        <header className="relative flex items-center justify-between px-6 py-5">
          <Link to="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
              N
            </span>
            <span className="text-xl font-semibold tracking-tight">nexus</span>
          </Link>
          <div className="glass px-4 py-2 text-sm text-muted-foreground">{current?.label ?? "Nexus"}</div>
        </header>
        <div className="relative flex gap-6 px-6 pb-10">
          <nav className="sticky top-6 flex h-fit flex-col gap-2 rounded-full bg-card/70 p-2 shadow-sm backdrop-blur" aria-label="Main">
            {NAV.map((n) => {
              const active = n === current;
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  title={n.label}
                  aria-label={n.label}
                  className={cn(
                    "grid h-10 w-10 place-items-center rounded-full transition-colors",
                    active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent",
                  )}
                >
                  <n.icon className="h-4 w-4" />
                </Link>
              );
            })}
          </nav>
          <main className="min-w-0 flex-1">
            <Outlet />
          </main>
        </div>
        <Toaster />
      </div>
    </DSProvider>
  );
}

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  );
}

export function Swatch({ value, className }: { value: string | null; className?: string }) {
  return (
    <span
      className={cn("inline-block h-6 w-6 shrink-0 rounded-md border", className)}
      // dynamic user token value — must be inline
      style={{ background: value ?? "transparent" }}
    />
  );
}
