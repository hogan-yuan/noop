/**
 * Noop's base controls. App code composes these and does not restyle them: a new look goes here, once.
 * API in gpui-component's shape: an enum `variant` and `size`, positive flags (`loading`, `selected`, `checked`).
 * Look in ReUI / shadcn's: flat fills, no decorative edges, the radius ladder of `tokens.ts`.
 */
import type { JSX, ViewStyle } from "nsh";
import { Text, View } from "nsh";
import { Input as BaseInput, Switch as BaseSwitch } from "nsh/base";
import { Icon, type IconName } from "./icons";
import { alpha, colors, focusRing, hovered, tints } from "./theme";
import { corner, duration, font, size, space, touch } from "./tokens";
import { Spinner, switchLook } from "./index";
import { Tooltip } from "./tooltip";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md";

const pressed = (): ViewStyle => ({ backgroundColor: alpha(colors.text, 0.09) });

/** A labelled button. `primary` is the one main action of an area; `outline` a quiet secondary choice. */
export function Button(props: {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconName;
  /** A key shown before the label (a shortcut, a number to press). */
  kbd?: string;
  /** A short faint note after the label. */
  note?: string;
  /** Work started by it is going on: a spinner in the icon's place, no presses. */
  loading?: boolean;
  disabled?: boolean;
  /** The option the owner picked: a check and an accent edge, not dimmed. */
  checked?: boolean;
  /** Grows to share a row with its siblings. */
  grow?: boolean;
  onPress: () => void;
  testID?: string;
  accessibilityLabel?: string;
}) {
  const variant = () => props.variant ?? "secondary";
  const sm = () => props.size === "sm";
  const fg = () =>
    variant() === "primary" ? colors.onAccent : variant() === "danger" ? colors.danger : variant() === "secondary" ? colors.text : colors.muted;
  const look = (): ViewStyle =>
    ({
      primary: { backgroundColor: colors.accentFill, borderColor: "transparent" },
      secondary: { backgroundColor: colors.raised, borderColor: "transparent" },
      outline: { backgroundColor: "transparent", borderColor: colors.line },
      ghost: { backgroundColor: "transparent", borderColor: "transparent" },
      danger: { backgroundColor: tints.danger, borderColor: "transparent" },
    })[variant()];
  const idle = () => props.disabled || props.loading;
  return (
    <View
      role="button"
      testID={props.testID}
      accessibilityLabel={props.accessibilityLabel}
      accessibilityState={{ disabled: !!props.disabled, ...(props.checked ? { checked: true } : {}) }}
      onPress={() => !idle() && props.onPress()}
      hoverStyle={idle() || props.checked ? undefined : variant() === "primary" ? { opacity: 0.92 } : variant() === "danger" ? { backgroundColor: alpha(colors.danger, 0.16) } : hovered()}
      activeStyle={idle() ? undefined : variant() === "primary" ? { opacity: 0.85 } : pressed()}
      focusStyle={focusRing()}
      style={{
        minHeight: sm() ? size.controlSm : size.control,
        maxWidth: "100%",
        flexShrink: 1,
        flexGrow: props.grow ? 1 : 0,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: space.md,
        paddingHorizontal: sm() ? 10 : 14,
        paddingVertical: sm() ? 4 : 6,
        borderRadius: corner.control,
        borderCurve: "continuous",
        borderWidth: 1,
        opacity: props.disabled && !props.checked ? 0.45 : 1,
        transitionProperty: "background-color, border-color, opacity",
        transitionDuration: duration.quick,
        ...look(),
        ...(props.checked ? { backgroundColor: tints.accent, borderColor: colors.accentFill, cursor: "default" } : props.disabled ? { cursor: "default" } : {}),
      }}
    >
      <If when={props.checked}>
        <Icon name="check" size={16} tint={colors.accentFill} />
      </If>
      <If when={props.kbd}>
        <Kbd keys={props.kbd!} inverted={variant() === "primary"} />
      </If>
      <If when={props.loading}>
        <Spinner size={14} tint={fg()} />
      </If>
      <If when={!props.loading && props.icon}>
        <Icon name={props.icon!} size={sm() ? 14 : 16} tint={fg()} />
      </If>
      <Text style={{ flexShrink: 1, textAlign: "center", fontSize: sm() ? font.sm : font.md, lineHeight: sm() ? 18 : 21, fontWeight: variant() === "primary" ? "600" : "500", color: fg() }}>{props.label}</Text>
      <If when={props.note}>
        <Text style={{ fontSize: font.sm, color: variant() === "primary" ? alpha(colors.onAccent, 0.7) : colors.faint }}>{props.note}</Text>
      </If>
    </View>
  );
}

/**
 * An icon-only button. `ghost` (default) is the square quiet button of toolbars and the sidebar; `primary` a filled
 * circle, the composer's send. `label` is its accessible name and tooltip.
 */
