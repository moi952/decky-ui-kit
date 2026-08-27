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
} as const;

interface FieldProps {
  children?: React.ReactNode;
  label?: React.ReactNode;
  bottomSeparator?: "standard" | "thick" | "none";
  childrenContainerWidth?: "min" | "max" | "fixed";
  childrenLayout?: "below" | "inline";
  focusable?: boolean;
  highlightOnFocus?: boolean;
  onActivate?: (e: any) => void;
  onClick?: (e: any) => void;
  className?: string;
}

export const Field = forwardRef<HTMLDivElement, FieldProps>(
  (
    {
      children,
      label,
      bottomSeparator,
      focusable,
      highlightOnFocus,
      onActivate,
      onClick,
      className,
    },
    ref,
  ) => (
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
        }
      }}
      className={className}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        boxSizing: "border-box",
        padding: "10px 12px",
        borderBottom:
          bottomSeparator && bottomSeparator !== "none"
            ? "1px solid rgba(255,255,255,0.08)"
            : "none",
        cursor: onClick || onActivate ? "pointer" : undefined,
        outline: "none",
        borderRadius: 4,
      }}
      onFocus={(e) => {
        if (highlightOnFocus === false) return;
        (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
      }}
      onBlur={(e) => {
        (e.currentTarget as HTMLElement).style.background = "transparent";
      }}
    >
      {label}
      {children}
    </div>
  ),
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

interface FocusableProps {
  children?: React.ReactNode;
  noFocusRing?: boolean;
  onCancelButton?: () => void;
  onButtonDown?: (e: any) => void;
  style?: React.CSSProperties;
  "flow-children"?: string;
}

export const Focusable: React.FC<FocusableProps> = ({
  children,
  style,
  onCancelButton,
  onButtonDown,
}) => (
  <div
    style={style}
    onKeyDown={(e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        e.stopPropagation();
        onButtonDown?.({
          detail: { button: GamepadButton.DIR_DOWN },
          stopPropagation: () => {},
        });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        e.stopPropagation();
        onButtonDown?.({
          detail: { button: GamepadButton.DIR_UP },
          stopPropagation: () => {},
        });
      } else if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        onCancelButton?.();
      }
    }}
  >
    {children}
  </div>
);
