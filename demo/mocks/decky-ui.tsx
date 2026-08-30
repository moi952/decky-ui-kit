import React, { forwardRef } from "react";
import { createRoot } from "react-dom/client";

// Rough visual stand-ins for @decky/ui's native components, used only to
// render this demo in a plain browser (the real ones only exist inside the
// Steam client, resolved at runtime from Steam's own webpack bundle).
// Not pixel-accurate — no native corner-radius inheritance, no real
// highlightOnFocus halo. onClick maps mouse, onActivate maps Enter/Space —
// on real Steam these never both fire for the same input.

// Same numeric values as @decky/ui's own GamepadButton enum (FooterLegend.d.ts)
// — anything comparing against these (e.g. ScreenshotCarousel's own
// DIR_LEFT/BUMPER_LEFT checks) behaves identically here and in production.
export const GamepadButton = {
  INVALID: 0,
  OK: 1,
  CANCEL: 2,
  SECONDARY: 3,
  OPTIONS: 4,
  BUMPER_LEFT: 5,
  BUMPER_RIGHT: 6,
  TRIGGER_LEFT: 7,
  TRIGGER_RIGHT: 8,
  DIR_UP: 9,
  DIR_DOWN: 10,
  DIR_LEFT: 11,
  DIR_RIGHT: 12,
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
  style?: React.CSSProperties;
  disabled?: boolean;
  onClick?: (e: any) => void;
  onSecondaryButton?: () => void;
  onSecondaryActionDescription?: React.ReactNode;
}

