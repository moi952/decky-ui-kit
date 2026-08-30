import React from "react";
import { DialogButton, FooterLegendProps } from "@decky/ui";
import { ACCENT_DANGER, ACCENT_INFO, ComponentSize, SIZE_STYLE } from "./internal/theme";

type GamepadEvt = Parameters<NonNullable<FooterLegendProps["onSecondaryButton"]>>[0];

export interface ActionButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  size?: ComponentSize;
  // "normal": the native DialogButton, untouched — no color/border/radius
  // override of any kind, so it keeps whatever Steam's own chrome (and a
  // CSSLoader theme, for radius) already gives it.
  // "bordered": a translucent gray card look, for a plain secondary
  // action next to something more important.
  // "danger": red, for a destructive action.
  // "primary": blue (the same ACCENT_INFO InlineConfirm's own
  // variant="primary" already uses) — a non-destructive confirm.
  variant?: "normal" | "bordered" | "danger" | "primary";
  width?: string | number;
  disabled?: boolean;

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

// Padding only — vertical rhythm (fontSize/minHeight) comes from the
// shared SIZE_STYLE table instead, the same one FieldTextInput and
// AnchoredDropdown's own trigger use, so all three actually line up
// instead of each deriving a close-but-not-guaranteed height from their
// own padding+font independently.
const PADDING_V = { small: 4, medium: 6, large: 8 } as const;
const PADDING_H = { small: 8, medium: 12, large: 16 } as const;

const SOLID_VARIANT_COLOR = {
  danger: ACCENT_DANGER,
  primary: ACCENT_INFO,
} as const;

// Never sets its own border-radius, for any variant — Steam's own native
// DialogButton chrome already gives every button a sensible radius on
// its own (a CSSLoader "round corners" theme controls it same as
// anywhere else), so there's nothing for this component to add or
// override there.
export const ActionButton: React.FC<ActionButtonProps> = ({
  children,
  onClick,
  size = "small",
  variant = "normal",
  width,
  disabled,
  onSecondaryButton,
  onSecondaryActionDescription,
  onOptionsButton,
  onOptionsActionDescription,
  onMenuButton,
  onMenuActionDescription,
  onOKButton,
  onOKActionDescription,
}) => {
  const { fontSize, minHeight } = SIZE_STYLE[size];
  const style: React.CSSProperties = {
    padding: `${PADDING_V[size]}px ${PADDING_H[size]}px`,
    fontSize,
    minHeight,
    // Reserved for every variant that gets a background override below
    // (bordered/danger/primary) — even the ones with no visible border
    // of their own (danger/primary) still occupy the same 1px of
    // box-model space "bordered" uses for its own real one, so all
    // three add up to the exact same height instead of "bordered" alone
    // needing 2px more room than the others at the same size. "normal"
    // stays fully untouched, per its own documented promise above — no
    // override at all, not even an invisible one.
    ...(variant !== "normal" ? { border: "1px solid transparent" } : {}),
  };
  const cls = variant !== "normal" ? `dck-action-btn-${variant}` : undefined;

  return (
    <>
      {variant === "bordered" && (
        <style>{`
          .dck-action-btn-bordered {
            background: rgba(255, 255, 255, 0.08) !important;
            border-color: rgba(255, 255, 255, 0.18) !important;
          }
          .dck-action-btn-bordered:focus,
          .dck-action-btn-bordered:hover {
            background: #dcdedf !important;
            color: #000 !important;
            border-color: #dcdedf !important;
          }
          .dck-action-btn-bordered:disabled,
          .dck-action-btn-bordered[disabled] {
            opacity: 1 !important;
            background: #2a2e35 !important;
            border-color: rgba(255, 255, 255, 0.15) !important;
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
