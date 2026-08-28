# decky-ui-kit

[![npm version](https://img.shields.io/npm/v/@moi952/decky-ui-kit)](https://www.npmjs.com/package/@moi952/decky-ui-kit)
[![npm downloads](https://img.shields.io/npm/dt/@moi952/decky-ui-kit)](https://www.npmjs.com/package/@moi952/decky-ui-kit)

[![View the interactive demo](https://img.shields.io/badge/-View%20the%20interactive%20demo-66c0f4?style=for-the-badge&logo=googlechrome&logoColor=white)](https://moi952.github.io/decky-ui-kit/)

![Demo screenshot](./assets/demo-screenshot.png)

Reusable UI components for [Decky Loader](https://github.com/SteamDeckHomebrew/decky-loader) plugins, built for cases where Steam's own native popup components (`DropdownItem`, `showContextMenu`, `Menu`) can't be used — opening any of them resets the whole plugin panel back to its home view once closed. Every component here is a hand-built inline overlay instead, with its own keyboard/mouse/gamepad focus handling.

## Install

```bash
npm install @moi952/decky-ui-kit
```

Or pin an exact version: `npm install @moi952/decky-ui-kit@0.1.0`.

Installing straight from GitHub also works (`npm install github:moi952/decky-ui-kit#v0.1.0`) — `dist/` is committed on every release, so it needs no install-time build step either way.

## Demo

Every prop combination side by side, with a live Playground panel per component. It's a plain-browser visual reference, not the real Steam client: `Field`/`DialogButton`/`Focusable` are mocked, so corner-radius inheritance, the native focus halo, and gamepad input aren't reproduced there.

Run it locally with `npm run demo:dev`.

## Components

### `AnchoredDropdown`

A dropdown whose option list renders inline, anchored to its own trigger — not through a native Steam popup.

```tsx
import { AnchoredDropdown } from "@moi952/decky-ui-kit";

<AnchoredDropdown
  variant="boxed"
  focusStyle="fill"
  options={[
    { value: "a", label: "Option A" },
    { value: "b", label: "Option B" },
  ]}
  selectedValue={value}
  onChange={setValue}
/>
```

<details>
<summary>Props</summary>

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `options` | `{ value: string; label: string }[]` | — | The list of choices. |
| `selectedValue` | `string` | — | Current value. In `multiple` mode, a comma-joined list of values. |
| `onChange` | `(value: string) => void` | — | Called with the new value (or comma-joined list, in `multiple` mode). |
| `variant` | `"row" \| "boxed"` | `"boxed"` | `"row"`: flat, matches surrounding list rows. `"boxed"`: bordered box with an arrow. |
| `focusStyle` | `"fill" \| "outline"` | `"fill"` | `"fill"`: solid white background on focus. `"outline"`: transparent border that fills on focus. |
| `size` | `"default" \| "small"` | `"default"` | Row/trigger height and font size. |
| `bgColor` | `string` | Steam-like dark gray | Background color. |
| `textColor` | `string` | Steam-like light gray | Text color. |
| `borderColor` | `string` | `"transparent"` | Trigger and list border color. |
| `blurBackground` | `boolean` | `true` | Blurs the panel behind the list while it's open. |
| `multiple` | `boolean` | `false` | Multi-select mode (comma-joined value). |
| `selectedValuesLayout` | `"inline" \| "stacked"` | `"inline"` | Multi-select summary as one comma-joined line, or one value per line. |
| `selectedCountLabel` | `(count: number) => ReactNode` | — | Multi-select only: small caption above the trigger once ≥1 option is picked (e.g. `n => \`${n} selected\``). No i18n of its own — the caller formats the text. |
| `onSecondaryButton` | `() => void` | — | Fires on gamepad X / Steam "Secondary" while the trigger or open list has focus. |
| `onSecondaryActionDescription` | `ReactNode` | — | Shown in Steam's own bottom action-legend bar next to the X prompt (only while `onSecondaryButton` is set). Same names/shape as `@decky/ui`'s own `FooterLegendProps`. |
| `onOptionsButton` | `() => void` | — | Fires on gamepad Y / Steam "Options" while the trigger or open list has focus. |
| `onOptionsActionDescription` | `ReactNode` | — | Shown in Steam's own bottom action-legend bar next to the Y prompt (only while `onOptionsButton` is set). |
| `maxDisplayLines` | `number` | `1` | Lines the trigger's selected-value summary can wrap before clipping. `0` shows it in full, unclamped. |
| `maxVisibleOptions` | `number` | — | Rows visible before the list scrolls. `0` shows every option, no cap. Defaults to a fixed max height. |
| `highlightOnFocus` | `boolean` | `true` | Native Steam focus highlight band, themeable via CSS Loader. |
| `bottomSeparator` | `boolean` | `true` | Native Steam separator line below the trigger. |

</details>

The list's corner radius is read at runtime from the trigger's own computed `border-radius`, so it automatically matches Steam's native rounding — including any CSS Loader "round" theme — without hardcoding a variable name.

### `CollapsibleSection`

An expand/collapse row built on `Field`, for tucking secondary content (settings, history, details) behind a single toggleable header.

```tsx
import { CollapsibleSection } from "@moi952/decky-ui-kit";

<CollapsibleSection label="Advanced settings" expanded={expanded} onToggle={() => setExpanded(!expanded)}>
  <MySettingsFields />
</CollapsibleSection>
```

<details>
<summary>Props</summary>

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | — | Header text. |
| `expanded` | `boolean` | — | Whether the children are shown. State is owned by the caller. |
| `onToggle` | `() => void` | — | Called on click/activate; flip `expanded` in response. |
| `children` | `ReactNode` | — | Rendered below the header while `expanded` is `true`. |

</details>

### `FieldTextInput`

A text input with the standard Field row look (bottom separator, focus highlight, size) — `@decky/ui`'s own `TextField` doesn't extend the same row contract `ToggleField`/`SliderField` do, so it renders bare by default.

```tsx
import { FieldTextInput } from "@moi952/decky-ui-kit";

<FieldTextInput label="Frame Rate Limit" mustBeNumeric value={value} onChange={setValue} />
```

<details>
<summary>Props</summary>

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | — | Current value. |
| `onChange` | `(value: string) => void` | — | Called with the new value on every keystroke. |
| `label` | `ReactNode` | — | Label text/content. |
| `size` | `"default" \| "small"` | `"default"` | Input font size and padding. |
| `labelPosition` | `"top" \| "left" \| "right"` | `"top"` | Where the label sits relative to the input. |
| `mustBeNumeric` | `boolean` | `false` | Restricts input to numeric characters. |
| `bottomSeparator` | `boolean` | `true` | Native Steam separator line below the row. |
| `highlightOnFocus` | `boolean` | `true` | Background highlight while the input has focus. |

</details>