export const DialogButton = forwardRef<HTMLButtonElement, DialogButtonProps>(
  (
    { children, className, style, disabled, onClick, onSecondaryButton, onSecondaryActionDescription },
    ref,
  ) => (
    <button
      ref={ref}
      className={className}
      onClick={onClick}
      disabled={disabled}
      onKeyDown={(e) => {
        if ((e.key === "x" || e.key === "X") && onSecondaryButton) {
          e.preventDefault();
          onSecondaryButton();
        }
      }}
      onFocus={() => {
        if (onSecondaryButton) {
          window.dispatchEvent(
            new CustomEvent(FOOTER_HINT_EVENT, {
              detail: [{ key: "X", text: onSecondaryActionDescription }],
            }),
          );
        }
      }}
      onBlur={() => {
        if (onSecondaryButton) {
          window.dispatchEvent(new CustomEvent(FOOTER_HINT_EVENT, { detail: [] }));
        }
      }}
      style={{
        // Plain <button> elements keep native OS chrome (a faint
        // bottom-weighted border/gradient in some browsers) unless
        // `appearance` itself is reset — `border: "none"` alone doesn't
        // fully suppress it. Without this, a MediaRow instance with no
        // actions row (so this button carries the accent border/
        // background directly, not a wrapping div) could show a stray
        // native edge peeking past an explicitly-set colored border.
        appearance: "none",
        WebkitAppearance: "none",
        MozAppearance: "none",
        background: "transparent",
        backgroundImage: "none",
        boxShadow: "none",
        border: "none",
        margin: 0,
        cursor: disabled ? "default" : "pointer",
        font: "inherit",
        // The real DialogButton's own native default is white text —
        // plain <button> elements don't inherit color from their parent
        // (the browser's own UA stylesheet gives them their own default,
        // typically dark), so anything relying on that native default
        // and passing no color of its own (e.g. InlineConfirm's Cancel
        // button, ConfirmDeleteModal's) needs this reset to demo right.
        color: "#fff",
        borderRadius: 4,
        outline: "none",
        opacity: disabled ? 0.5 : 1,
        ...style,
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
  // Not rendered anywhere in this mock (there's no real bottom
  // action-legend bar in a plain browser) — accepted just so components
  // passing it (e.g. ScreenshotCarousel's LB/RB hints) type-check here
  // the same way they do against the real @decky/ui.
  actionDescriptionMap?: Record<number, React.ReactNode>;
  style?: React.CSSProperties;
  "flow-children"?: string;
}

// Keyboard stand-ins for the gamepad buttons this demo needs to
// simulate: arrows for the d-pad, Q/E for the shoulder buttons (L1/R1
// have no natural keyboard equivalent), X/Y/Escape as elsewhere.
//
// Propagation is the caller's own call, not this mock's — the synthetic
// event's stopPropagation() is wired to the real DOM event's, and
// `onButtonDown` is always invoked regardless of which button it turns
// out to be, exactly like AnchoredDropdown's own real onButtonDown
// handler (which calls evt.stopPropagation() itself, per button, inside
// its own handleListButtonDown). Stopping propagation unconditionally
// here — the previous version did, for every arrow key the instant
// `onButtonDown` was set at all — silently ate ArrowDown/ArrowUp for any
// component that only cares about ArrowLeft/ArrowRight (e.g.
// ScreenshotCarousel), breaking this page's own up/down roving focus
// the moment such a component had focus.
export const Focusable = forwardRef<HTMLDivElement, FocusableProps>(({
  children,
  style,
  onCancelButton,
  onButtonDown,
  onOptionsButton,
}, ref) => (
  <div
    ref={ref}
    // Real Focusables are genuine focus-nav containers in Steam's own
    // UI — a caller can (and ScreenshotCarousel's zoom overlay does)
    // call .focus() on one directly, not just on a focusable child
    // inside it. A plain <div> ignores that without a tabIndex.
    tabIndex={-1}
    style={style}
    onKeyDown={(e) => {
      const fire = (button: number) => {
        if (!onButtonDown) return;
        e.preventDefault();
        onButtonDown({ detail: { button }, stopPropagation: () => e.stopPropagation() });
      };
      if (e.key === "ArrowDown") fire(GamepadButton.DIR_DOWN);
      else if (e.key === "ArrowUp") fire(GamepadButton.DIR_UP);
      else if (e.key === "ArrowLeft") fire(GamepadButton.DIR_LEFT);
      else if (e.key === "ArrowRight") fire(GamepadButton.DIR_RIGHT);
      else if (e.key === "q" || e.key === "Q") fire(GamepadButton.BUMPER_LEFT);
      else if (e.key === "e" || e.key === "E") fire(GamepadButton.BUMPER_RIGHT);
      else if (e.key === "Escape" && onCancelButton) {
        e.preventDefault();
        e.stopPropagation();
        onCancelButton();
      } else if ((e.key === "y" || e.key === "Y") && (onOptionsButton || onButtonDown)) {
        e.preventDefault();
        onOptionsButton?.();
        onButtonDown?.({
          detail: { button: GamepadButton.OPTIONS },
          stopPropagation: () => e.stopPropagation(),
        });
      } else if (e.key === "x" || e.key === "X") fire(GamepadButton.SECONDARY);
    }}
  >
    {children}
  </div>
));

interface ModalRootProps {
  children?: React.ReactNode;
  closeModal?: () => void;
  // The real GenericDialog takes either of these ("Either closeModal or
  // onCancel should be passed to GenericDialog", per @decky/ui's own
  // source) — this mock treats them the same way, so a caller wired to
  // either one demos correctly.
  onCancel?: () => void;
  bAllowFullSize?: boolean;
  bHideCloseIcon?: boolean;
}

// Real Steam modals cover the whole screen, not just the plugin panel —
// this mock does the same (a real fixed overlay, not scoped to whatever
// div this happens to render inside), so a component relying on that
// (e.g. ScreenshotCarousel's zoom view) demos correctly.
//
// It also auto-focuses its own first focusable descendant on mount —
// real Steam modals grab input focus the instant they open (that's what
// makes Escape and DIR_LEFT/DIR_RIGHT reach a modal's own content at
// all, here or in production); without this, keyboard events keep
// targeting whatever had focus in the page *behind* the modal, which
// looks exactly like "keyboard navigation doesn't work" for anything
// this wraps. Generic on purpose — it works the same way for any future
// modal's content, not just this one component's.
export const ModalRoot: React.FC<ModalRootProps> = ({ children, closeModal, onCancel }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const dismiss = () => (onCancel ?? closeModal)?.();

  React.useEffect(() => {
    const target = containerRef.current?.querySelector<HTMLElement>(
      "button, [tabindex], input, select, textarea, a[href]",
    );
    // Falls back to the modal's own container (tabIndex below makes
    // that a valid focus target too) when there's nothing focusable
    // inside it at all — otherwise Escape would have nowhere to bubble
    // from and would silently do nothing.
    (target ?? containerRef.current)?.focus();
  }, []);

  return (
    <div
      ref={containerRef}
      tabIndex={-1}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        background: "rgba(0, 0, 0, 0.9)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        outline: "none",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) dismiss();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") dismiss();
      }}
    >
      {children}
    </div>
  );
};

export interface ShowModalResult {
  Close: () => void;
  Update: (modal: React.ReactNode) => void;
}

// Mounts into a detached root appended to <body> — same idea as the
// real showModal, which also renders outside this plugin panel's own
// DOM subtree entirely.
export const showModal = (modal: React.ReactNode): ShowModalResult => {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);

  const close = () => {
    root.unmount();
    container.remove();
  };
  const update = (node: React.ReactNode) => root.render(node);

  update(modal);
  return { Close: close, Update: update };
};
