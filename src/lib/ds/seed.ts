import { parseDTCG, type Token } from "./engine";

export const SEED_DTCG = {
  color: {
    $type: "color",
    primitive: {
      navy: { 900: { $value: "#1e2a4a" }, 700: { $value: "#34466e" }, 500: { $value: "#4f6596" } },
      blue: { 100: { $value: "#e6edf7" }, 300: { $value: "#a9bcdb" }, 500: { $value: "#6b88bd" } },
      slate: { 50: { $value: "#f4f6f9" }, 200: { $value: "#dde3ec" }, 600: { $value: "#5b6577" }, 900: { $value: "#141a26" } },
      green: { 500: { $value: "#2f9e6b" } },
      red: { 500: { $value: "#d4554a" } },
    },
    semantic: {
      background: { $value: "{color.primitive.slate.50}", $description: "App canvas" },
      surface: { $value: "#ffffff", $description: "Cards and panels" },
      text: { $value: "{color.primitive.slate.900}" },
      "text-muted": { $value: "{color.primitive.slate.600}" },
      primary: { $value: "{color.primitive.navy.700}", $description: "Primary actions" },
      success: { $value: "{color.primitive.green.500}" },
      danger: { $value: "{color.primitive.red.500}" },
    },
  },
  spacing: {
    $type: "dimension",
    xs: { $value: "4px" },
    sm: { $value: "8px" },
    md: { $value: "16px" },
    lg: { $value: "24px" },
    xl: { $value: "40px" },
  },
  radius: {
    $type: "dimension",
    sm: { $value: "8px" },
    md: { $value: "14px" },
    lg: { $value: "22px" },
    pill: { $value: "999px" },
  },
  font: {
    family: {
      $type: "fontFamily",
      sans: { $value: "Manrope, sans-serif" },
      mono: { $value: "JetBrains Mono, monospace" },
    },
    weight: {
      $type: "fontWeight",
      regular: { $value: "400" },
      semibold: { $value: "600" },
    },
  },
  motion: {
    $type: "duration",
    fast: { $value: "120ms" },
    base: { $value: "220ms" },
  },
};

export const SEED_TOKENS: Token[] = parseDTCG(SEED_DTCG);

export interface DSComponent {
  id: string;
  name: string;
  status: "stable" | "beta" | "deprecated";
  description: string;
  tokens: string[];
}

export const SEED_COMPONENTS: DSComponent[] = [
  { id: "button", name: "Button", status: "stable", description: "Primary and secondary actions.", tokens: ["color.semantic.primary", "radius.pill", "spacing.md"] },
  { id: "card", name: "Card", status: "stable", description: "Surface container for grouped content.", tokens: ["color.semantic.surface", "radius.lg", "spacing.lg"] },
  { id: "badge", name: "Badge", status: "beta", description: "Compact status label.", tokens: ["color.semantic.success", "radius.pill", "spacing.xs"] },
  { id: "input", name: "Input", status: "stable", description: "Single-line text field.", tokens: ["color.semantic.surface", "radius.md", "spacing.sm"] },
];
