/**
 * Noop's design tokens: the one place for sizes, the corner-radius ladder, spacing, type and the floating glass.
 * Colors live in `theme.ts` (from `theme.json`); components in `controls.tsx` read only these.
 */
import type { ViewStyle } from "nsh";
import { platform } from "nsh";
import { alpha, colors } from "./theme";

/** A touch screen: 44-point targets. */
export const touch = !(platform.idiom === "desktop" || platform.idiom === "mac");

/** Sizes: the gallery's proportions, a step larger (the owner reads this all day). */
export const size = {
  text: 17,
  line: 26,
  small: 15,
  tiny: 13,
  control: touch ? 44 : 38,
  controlSm: touch ? 40 : 30,
  icon: touch ? 44 : 32,
  row: touch ? 44 : 34,
  bar: touch ? 56 : 52,
  sidebar: 288,
  column: 880,
};

/**
 * The corner-radius ladder, largest first: the composer, then fields, then buttons and rows, then badges and keys.
 * Restrained on purpose: a small button never gets a pill.
 */
export const corner = {
  composer: 24,
  field: 12,
  control: 10,
  item: 8,
  badge: 6,
  key: 5,
} as const;

/** Spacing steps (points). */
export const space = { xs: 4, sm: 6, md: 8, lg: 12, xl: 16, xxl: 24 } as const;

/** Type steps (points). */
export const font = { key: 12.5, badge: 12.5, sm: 13, md: 15, lg: 17 } as const;

/** Durations shared by hover / state transitions (milliseconds). */
export const duration = { quick: 120, enter: 420 } as const;

/**
 * A floating surface, for the composer and the sidebar: Apple's Liquid Glass where it is drawn (iOS 26, macOS 26), a
 * blur elsewhere. Linux and Android before 12 draw no backdrop, so they stay opaque there, or what is behind would show
 * through the text on it.
 */
export const glass = (tint: string, cornerRadius: number): ViewStyle => ({
  borderRadius: cornerRadius,
  borderCurve: "continuous",
  borderWidth: 1,
  borderColor: alpha(colors.text, 0.1),
  boxShadow: "0 8px 28px rgba(0,0,0,0.1)",
  ...(platform.os === "linux" || (platform.os === "android" && Number(platform.version) < 31)
    ? { backgroundColor: tint }
    : { backgroundColor: alpha(tint, 0.55), glassEffect: "regular" as const, backdropFilter: "blur(20px)" }),
});

/** The floating surface of a message composer, which the conversation scrolls under. */
export const composerGlass = (active = false): ViewStyle => ({
  ...glass(colors.field, corner.composer),
  ...(platform.os === "ios" ? { backgroundColor: alpha(colors.field, 0.25) } : {}),
  boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
  borderWidth: platform.os === "ios" || platform.os === "macos" ? 0 : 1,
  borderColor: alpha(colors.text, active ? 0.22 : 0.1),
  transitionProperty: "border-color",
  transitionDuration: duration.quick,
});
