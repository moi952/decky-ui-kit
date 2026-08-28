import React, { forwardRef } from "react";

// Rough visual stand-ins for @decky/ui's native components, used only to
// render this demo in a plain browser (the real ones only exist inside the
// Steam client, resolved at runtime from Steam's own webpack bundle).
// Not pixel-accurate — no native corner-radius inheritance, no real
// highlightOnFocus halo. onClick maps mouse, onActivate maps Enter/Space —
// on real Steam these never both fire for the same input.

export const GamepadButton = {
  DIR_UP: "DIR_UP",
  DIR_DOWN: "DIR_DOWN",
  CANCEL: "CANCEL",
  SECONDARY: "SECONDARY",
  OPTIONS: "OPTIONS",
} as const;

export interface FooterHint {
  key: "X" | "Y";
  text: React.ReactNode;
}

interface FieldProps {
  children?: React.ReactNode;
  label?: React.ReactNode;
  bottomSeparator?: "standard" | "thick" | "none";
  childrenContainerWidth?: "min" | "max" | "fixed";
  childrenLayout?: "below" | "inline";
  padding?: "none" | "standard" | "compact";
  focusable?: boolean;
  highlightOnFocus?: boolean;
  onActivate?: (e: any) => void;
  onClick?: (e: any) => void;
  onSecondaryButton?: () => void;
  onSecondaryActionDescription?: React.ReactNode;
  onOptionsButton?: () => void;
  onOptionsActionDescription?: React.ReactNode;
  className?: string;
}

// Stands in for Steam's real bottom action-legend bar — App.tsx's bottom
// bar listens for this to show whichever Field currently has focus.
export const FOOTER_HINT_EVENT = "decky-footer-options-hint";

const FIELD_PADDING = { none: "0", standard: "10px 12px", compact: "6px 8px" } as const;

export const Field = forwardRef<HTMLDivElement, FieldProps>(
  (
    {
      children,
      label,
      bottomSeparator,
      childrenLayout,
      padding = "standard",
      focusable,
      highlightOnFocus,
      onActivate,
      onClick,
      onSecondaryButton,
      onSecondaryActionDescription,
      onOptionsButton,
      onOptionsActionDescription,
      className,
    },
    ref,
  ) => {
    const stacked = childrenLayout === "below";
    const hints: FooterHint[] = [
      ...(onSecondaryButton ? [{ key: "X" as const, text: onSecondaryActionDescription }] : []),
      ...(onOptionsButton ? [{ key: "Y" as const, text: onOptionsActionDescription }] : []),
    ];
    return (
      <div
        ref={ref}
        tabIndex={focusable ? 0 : undefined}
        onClick={onClick}
        onKeyDown={(e) => {
          // Without preventDefault, the browser's own default action for this
          // same Enter/Space keydown still fires afterwards — and if it lands
          // once focus has already moved to the newly-opened list's first
          // option (a real <button>), that's a native, unrequested click that
          // immediately picks it and closes the list right back up.
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onActivate?.(e);
          } else if ((e.key === "x" || e.key === "X") && onSecondaryButton) {
            e.preventDefault();
            onSecondaryButton();
          } else if ((e.key === "y" || e.key === "Y") && onOptionsButton) {
            e.preventDefault();
            onOptionsButton();
          }
        }}
        className={className}
        style={{
          display: "flex",
          flexDirection: stacked ? "column" : "row",
          alignItems: stacked ? "stretch" : "center",
          justifyContent: stacked ? "flex-start" : "space-between",
          gap: stacked ? 6 : 12,
          width: "100%",
          boxSizing: "border-box",
          padding: FIELD_PADDING[padding],
          borderBottom:
            bottomSeparator && bottomSeparator !== "none"
              ? "1px solid rgba(255,255,255,0.08)"
              : "none",
          cursor: onClick || onActivate ? "pointer" : undefined,
          outline: "none",
          borderRadius: 4,
        }}
        onFocus={(e) => {
          if (highlightOnFocus !== false) {
            (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
          }
          window.dispatchEvent(new CustomEvent(FOOTER_HINT_EVENT, { detail: hints }));
        }}
        onBlur={(e) => {
          (e.currentTarget as HTMLElement).style.background = "transparent";
          window.dispatchEvent(new CustomEvent(FOOTER_HINT_EVENT, { detail: [] }));
        }}
      >
        {label}
        {children}
      </div>
    );
  },
);

interface DialogButtonProps {
  children?: React.ReactNode;
  className?: string;
  onClick?: (e: any) => void;
}

export const DialogButton = forwardRef<HTMLButtonElement, DialogButtonProps>(
  ({ children, className, onClick }, ref) => (
    <button
      ref={ref}
      className={className}
      onClick={onClick}
      style={{
        border: "none",
        cursor: "pointer",
        font: "inherit",
        borderRadius: 4,
        outline: "none",
      }}
    >
      {children}
    </button>
  ),
);

interface TextFieldProps {
  value?: string;
  mustBeNumeric?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  style?: React.CSSProperties;
}

export const TextField: React.FC<TextFieldProps> = ({
  value,
  mustBeNumeric,
  onChange,
  className,
  style,
}) => (
  <input
    type={mustBeNumeric ? "number" : "text"}
    value={value}
    onChange={onChange}
    className={className}
    style={{
      width: "100%",
      boxSizing: "border-box",
      background: "#2a2f36",
      color: "#e6eaed",
      border: "1px solid #3a4048",
      borderRadius: 4,
      padding: "6px 8px",
      fontSize: 13,
      outline: "none",
      ...style,
    }}
  />
);

interface FocusableProps {
  children?: React.ReactNode;
  noFocusRing?: boolean;
  onCancelButton?: () => void;
  onButtonDown?: (e: any) => void;
  onOptionsButton?: () => void;
  style?: React.CSSProperties;
  "flow-children"?: string;
}

export const Focusable: React.FC<FocusableProps> = ({
  children,
  style,
  onCancelButton,
  onButtonDown,
  onOptionsButton,
}) => (
  <div
    style={style}
    onKeyDown={(e) => {
      if (e.key === "ArrowDown" && onButtonDown) {
        e.preventDefault();
        e.stopPropagation();
        onButtonDown({ detail: { button: GamepadButton.DIR_DOWN }, stopPropagation: () => {} });
      } else if (e.key === "ArrowUp" && onButtonDown) {
        e.preventDefault();
        e.stopPropagation();
        onButtonDown({ detail: { button: GamepadButton.DIR_UP }, stopPropagation: () => {} });
      } else if (e.key === "Escape" && onCancelButton) {
        e.preventDefault();
        e.stopPropagation();
        onCancelButton();
      } else if ((e.key === "y" || e.key === "Y") && (onOptionsButton || onButtonDown)) {
        e.preventDefault();
        e.stopPropagation();
        onOptionsButton?.();
        onButtonDown?.({ detail: { button: GamepadButton.OPTIONS }, stopPropagation: () => {} });
      } else if ((e.key === "x" || e.key === "X") && onButtonDown) {
        e.preventDefault();
        e.stopPropagation();
        onButtonDown({ detail: { button: GamepadButton.SECONDARY }, stopPropagation: () => {} });
      }
    }}
  >
    {children}
  </div>
);
