import React, { useEffect, useRef, useState } from "react";
import { DialogButton, Focusable, GamepadButton } from "@decky/ui";
import type { GamepadEvent } from "@decky/ui";
import { DEFAULT_HIGHLIGHT_BACKGROUND, useFocusHighlightClass } from "./internal/focusHighlight";
import { Separator } from "./internal/Separator";
import { DEFAULT_ROUNDNESS } from "./internal/theme";

export interface ScreenshotCarouselProps {
  // Image URLs (or data URIs) — nothing renders at all once none of them
  // actually load (an empty array, or every one 404s/errors — a public
  // community feed can go stale), so a caller can pass this through
  // unconditionally without its own `screenshots.length > 0 &&` guard.
  screenshots: string[];
  height?: number;
  // A bottom divider line, for sitting inside a continuous divided list
  // — same convention as MediaRow's own `bottomSeparator`.
  bottomSeparator?: boolean;
  // Independent of borderOnFocus below — a background tint behind the
  // stage on focus/hover (only visible where the photo doesn't already
  // fill the box — it never washes over the image itself).
  highlightOnFocus?: boolean;
  // Independent of highlightOnFocus above — a real border on focus/
  // hover (inset box-shadow, not `outline` — see MediaRow's own note on
  // why outline doesn't respect border-radius).
  borderOnFocus?: boolean;
  highlightColor?: string;
  highlightBackground?: string;
  // Shown in Steam's own bottom action-legend bar next to the LB/RB
  // prompts (only while there's more than one screenshot to move between).
  prevActionDescription?: React.ReactNode;
  nextActionDescription?: React.ReactNode;
  // Pressing the stage opens a bigger in-place view of the current
  // screenshot — on by default. See this component's own note above:
  // every approach tried for this (a real Decky modal, a React portal,
  // this in-place overlay) shipped with a real, reported problem on
  // real-device testing, so a caller can opt out entirely rather than
  // keep shipping the least-broken version of a still-broken feature.
  zoomEnabled?: boolean;
}

