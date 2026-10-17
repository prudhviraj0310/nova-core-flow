import { useDS } from "@/lib/ds/store";

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

