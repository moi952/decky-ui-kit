import React, { useState } from "react";
import { DialogButton, Focusable } from "@decky/ui";
import type { GamepadEvent } from "@decky/ui";
import { useFocusHighlightClass } from "./internal/focusHighlight";
import { Separator } from "./internal/Separator";
import {
  ACCENT_DANGER,
  ACCENT_INFO,
  ACCENT_SUCCESS,
  ACCENT_WARNING,
  DEFAULT_HIGHLIGHT_BACKGROUND,
  DEFAULT_HIGHLIGHT_COLOR,
  DEFAULT_PANEL_BACKGROUND,
  DEFAULT_ROUNDNESS,
} from "./internal/theme";

export interface MediaRowProps {
  // The leading visual — an <img>, a placeholder, badges overlaid on it,
  // whatever the caller composes. This component only sizes/positions the
  // box around it; it never assumes anything about what's inside.
  media?: React.ReactNode;
  // Only meaningful for mediaLayout="fixed" — a centered icon box is a
  // square, so it needs both dimensions given explicitly.
  mediaWidth?: number;
  // "fixed": exact mediaWidth×mediaHeight box, media centered inside (a
  // small square icon). "stretch": exactly mediaHeight tall, but its
  // width is NOT fixed — it's whatever the media inside renders at that
  // height (a caller's <img style={{ height: "100%", width: "auto" }}>
  // sizes itself from its own aspect ratio), so a cover image always
  // shows in full, never cropped to fit a guessed box width.
  mediaLayout?: "fixed" | "stretch";
  mediaHeight?: number;
  // Both layouts fix the media box's own height (mediaHeight) rather than
  // stretching it — "stretch" only means "no fixed width", not "no fixed
  // height" — so once `title` wraps past one line (titleLines > 1) and
  // the row grows taller than mediaHeight, this decides where that box
  // sits in the extra space instead of the browser's flex default (top).
  mediaAlign?: "top" | "center" | "bottom";

  title: React.ReactNode;
  // 1 (default): single line, ellipsis-truncated. >1: line-clamped over
  // that many lines instead (a game capsule's title can wrap).
  titleLines?: number;
  // Extra content under the title — pass your own pre-colored line(s) for
  // a status stack (version, an available update, an error, ...). Omit
  // for a title-only row.
  details?: React.ReactNode;

  onPress?: () => void;
  // Rendered in its own row below the header, inside a Focusable — omit
  // entirely for a single-button card with no separate action row (e.g.
  // a plain "press to open" game capsule). Given without `onPress`,
  // pressing the header toggles this row's visibility instead.
  actions?: React.ReactNode;
  // Only relevant when `actions` is given. Starts the actions row hidden
  // — if `onPress` is also given, the header always navigates rather
  // than toggling it, so a caller mixing both (e.g. a list where each
  // row opens a detail page but a few also have an inline action) should
  // pick this per row from its own data instead of expecting the header
  // to reveal it.
  collapsedByDefault?: boolean;

  // The row's own default look, always one of these — there's no "no
  // color at all" state, so a row's size (border width) never shifts
  // depending on which color a sibling happens to have. "light"/"dark"
  // are the two plain card backgrounds (no particular state implied);
  // "transparent" is for a flush row in a continuous list (bottomSeparator)
  // that must show no card look of its own at all; the rest are accent
  // colors for flagging a real state (e.g. "success" for "currently
  // active"). `accentBorderColor`/`accentBackground` override either
  // half individually when you need an exact color this doesn't cover.
  color: "light" | "dark" | "transparent" | "success" | "danger" | "info" | "warning";
  accentBorderColor?: string;
  accentBorderWidth?: number;
  accentBackground?: string;

  // Independent of borderOnFocus below — this one only gates
  // `highlightBackground` (the tint behind the row on focus/hover).
  highlightOnFocus?: boolean;
  // Independent of highlightOnFocus above — a real border on focus/
  // hover (via an inset box-shadow, not `outline` — outline draws
  // outside the border box and never respects border-radius, which is
  // exactly what made an earlier outline-based version of this look
  // broken on rounded corners).
  borderOnFocus?: boolean;
  highlightColor?: string;
  highlightBackground?: string;
  // Gap below this row, for a list of spaced-apart cards. Leave at the
  // 0 default and use `bottomSeparator` instead for a continuous divided
  // list — the two are meant as alternatives, not combined.
  spacing?: number;
  // A bottom divider line, for a continuous divided list (the
  // alternative to `spacing`'s spaced-card look) — pair with
  // `color="transparent"` so the row itself shows no card background,
  // just the divider and the focus highlight.
  bottomSeparator?: boolean;

