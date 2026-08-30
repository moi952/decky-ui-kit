// Shared default values across every component in this library — this
// package is a theme as much as a component set, so a color used as the
// default in more than one place lives here once instead of as N
// separately-hand-typed hex literals that could drift apart by accident.
//
// Only genuinely identical values get consolidated here — a component
// whose own default already differs on purpose (e.g. StatusCard's own
// success/error greens/reds, chosen independently to match several
// existing Decky plugins) keeps its own constant untouched.

// Focus/hover — MediaRow and ScreenshotCarousel's own borderOnFocus/
// highlightOnFocus defaults.
export const DEFAULT_HIGHLIGHT_COLOR = "#dcdedf";
export const DEFAULT_HIGHLIGHT_BACKGROUND = "#2a3a4a";

// The plain "card"/trigger background — AnchoredDropdown's own default
// trigger fill and MediaRow's color="light" already matched this value
// independently before either one referenced the other.
export const DEFAULT_PANEL_BACKGROUND = "#35373c";

// The four accent/state colors — MediaRow's own color="success"/
// "danger"/"info"/"warning" border, and (for danger/info specifically)
// the exact same values InlineConfirm's own variant="danger"/"primary"
// already used independently before either one referenced the other.
export const ACCENT_SUCCESS = "#4caf50";
export const ACCENT_DANGER = "#ef4444";
export const ACCENT_INFO = "#4b9cf7";
export const ACCENT_WARNING = "#f5a623";

// Corner radius for every plain "card"/row-shaped element (MediaRow,
// ScreenshotCarousel's stage, InfoTable — not StatusCard's own bigger,
// independently-chosen 8px). `--round-radius-size` is a real CSSLoader
// theme hook (a "round corners" theme sets it; confirmed working
// end-to-end — this library's own use of it just reads whatever value
// such a theme provides), and 4px is the fallback for when no such theme
// is installed — InfoTable's own value from before this got a shared
// name, restored here after a fully-reverted attempt at this same thing
// on MediaRow/ScreenshotCarousel earlier broke their own bottomSeparator
// divider (see the `hasBottomDivider`/`bottomSeparator` conditional
// everywhere this constant is actually used — a nonzero radius clips a
// divider row's own straight-across `overflow:hidden` bottom border into
// a curve at each corner, so a divider row must ALWAYS use 0 instead,
// never this constant, regardless of what a theme sets).
export const DEFAULT_ROUNDNESS = "var(--round-radius-size, 4px)";

// One size scale, shared by every input-like/pressable control in this
// library (ActionButton, InlineConfirm's own Confirm+Cancel pair,
// FieldTextInput, AnchoredDropdown's own trigger) — "small"/"medium"/
// "large" everywhere, not "default" on some and "small"/"medium"/"large"
// on others. `minHeight` — a real `min-height`, NOT a fixed `height` (an
// earlier version of this used a fixed height instead: it guaranteed
// alignment for one-line content, but a button/dropdown whose label
// wraps to 2, 3, 4 lines had nowhere to grow into and got clipped
// outright, which is worse than the misalignment this was meant to
// fix). `min-height` avoids that: it only ever adds height when the
// natural content is shorter than this table's own number, and never
// caps it when content genuinely needs more room.
// For that to actually guarantee alignment across every consumer for
// the common one-line case, though, this table's own numbers have to be
// AT LEAST each consumer's own one-line natural height (padding+font-
// line-height+border) — smaller doesn't work, since then min-height
// does nothing and each consumer just renders its own different natural
// size again (which is exactly what happened with the previous, too-
// small 28/32/36 guesses). "small"'s 33px comes from real measurements
// (not a guess): at that size, AnchoredDropdown's own trigger needs 19px
// (content) + 12px (padding) + 2px (border) = 33px just to fit without
// squeezing its own content — the tallest of the three consumers
// measured, so it's the real floor for all of them (ActionButton/
// FieldTextInput both fit
// inside 33px with room to spare, not squeezed). medium/large are
// this same table's own 4px-per-step spacing shifted up by that same
// +5px correction, NOT independently measured yet — recheck them on
// real hardware before trusting these two specifically.
export const SIZE_STYLE = {
  small: { fontSize: 12, minHeight: 33 },
  medium: { fontSize: 14, minHeight: 37 },
  large: { fontSize: 16, minHeight: 41 },
} as const;

export type ComponentSize = keyof typeof SIZE_STYLE;