// A single screenshot "stage" (app store/catalog "photos", not the
// small square icon MediaRow already covers) — reads as one pressable
// card, exactly like a MediaRow instance (same rounded corners, same
// bottomSeparator/focus-border conventions), not a bare image. Moved
// with DIR_LEFT/DIR_RIGHT or LB/RB (advertised in Steam's own bottom
// action-legend bar) — no on-screen prev/next buttons here, those only
// belong in the full-screen zoom this opens on press. Steam's own focus
// engine navigates by on-screen geometry, not by "next in this list",
// so DIR_LEFT/DIR_RIGHT are handled by hand here — the same technique
// AnchoredDropdown's own option list uses for DIR_UP/DIR_DOWN.
//
// The zoom is an in-place overlay (a local `zoomed` boolean), NOT a real
// Decky modal (showModal/ModalRoot). A real modal was tried — twice,
// across two different pages this got embedded in, including a
// bHideCloseIcon + onCancel-only variant meant to rule out a suspected
// GenericDialog double-dismiss — and on real-device testing B still
// sometimes popped straight past it to the plugin's own home page, and
// once even left the underlying page's own B handling unresponsive
// afterward. A React portal onto document.body was also tried, to
// escape the QAM panel's own bounds — that broke gamepad navigation
// outright (Steam's own focus-nav system walks the real DOM, not
// React's, so a portaled node loses its place in the panel's own
// recognized nav tree). This in-place version is the one confirmed
// reliable on real hardware: B always closes the zoom and returns to
// this exact page, via the same `onCancelButton` prop every other "go
// back" in this library/its consuming apps already uses, and nothing
// else in the tree is in a position to misinterpret it, since it never
// leaves this component's own place in the real DOM. The trade-off is
// real: the zoom stays sized to the QAM panel, not the physical screen.
export const ScreenshotCarousel: React.FC<ScreenshotCarouselProps> = ({
  screenshots,
  height = 120,
  bottomSeparator = false,
  highlightOnFocus = true,
  borderOnFocus = true,
  highlightColor,
  highlightBackground = DEFAULT_HIGHLIGHT_BACKGROUND,
  prevActionDescription = "Previous",
  nextActionDescription = "Next",
  zoomEnabled = true,
}) => {
  const [index, setIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  // A public community feed (AppImageHub's) can point at a screenshot
  // that's since been moved/deleted upstream — this is what makes
  // "only ever show real images" actually true, rather than just
  // "an empty array counts as none". Shared between the inline stage
  // and the zoom overlay — both ever show the same URL for a given
  // index, so there's nothing to track twice.
  const [brokenUrls, setBrokenUrls] = useState<Set<string>>(new Set());
  const stageRef = useRef<HTMLDivElement | null>(null);
  const zoomRef = useRef<HTMLDivElement | null>(null);
  const { cls, styleTag, reserveBorder } = useFocusHighlightClass("dck-screenshot-stage", {
    highlightOnFocus,
    borderOnFocus,
    highlightColor,
    highlightBackground,
    hasBottomDivider: bottomSeparator,
  });

  useEffect(() => {
    if (zoomed) zoomRef.current?.focus();
  }, [zoomed]);

  const visible = screenshots.filter((url) => !brokenUrls.has(url));
  if (visible.length === 0) return null;
  const safeIndex = Math.min(index, visible.length - 1);

  const goPrev = () => setIndex((i) => (i - 1 + visible.length) % visible.length);
  const goNext = () => setIndex((i) => (i + 1) % visible.length);

  const handleButtonDown = (evt: GamepadEvent) => {
    if (
      evt.detail.button === GamepadButton.DIR_LEFT ||
      evt.detail.button === GamepadButton.BUMPER_LEFT
    ) {
      evt.stopPropagation();
      goPrev();
    } else if (
      evt.detail.button === GamepadButton.DIR_RIGHT ||
      evt.detail.button === GamepadButton.BUMPER_RIGHT
    ) {
      evt.stopPropagation();
      goNext();
    }
  };

  const markBroken = () => setBrokenUrls((prev) => new Set(prev).add(visible[safeIndex]));

  const closeZoom = () => {
    setZoomed(false);
    stageRef.current?.focus();
  };

  return (
    <>
      {styleTag && <style>{styleTag}</style>}
      <Focusable
        style={{ width: "100%", boxSizing: "border-box" }}
        onButtonDown={handleButtonDown}
        actionDescriptionMap={
          visible.length > 1
            ? {
                [GamepadButton.BUMPER_LEFT]: prevActionDescription,
                [GamepadButton.BUMPER_RIGHT]: nextActionDescription,
              }
            : undefined
        }
      >
        <DialogButton
          ref={stageRef}
          className={cls}
          onClick={zoomEnabled ? () => setZoomed(true) : undefined}
          style={{
            width: "100%",
            padding: 0,
            height,
            overflow: "hidden",
            // Always the full shared roundness — the divider (below,
            // rendered only when bottomSeparator) is its own separate
            // element now, not this stage's own border, so there's
            // nothing here for a radius to clip or curve.
            borderRadius: DEFAULT_ROUNDNESS,
            background: "rgba(255, 255, 255, 0.03)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            ...reserveBorder,
          }}
        >
          <img
            src={visible[safeIndex]}
            alt=""
            onError={markBroken}
            style={{
              height: "100%",
              width: "auto",
              maxWidth: "100%",
              objectFit: "contain",
              display: "block",
            }}
          />
        </DialogButton>
      </Focusable>

      {visible.length > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: 4, marginTop: 6 }}>
          {visible.map((_, i) => (
            <div
              key={i}
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: i === safeIndex ? "#fff" : "rgba(255, 255, 255, 0.3)",
              }}
            />
          ))}
        </div>
      )}

      {bottomSeparator && <Separator marginTop={1} />}

      {zoomEnabled && zoomed && (
        <Focusable
          ref={zoomRef}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            // vw/vh, not `inset: 0` — a plugin panel's own ancestor
            // chrome likely applies a transform (for its slide in/out
            // animation), which becomes the containing block a `fixed`
            // element's `inset`/percentage sizing resolves against
            // instead of the real viewport — on real-device testing this
            // rendered far larger than the actual visible screen,
            // spilling off the right edge. Viewport units read the true
            // window size directly, regardless of any transformed
            // ancestor in between.
            width: "100vw",
            height: "100vh",
            boxSizing: "border-box",
            overflow: "hidden",
            zIndex: 1000,
            background: "rgba(0, 0, 0, 0.92)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          flow-children="horizontal"
          onCancelButton={closeZoom}
          onButtonDown={handleButtonDown}
          actionDescriptionMap={
            visible.length > 1
              ? {
                  [GamepadButton.BUMPER_LEFT]: prevActionDescription,
                  [GamepadButton.BUMPER_RIGHT]: nextActionDescription,
                }
              : undefined
          }
        >
          <img
            src={visible[safeIndex]}
            alt=""
            onError={markBroken}
            // Full overlay width, capped at 90% of its height — bounded
            // against the overlay's own known fixed size (not a vague
            // percentage of an ambiguous flex box), so a screenshot never
            // renders past the overlay's own edges regardless of its own
            // aspect ratio. LB/RB (and D-pad) still move between shots —
            // no on-screen arrows here, same call already made for the
            // inline stage above.
            style={{ width: "100%", maxHeight: "90%", objectFit: "contain" }}
          />
        </Focusable>
      )}
    </>
  );
};