  onSecondaryButton?: (evt: GamepadEvent) => void;
  onSecondaryActionDescription?: React.ReactNode;
}

const MEDIA_ALIGN = {
  top: "flex-start",
  center: "center",
  bottom: "flex-end",
} as const;

const COLOR_STYLES = {
  // The plain default look — reserves the same border width as every
  // accented color below (an invisible border, not an absent one) so a
  // row's size never shifts when it becomes accented.
  light: { border: "transparent", background: DEFAULT_PANEL_BACKGROUND },
  dark: { border: "transparent", background: "#202225" },
  // Fully invisible — for a row inside a continuous divided list
  // (bottomSeparator), which must show no card look of its own.
  transparent: { border: "transparent", background: "transparent" },
  success: { border: ACCENT_SUCCESS, background: "#0d1f0d" },
  danger: { border: ACCENT_DANGER, background: "#2a0d0d" },
  info: { border: ACCENT_INFO, background: "#0d1a2a" },
  warning: { border: ACCENT_WARNING, background: "#2a1f0d" },
} as const;

// A focusable media+title(+details)(+actions) row — the shape shared by
// "a list of apps, each with a status stack and inline action buttons"
// and "a grid of game capsules, each just a cover and a title" alike.
// Which of those two a given instance looks like follows entirely from
// which props are passed: `actions` opts into the header+actions-row
// split (with its own show/hide), `mediaLayout="stretch"` opts into a
// cover-image box instead of a centered icon. Neither look is "the
// special case" — both are just points on the same prop surface.
export const MediaRow: React.FC<MediaRowProps> = ({
  media,
  mediaWidth = 32,
  mediaLayout = "fixed",
  mediaHeight = 32,
  // Layout-dependent default, not a flat "center" for both — a flex item
  // with a definite cross-size (mediaBox always has one: mediaHeight)
  // renders at the container's cross-axis start when align-items can't
  // actually stretch it, which is what "stretch" always used before this
  // prop existed. Defaulting it to "center" for both would have silently
  // changed every existing mediaLayout="stretch" caller's look (e.g.
  // decky-proton-launch's own GameRow cover art) the moment they upgraded
  // — this keeps that exact prior look until a caller opts in.
  mediaAlign = mediaLayout === "stretch" ? "top" : "center",
  title,
  titleLines = 1,
  details,
  onPress,
  actions,
  collapsedByDefault = false,
  color,
  accentBorderColor,
  accentBorderWidth = 2,
  accentBackground,
  highlightOnFocus = true,
  borderOnFocus = true,
  highlightColor = DEFAULT_HIGHLIGHT_COLOR,
  highlightBackground = DEFAULT_HIGHLIGHT_BACKGROUND,
  spacing = 0,
  bottomSeparator = false,
  onSecondaryButton,
  onSecondaryActionDescription,
}) => {
  const { cls, styleTag } = useFocusHighlightClass("dck-media-row", {
    highlightOnFocus,
    borderOnFocus,
    highlightColor,
    highlightBackground,
    borderWidth: accentBorderWidth,
    hasBottomDivider: bottomSeparator,
  });
  const hasActions = !!actions;
  // `collapsedByDefault` always governs the initial state, `onPress` or
  // not — a caller with both `onPress` and `actions` (the header presses
  // through to `onPress`, so there's no in-place toggle for those rows)
  // is expected to pick `collapsedByDefault` per row from its own data
  // (e.g. only expanding the ones that actually need attention), not
  // rely on this component to always force it open.
  const [expanded, setExpanded] = useState(!collapsedByDefault || !hasActions);

  const stretch = mediaLayout === "stretch";
  const resolvedBorderColor = accentBorderColor ?? COLOR_STYLES[color].border;
  const resolvedBackground = accentBackground ?? COLOR_STYLES[color].background;

  // The card's own outer look — applied directly to whichever element
  // ends up on the outside: the header button itself when there's no
  // actions row (nothing else to wrap), or a containing div when there
  // is (the actions row is that div's other child). `background`/
  // `border` are always resolved to a real value (never omitted) — an
  // inline style key present with value `undefined` still wins the
  // object-spread merge against whatever default the element underneath
  // set for that same property, so leaving either one unset would risk
  // the browser's own native DialogButton chrome bleeding through
  // instead of this card's own look.
  // bottomSeparator rows use an inset box-shadow (see focusHighlight.ts)
  // for their focus frame instead of a border-color swap, so they carry
  // no border of their own to begin with (always "transparent" anyway,
  // per this prop's own convention) — reserving one here regardless
  // would push that box-shadow the same width further inward, leaving a
  // ring of this row's own background visible between its true edge and
  // the highlight frame.
  const cardStyle: React.CSSProperties = {
    // Always the full shared roundness, all 4 corners, bottomSeparator
    // row or not — the divider itself is a separate element (see
    // Separator below), not this row's own border, so there's nothing
    // here for a radius to clip or curve.
    borderRadius: DEFAULT_ROUNDNESS,
    overflow: "hidden",
    background: resolvedBackground,
    border: `${bottomSeparator ? 0 : accentBorderWidth}px solid ${resolvedBorderColor}`,
    ...(spacing ? { marginBottom: spacing } : {}),
  };

  const highlightStyle = styleTag ? <style>{styleTag}</style> : null;

  const titleNode = (
    <div
      style={{
        fontSize: 13,
        // Steam's own default line-height runs noticeably taller than this
        // font actually needs — harmless for a single line, but it's what
        // pushes a 2+ line title past mediaHeight in the first place
        // (mediaAlign, above, only ever manages the leftover once that
        // happens; this cuts down how much leftover there is to manage).
        lineHeight: 1.2,
        fontWeight: 600,
        color: "#fff",
        ...(titleLines > 1
          ? {
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: titleLines,
              WebkitBoxOrient: "vertical" as const,
            }
          : {
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }),
      }}
    >
      {title}
    </div>
  );

  const mediaBox = (
    <div
      style={
        stretch
          ? {
              position: "relative",
              height: mediaHeight,
              flexShrink: 0,
              overflow: "hidden",
              alignSelf: MEDIA_ALIGN[mediaAlign],
            }
          : {
              width: mediaWidth,
              height: mediaHeight,
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              alignSelf: MEDIA_ALIGN[mediaAlign],
            }
      }
    >
      {media}
    </div>
  );

  const textBox = (
    <div
      style={{
        flex: 1,
        minWidth: 0,
        textAlign: "left",
        ...(stretch ? { display: "flex", alignItems: "center" } : {}),
      }}
    >
      {titleNode}
      {details}
    </div>
  );

  const handleClick = () => {
    if (onPress) onPress();
    else if (hasActions) setExpanded((v) => !v);
  };

  // No actions row: the header button IS the whole card — no wrapper
  // element at all, the exact single-element structure a plain "press to
  // open" capsule (e.g. a game cover) had before this became a shared
  // component. Only an actions row (below) needs something to wrap.
  if (!hasActions) {
    return (
      <>
        {highlightStyle}
        <DialogButton
          className={cls}
          onClick={handleClick}
          onSecondaryButton={onSecondaryButton}
          onSecondaryActionDescription={onSecondaryActionDescription}
          style={{
            ...cardStyle,
            width: "100%",
            boxSizing: "border-box",
            display: "flex",
            alignItems: stretch ? "stretch" : "center",
            gap: 10,
            padding: stretch ? 0 : "4px 8px",
          }}
        >
          {mediaBox}
          {textBox}
        </DialogButton>
        {bottomSeparator && <Separator marginTop={1} />}
      </>
    );
  }

  return (
    <>
      <div className={cls} style={{ width: "100%", boxSizing: "border-box", ...cardStyle }}>
        {highlightStyle}

        <DialogButton
          onClick={handleClick}
          onSecondaryButton={onSecondaryButton}
          onSecondaryActionDescription={onSecondaryActionDescription}
          style={{
            width: "100%",
            boxSizing: "border-box",
            display: "flex",
            alignItems: stretch ? "stretch" : "center",
            gap: 10,
            padding: stretch ? 0 : "4px 8px",
            background: "transparent",
            border: "none",
          }}
        >
          {mediaBox}
          {textBox}
        </DialogButton>

        {expanded && (
          <Focusable
            style={{
              display: "flex",
              gap: 8,
              width: "100%",
              boxSizing: "border-box",
              padding: "0 8px 6px",
            }}
            flow-children="horizontal"
          >
            {actions}
          </Focusable>
        )}
      </div>
      {bottomSeparator && <Separator marginTop={1} />}
    </>
  );
};
