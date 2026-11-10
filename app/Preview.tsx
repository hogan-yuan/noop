/**
 * The component preview: every control of `ui/` in each variant, for review and screenshots.
 * Run it with `nsh run app/Preview.tsx`; `?dark` is not needed, it follows the system appearance.
 */
import { Scroll, mount, signal, setColorScheme, colorScheme, Text, View } from "nsh";
import type { JSX } from "nsh";
import { Badge, Button, colors, corner, IconButton, Indicator, Input, Kbd, Separator, Switch, Tooltip, type BadgeVariant, type ButtonVariant, type IndicatorStatus } from "./ui";

const VARIANTS: ButtonVariant[] = ["primary", "secondary", "outline", "ghost", "danger"];
const BADGES: BadgeVariant[] = ["neutral", "accent", "info", "warn", "danger"];
const STATUSES: IndicatorStatus[] = ["online", "running", "queued", "waiting", "idle", "error"];

function Group(props: { title: string; children: JSX.Element }) {
  return (
    <View style={{ gap: 12 }}>
      <Text style={{ fontSize: 13, fontWeight: "600", color: colors.muted }}>{props.title}</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 10 }}>{props.children}</View>
    </View>
  );
}

function Preview() {
  const on = signal(true);
  const text = signal("");
  return (
    <Scroll style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ padding: 32, gap: 28, maxWidth: 880 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Text style={{ fontSize: 22, fontWeight: "700", color: colors.text }}>Noop UI</Text>
          <Button size="sm" variant="ghost" icon="sun" label={colorScheme() === "dark" ? "Light" : "Dark"} onPress={() => setColorScheme(colorScheme() === "dark" ? "light" : "dark")} />
        </View>
        <Group title="Button · md">
          {VARIANTS.map((v) => <Button variant={v} label={v[0].toUpperCase() + v.slice(1)} onPress={() => {}} />)}
        </Group>
        <Group title="Button · sm, icon, loading, disabled, checked, kbd, note">
          <Button size="sm" variant="primary" icon="check" label="Approve" onPress={() => {}} />
          <Button size="sm" icon="bell" label="Notify" onPress={() => {}} />
          <Button loading label="Sending…" variant="primary" onPress={() => {}} />
          <Button disabled label="Disabled" onPress={() => {}} />
          <Button checked disabled label="B: Upgrade" onPress={() => {}} />
          <Button kbd="1" label="Write tests" note="Recommended" onPress={() => {}} />
        </Group>
        <Group title="IconButton">
          <IconButton icon="sidebar" label="Show sidebar" shortcut="⌘B" onPress={() => {}} />
          <IconButton icon="sliders" label="Settings" selected onPress={() => {}} />
          <IconButton icon="close" label="Close" shortcut="Esc" onPress={() => {}} />
          <IconButton variant="primary" icon="arrow-up" label="Send" shortcut="Enter" onPress={() => {}} />
        </Group>
        <Separator />
        <Group title="Badge">{BADGES.map((v) => <Badge variant={v} label={v} />)}</Group>
        <Group title="Indicator">
          {STATUSES.map((s) => (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Indicator status={s} />
              <Text style={{ fontSize: 14, color: colors.muted }}>{s}</Text>
            </View>
          ))}
        </Group>
        <Group title="Kbd · Switch · Tooltip">
          <Kbd keys="⌘K" />
          <Kbd keys="Enter" />
          <Switch checked={on()} onChange={on.set} label="Enabled" />
          <View tooltip={<Tooltip label="A tooltip" shortcut="⌘/" />} style={{ padding: 8, borderRadius: corner.item, backgroundColor: colors.raised }}>
            <Text style={{ fontSize: 14, color: colors.text }}>Hover me</Text>
          </View>
        </Group>
        <Group title="Input">
          <View style={{ width: 320 }}>
            <Input value={text()} onChange={text.set} placeholder="Channel name" />
          </View>
        </Group>
      </View>
    </Scroll>
  );
}

mount(Preview);
