import React from "react";
import { DialogButton, FooterLegendProps } from "@decky/ui";
import { ACCENT_DANGER, ACCENT_INFO, ComponentSize, SIZE_STYLE } from "./internal/theme";

type GamepadEvt = Parameters<NonNullable<FooterLegendProps["onSecondaryButton"]>>[0];

export interface ActionButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  size?: ComponentSize;
  // "normal": untouched native button. "bordered": translucent gray
  // card. "danger": red. "primary": blue (ACCENT_INFO).
  variant?: "normal" | "bordered" | "danger" | "primary";
  // Toggle state, e.g. a filter chip that's currently on — its own
  // color per variant, always distinct from that variant's own focus.
  pressed?: boolean;
  width?: string | number;
  disabled?: boolean;
  // Steam's own navigation hint for "focus this one first" when entering
  // a newly-revealed group of focusables (e.g. MediaRow's actions row
  // right after it expands) — without it, which button ends up focused
  // is whatever the navigation system falls back to on its own.
  preferredFocus?: boolean;

  // X BUTTON
  onSecondaryButton?: (evt: GamepadEvt) => void;
  onSecondaryActionDescription?: React.ReactNode;
  // Y BUTTON
  onOptionsButton?: (evt: GamepadEvt) => void;
  onOptionsActionDescription?: React.ReactNode;
  // START BUTTON
  onMenuButton?: (evt: GamepadEvt) => void;
  onMenuActionDescription?: React.ReactNode;
  // A BUTTON
  onOKButton?: (evt: GamepadEvt) => void;
  onOKActionDescription?: React.ReactNode;
}

const PADDING_V = { small: 4, medium: 6, large: 8 } as const;
const PADDING_H = { small: 8, medium: 12, large: 16 } as const;

const SOLID_VARIANT_COLOR = {
  danger: ACCENT_DANGER,
  primary: ACCENT_INFO,
} as const;

// Resting-state color only — pressed's own focus/hover is the same
// plain white every other button uses (see below).
const PRESSED_COLOR = {
  normal: "#4a4f57",
  bordered: "#4a4f57",
  primary: "#2f6db8",
  danger: "#a83333",
} as const;

export const ActionButton: React.FC<ActionButtonProps> = ({
  children,
  onClick,
  size = "small",
  variant = "normal",
  pressed,
  width,
  disabled,
  preferredFocus,
  onSecondaryButton,
  onSecondaryActionDescription,
  onOptionsButton,
  onOptionsActionDescription,
  onMenuButton,
  onMenuActionDescription,
  onOKButton,
  onOKActionDescription,
}) => {
  const isPressed = pressed === true;
  const { fontSize, minHeight } = SIZE_STYLE[size];
  const style: React.CSSProperties = {
    padding: `${PADDING_V[size]}px ${PADDING_H[size]}px`,
    fontSize,
    minHeight,
    // No border, ever — a box-shadow (below) draws the visible ring
    // instead, since a border would resize the button whenever it
    // appears (no fixed width here, buttons size to their content).
  };
  const cls =
    [variant !== "normal" ? `dck-action-btn-${variant}` : null, isPressed ? `dck-action-btn-pressed-${variant}` : null]
      .filter(Boolean)
      .join(" ") || undefined;
  // Compound selector so the pressed rule reliably outranks the plain
  // variant rule regardless of style-tag mount order.
  const pressedVariantCls = variant !== "normal" ? `.dck-action-btn-${variant}` : "";

  return (
    <>
      {variant === "bordered" && (
        <style>{`
          .dck-action-btn-bordered {
            background: rgba(255, 255, 255, 0.08) !important;
            box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.18) !important;
          }
          .dck-action-btn-bordered:focus,
          .dck-action-btn-bordered:hover {
            background: #dcdedf !important;
            color: #000 !important;
            box-shadow: inset 0 0 0 1px #dcdedf !important;
          }
          .dck-action-btn-bordered:disabled,
          .dck-action-btn-bordered[disabled] {
            opacity: 1 !important;
            background: #2a2e35 !important;
            box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.15) !important;
            color: #6b7076 !important;
          }
        `}</style>
      )}
      {(variant === "danger" || variant === "primary") && (
        <style>{`
          .dck-action-btn-${variant} {
            background-color: ${SOLID_VARIANT_COLOR[variant]} !important;
            color: #fff !important;
          }
          .dck-action-btn-${variant}:focus,
          .dck-action-btn-${variant}:hover {
            background-color: #fff !important;
            color: ${SOLID_VARIANT_COLOR[variant]} !important;
          }
        `}</style>
      )}
      {isPressed && (
        <style>{`
          .dck-action-btn-pressed-${variant}${pressedVariantCls ? `, ${pressedVariantCls}.dck-action-btn-pressed-${variant}` : ""} {
            background-color: ${PRESSED_COLOR[variant]} !important;
            color: #fff !important;
          }
          .dck-action-btn-pressed-${variant}:focus,
          .dck-action-btn-pressed-${variant}:hover${pressedVariantCls ? `,
          ${pressedVariantCls}.dck-action-btn-pressed-${variant}:focus,
          ${pressedVariantCls}.dck-action-btn-pressed-${variant}:hover` : ""} {
            background-color: #fff !important;
            color: #111 !important;
          }
        `}</style>
      )}
      <DialogButton
        className={cls}
        style={{
          ...style,
          // Without this, sizing is content-box by default (the
          // browser's own native default) — padding would add on top of
          // minHeight instead of being absorbed inside it.
          boxSizing: "border-box",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: width ?? "fit-content",
          minWidth: "unset",
        }}
        onClick={onClick}
        disabled={disabled}
        preferredFocus={preferredFocus}
        onSecondaryButton={onSecondaryButton}
        onSecondaryActionDescription={onSecondaryActionDescription}
        onOptionsButton={onOptionsButton}
        onOptionsActionDescription={onOptionsActionDescription}
        onMenuButton={onMenuButton}
        onMenuActionDescription={onMenuActionDescription}
        onOKButton={onOKButton}
        onOKActionDescription={onOKActionDescription}
      >
        {children}
      </DialogButton>
    </>
  );
};
