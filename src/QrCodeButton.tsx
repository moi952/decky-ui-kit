import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { DialogButton, Navigation } from "@decky/ui";
import { CollapsibleSection } from "./CollapsibleSection";
import { useFocusHighlightClass } from "./internal/focusHighlight";
import { DEFAULT_HIGHLIGHT_BACKGROUND } from "./internal/theme";

export interface QrCodeButtonProps {
  // The URL (or any text) encoded into the QR code.
  value: string;
  label: React.ReactNode;
  // Shown under the code once revealed — e.g. "Scan with your phone, or
  // press to open in your browser".
  hint?: React.ReactNode;
  qrSize?: number;
  // Same focus/hover language as MediaRow/ScreenshotCarousel — a real
  // border (not outline/box-shadow), since an inset box-shadow paints in
  // the same layer as content and would end up hidden behind the QR
  // panel, which fills this box edge-to-edge with no padding around it.
  // Defaults to DEFAULT_HIGHLIGHT_BACKGROUND rather than
  // DEFAULT_HIGHLIGHT_COLOR (what MediaRow's own border defaults to):
  // that pale near-white gray is invisible against this component's own
  // white panel, but the library's other shared highlight constant is
  // dark enough to actually show up there while still being drawn from
  // the same established palette, not an arbitrary one-off color.
  borderOnFocus?: boolean;
  highlightColor?: string;
  // Off by default here (unlike MediaRow/ScreenshotCarousel's own
  // highlightOnFocus=true): this component's panel is deliberately white
  // to keep the QR code scannable, and MediaRow's own default
  // highlightBackground is a dark tint that would wash out over it.
  highlightOnFocus?: boolean;
  highlightBackground?: string;
}

// A collapsible section that reveals a QR code on expand — for handing off
// a URL to the user's phone (a plugin's own feedback form, a release page,
// ...) without them having to type it on a gamepad. The revealed code is
// itself a real focusable button — pressing it (gamepad A / click) opens
// `value` directly in Steam's own browser overlay via
// Navigation.NavigateToExternalWeb, for anyone who'd rather not reach for
// their phone at all.
export const QrCodeButton: React.FC<QrCodeButtonProps> = ({
  value,
  label,
  hint,
  qrSize = 160,
  borderOnFocus = true,
  highlightColor = DEFAULT_HIGHLIGHT_BACKGROUND,
  highlightOnFocus = false,
  highlightBackground,
}) => {
  const [expanded, setExpanded] = useState(false);
  const { cls, styleTag, reserveBorder } = useFocusHighlightClass("dck-qr-btn", {
    borderOnFocus,
    highlightColor,
    highlightOnFocus,
    highlightBackground,
  });

  return (
    <CollapsibleSection label={label} expanded={expanded} onToggle={() => setExpanded((v) => !v)}>
      {styleTag && <style>{styleTag}</style>}
      <DialogButton
        className={cls}
        onClick={() => Navigation.NavigateToExternalWeb(value)}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          boxSizing: "border-box",
          marginTop: 10,
          marginBottom: 10,
          padding: 12,
          background: "#fff",
          borderRadius: 8,
          ...reserveBorder,
        }}
      >
        <QRCodeSVG value={value} size={qrSize} />
        {hint && (
          <div style={{ marginTop: 8, fontSize: 11, color: "#333", textAlign: "center" }}>
            {hint}
          </div>
        )}
      </DialogButton>
    </CollapsibleSection>
  );
};
