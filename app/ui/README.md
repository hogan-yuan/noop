# app/ui — Noop's component layer

`app/ui` is the only place where Noop's controls get their look. App code (`App.tsx` and the files beside it) composes
these components and passes data and behavior; it does not restyle them with inline colors, radii or paddings.

## Rules

- New UI uses a `ui` component. If none fits, add or extend one here first, then use it.
- No parallel copies: a control defined in `App.tsx` that duplicates one here is a bug.
- Sizes, radii, spacing, type and the glass surface come from `tokens.ts`; colors from `theme.ts` (`theme.json`).
- Radius ladder, largest first: composer (24) > field (12) > button / row (10, 8) > badge (6) > key (5). A small
  button never gets a pill.
- API follows gpui-component: an enum `variant` and `size`, positive flags (`loading`, `selected`, `checked`,
  `tooltip`), never negative switches like `hideX` / `noX`.
- Look follows ReUI / shadcn: flat fills, no decorative borders, no left-border accents. Icons are Lucide (`icons.tsx`).
- Status colors: running blue, waiting yellow, online / done green, error red (`Indicator`).

## Components

| Component | Use |
|---|---|
| `Button` | Labelled action. `variant`: primary / secondary / outline / ghost / danger; `size`: sm / md; `icon`, `loading`, `checked`, `kbd`, `note`, `grow`. |
| `IconButton` | Icon-only action. Square `ghost` (toolbars, sidebar) or round `primary` (send). `label` is its name and tooltip. |
| `Input` | One-line text field. |
| `Switch` | On / off. |
| `Badge` | Short tag. `variant`: neutral / accent / info / warn / danger. |
| `Indicator` | Status dot. `status`: online / running / queued / waiting / idle / error. |
| `Kbd` | A key or shortcut. |
| `Separator` | Hairline; `top` lays it on a row's top edge, `vertical` for columns. |
| `Tooltip` | Hover bubble with an optional shortcut, for an element's `tooltip`. |

## Preview

`nsh run app/Preview.tsx` opens every component in each variant; use it for review and before / after screenshots.

## License

The theme, icons and helpers were first vendored from NSH (examples/nsh-gallery-ui, https://github.com/longbridge/nsh)
under the Apache License 2.0 — see LICENSE.