export function IconButton(props: {
  icon: IconName;
  label: string;
  variant?: "ghost" | "primary";
  shortcut?: string;
  /** Shows as on (an open panel, a toggled mode). */
  selected?: boolean;
  disabled?: boolean;
  /** Show `label` as a tooltip on hover (default on with a pointer). */
  tooltip?: boolean;
  onPress: () => void;
  testID?: string;
}) {
  const primary = () => props.variant === "primary";
  const box = primary() ? (touch ? 44 : 36) : size.icon;
  const showTip = () => !touch && props.tooltip !== false;
  return (
    <View
      role="button"
      testID={props.testID}
      accessibilityLabel={props.label}
      accessibilityState={props.disabled ? { disabled: true } : props.selected === undefined ? undefined : { selected: props.selected }}
      onPress={() => !props.disabled && props.onPress()}
      tooltip={showTip() ? <Tooltip label={props.label} shortcut={props.shortcut} /> : undefined}
      hoverStyle={props.disabled ? undefined : primary() ? { opacity: 0.9 } : hovered()}
      activeStyle={props.disabled || primary() ? undefined : pressed()}
      focusStyle={focusRing()}
      style={{
        width: box,
        height: box,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: primary() ? box / 2 : corner.control,
        borderCurve: "continuous",
        borderWidth: 1,
        borderColor: "transparent",
      }}
    >
      <If
        when={primary()}
        else={<Icon name={props.icon} size={18} tint={props.selected ? colors.accent : colors.muted} />}
      >
        <View style={{ width: touch ? 32 : 28, height: touch ? 32 : 28, borderRadius: touch ? 16 : 14, alignItems: "center", justifyContent: "center", backgroundColor: colors.accentFill }}>
          <Icon name={props.icon} size={touch ? 18 : 16} tint={colors.onAccent} />
        </View>
      </If>
    </View>
  );
}

export type BadgeVariant = "neutral" | "accent" | "info" | "warn" | "danger";

/** A short tag: a tone's tint behind its color. */
export function Badge(props: { label: string; variant?: BadgeVariant }) {
  const v = () => props.variant ?? "neutral";
  const fg = () => (v() === "neutral" ? colors.muted : v() === "accent" ? colors.accent : colors[v() as "info" | "warn" | "danger"]);
  const bg = () => (v() === "neutral" ? colors.raised : tints[v() as "accent" | "info" | "warn" | "danger"]);
  return (
    <View style={{ height: 22, paddingHorizontal: space.md, justifyContent: "center", borderRadius: corner.badge, backgroundColor: bg() }}>
      <Text style={{ fontSize: font.badge, fontWeight: "600", color: fg() }}>{props.label}</Text>
    </View>
  );
}

/** A status: running blue, waiting yellow, online / done green, error red; queued and idle are grey. */
export type IndicatorStatus = "online" | "running" | "queued" | "waiting" | "idle" | "error";

/** A status dot. */
export function Indicator(props: { status: IndicatorStatus }) {
  const color = () => ({ online: colors.up, running: colors.info, queued: colors.muted, waiting: colors.warn, idle: colors.faint, error: colors.danger })[props.status];
  return <View accessibilityLabel={props.status} style={{ width: 8, height: 8, borderRadius: 4, flexShrink: 0, backgroundColor: color() }} />;
}

/** A key, or keys: `1`, `Enter`, `⌘K`. `inverted` sits on a filled (primary) surface. */
export function Kbd(props: { keys: string; inverted?: boolean }) {
  return (
    <View
      style={{
        minWidth: 22,
        height: 22,
        paddingHorizontal: space.sm,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: corner.key,
        backgroundColor: props.inverted ? alpha(colors.onAccent, 0.16) : colors.raised,
      }}
    >
      <Text style={{ fontSize: font.key, fontWeight: "500", color: props.inverted ? colors.onAccent : colors.muted, fontVariant: ["tabular-nums"] }}>{props.keys}</Text>
    </View>
  );
}

/**
 * A hairline. In flow by default (`vertical` for a column divider); `top` lays it on the top edge of a row instead,
 * inset `inset` points from the leading side (16 by default), so stacked rows read as one list.
 */
export function Separator(props: { vertical?: boolean; top?: boolean; inset?: number }) {
  return (
    <View
      style={
        props.top
          ? { position: "absolute", top: 0, left: props.inset ?? 16, right: 0, height: 0.5, backgroundColor: colors.line }
          : props.vertical
            ? { width: 0.5, alignSelf: "stretch", backgroundColor: colors.line }
            : { height: 0.5, marginLeft: props.inset ?? 0, backgroundColor: colors.line }
      }
    />
  );
}

/** An on / off switch: the knob springs across, the track changes color natively. */
export function Switch(props: { checked: boolean; onChange: (checked: boolean) => void; label?: string; disabled?: boolean; testID?: string }) {
  const look = switchLook(() => props.checked);
  return (
    <BaseSwitch
      testID={props.testID}
      checked={props.checked}
      disabled={props.disabled}
      onChange={({ checked }) => props.onChange(checked)}
      accessibilityLabel={props.label}
      // 8 pt more to press on every side, without taking more room.
      style={{ margin: -8, padding: 8 }}
      trackStyle={look.trackStyle}
      thumbStyle={look.thumbStyle}
    />
  );
}

/** A one-line text field in the field look (the radius ladder's `field` step). */
export function Input(props: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** Hides what is typed (a password, a code). */
  masked?: boolean;
  readonly?: boolean;
  onSubmit?: () => void;
  testID?: string;
  accessibilityLabel?: string;
  style?: ViewStyle;
}): JSX.Element {
  return (
    <BaseInput
      testID={props.testID}
      value={props.value}
      placeholder={props.placeholder}
      masked={props.masked}
      readonly={props.readonly}
      accessibilityLabel={props.accessibilityLabel ?? props.placeholder}
      class="placeholder:text-faint"
      onChange={({ value }) => props.onChange(value)}
      onSubmit={() => props.onSubmit?.()}
      focusStyle={focusRing()}
      style={{
        minHeight: size.control,
        paddingHorizontal: space.lg,
        borderRadius: corner.field,
        borderCurve: "continuous",
        borderWidth: 1,
        borderColor: colors.fieldBorder,
        backgroundColor: colors.field,
        color: colors.text,
        fontSize: font.md,
        ...props.style,
      }}
    />
  );
}
