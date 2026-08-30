import { CSSProperties, useId } from "react";
import { DEFAULT_HIGHLIGHT_BACKGROUND, DEFAULT_HIGHLIGHT_COLOR } from "./theme";

// Re-exported so existing imports of these two from this module (they
// used to be defined here) keep working — the values themselves now
// live in theme.ts, this library's one shared palette.
export { DEFAULT_HIGHLIGHT_COLOR, DEFAULT_HIGHLIGHT_BACKGROUND };

export interface FocusHighlightConfig {
  // Independent of borderOnFocus below — this one only gates
  // `highlightBackground` (the tint behind the element on focus/hover).
  highlightOnFocus?: boolean;
  // Independent of highlightOnFocus above — a real border on focus/
  // hover. A real `border`, not `outline` (outline draws outside the
  // border box and never respects border-radius) and not a box-shadow
  // either (an *inset* box-shadow paints in the same layer as content —
  // any child that fills the box edge-to-edge, e.g. a cover image with
  // no padding around it, visually covers it, making the "border" look
  // like it's behind the image instead of framing it). A real border
  // always occupies its own reserved band outside the content box, so a
  // child can never paint over it.
  borderOnFocus?: boolean;
  highlightColor?: string;
  // Optional — omit (or set highlightOnFocus false) for "border only,
  // no background wash" (right for e.g. a screenshot, where a tint over
  // the photo itself would look wrong).
  highlightBackground?: string;
  borderWidth?: number;
  // Set when the caller also draws a thin (1px) bottom divider on this
  // same element (MediaRow's/ScreenshotCarousel's own `bottomSeparator`)
  // — that divider narrows just the bottom edge's own *border* width
  // down from `borderWidth` to 1px. Changing `border-bottom-width` on
  // focus/hover to match the other three sides (tried first) fixed the
  // mismatch but grew the element's own rendered height by that delta
  // for any row whose height is content-driven ("auto") rather than
  // fixed — exactly what a continuous app list's own rows are, so
  // focusing one pushed every row after it down by a couple pixels.
  // A `box-shadow` frame instead never affects box-model dimensions at
  // all, so it's the one used here whenever there's a divider to clash
  // with. It's not used for every case (see borderOnFocus's own note on
  // why a real border is needed there) because divider rows never use
  // `mediaLayout="stretch"` with edge-to-edge content in this library's
  // own real usage, so the "hidden behind the image" risk that ruled
  // box-shadow out elsewhere never actually applies here.
  hasBottomDivider?: boolean;
}

// `prefix` becomes part of the generated class name — keep it short and
// component-specific (e.g. "dck-media-row") so two instances' scoped
// styles never collide.
//
// `reserveBorder`: a real border must already be present in the
// element's own base style (with box-sizing: border-box, so reserving
// it doesn't grow the box) for `border-color` to have anything to
// override on focus/hover without shifting layout — MediaRow's own
// `color` system already reserves one (an accent border, or a
// transparent one at the same width otherwise), so it ignores this.
// A component with no border of its own (ScreenshotCarousel) spreads
// this into its base style instead. Always includes `boxSizing` (even
// when borderOnFocus is off) so spreading it never leaves a component
// without one.
export function useFocusHighlightClass(
  prefix: string,
  {
    highlightOnFocus = true,
    borderOnFocus = true,
    highlightColor = DEFAULT_HIGHLIGHT_COLOR,
    highlightBackground,
    borderWidth = 2,
    hasBottomDivider = false,
  }: FocusHighlightConfig
): {
  cls: string;
  styleTag: string | null;
  reserveBorder: CSSProperties;
} {
  const cls = `${prefix}${useId().replace(/[^a-zA-Z0-9]/g, "")}`;

  const declarations = [
    // !important on both — the underlying native button/div this class
    // targets may set its own `border`/`background` inline (a real
    // DialogButton's own base styling does), and an inline style always
    // wins over a plain external rule regardless of selector, `!important`
    // is the only thing that reliably overrides it either way.
    borderOnFocus
      ? hasBottomDivider
        ? `box-shadow: inset 0 0 0 ${borderWidth}px ${highlightColor} !important;`
        : `border-color: ${highlightColor} !important;`
      : "",
    highlightOnFocus && highlightBackground ? `background: ${highlightBackground} !important;` : "",
  ]
    .filter(Boolean)
    .join("\n        ");

  const styleTag = declarations
    ? `
      .${cls}:focus, .${cls}:focus-within, .${cls}:hover {
        ${declarations}
      }
    `
    : null;

  const reserveBorder: CSSProperties = {
    boxSizing: "border-box",
    // Not reserved at all when hasBottomDivider — that focus frame is an
    // inset box-shadow (see above), which paints from the padding-box
    // edge inward. Reserving a real (transparent) border here as well
    // would push the box-shadow that same border-width further in,
    // leaving a ring of bare background visible between the element's
    // true outer edge and the highlight frame — exactly the "too far
    // inside" look this avoids.
    ...(borderOnFocus && !hasBottomDivider ? { border: `${borderWidth}px solid transparent` } : {}),
  };

  return { cls, styleTag, reserveBorder };
}
