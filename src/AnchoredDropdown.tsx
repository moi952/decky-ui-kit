import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { DialogButton, Field, Focusable, GamepadButton } from "@decky/ui";
import type { GamepadEvent } from "@decky/ui";
import { FaChevronDown, FaChevronRight, FaCheck } from "react-icons/fa";
import { ComponentSize, DEFAULT_PANEL_BACKGROUND, SIZE_STYLE } from "./internal/theme";

interface DropdownOption {
  value: string;
  label: string;
}

export interface AnchoredDropdownProps {
  options: DropdownOption[];
  // Multi-select uses a comma-joined string, same as Decky's own convention.
  selectedValue: string;
  onChange: (value: string) => void;
  // A caller-supplied description of what this dropdown picks (e.g. "Sort
  // by") — passed straight through to the underlying native Field's own
  // `label`, the same native row-label mechanism every other Decky
  // settings field already uses, instead of a caller hand-rolling its own
  // label element above this component (which doesn't get Field's own
  // native label layout/spacing for free, and stacked outside Field can
  // end up wrapped in whatever padding the caller's own outer container
  // already applies, on top of Field's — see this same lesson already
  // learned for SearchField/FieldTextInput).
  label?: React.ReactNode;
  // "row": flat, matches surrounding rows. "boxed": bordered box + arrow.
  variant?: "row" | "boxed";
  // "fill": solid white on focus. "outline": transparent-border look.
  focusStyle?: "fill" | "outline";
  size?: ComponentSize;
  bgColor?: string;
  textColor?: string;
  borderColor?: string;
  blurBackground?: boolean;
  // Toggles picks instead of replacing, and keeps the list open on pick.
  multiple?: boolean;
  // Multi-select summary as one comma-joined line, or one value per line.
  selectedValuesLayout?: "inline" | "stacked";
  // "3 selected"-style caption above the trigger, caller-formatted.
  selectedCountLabel?: (count: number) => React.ReactNode;
  // Extra action-button slots beyond OK (opens/picks) and Cancel (closes) —
  // same names/shape as @decky/ui's own FooterLegendProps, so they drop
  // straight onto Field/Focusable like any native decky component. Each
  // fires while the trigger has focus, or while the open list has focus.
  onSecondaryButton?: () => void;
  onSecondaryActionDescription?: React.ReactNode;
  onOptionsButton?: () => void;
  onOptionsActionDescription?: React.ReactNode;
  // Lines before clipping; 0 shows the summary in full.
  maxDisplayLines?: number;
  // Rows before the list scrolls. 0 shows every option, no cap.
  maxVisibleOptions?: number;
  // Native Steam focus highlight band, themeable via CSS Loader.
  highlightOnFocus?: boolean;
  // Native Steam separator line below the trigger.
  bottomSeparator?: boolean;
}

const DEFAULT_BG = DEFAULT_PANEL_BACKGROUND;
const DEFAULT_TEXT = "#bfbfbf";
const DEFAULT_BORDER = "transparent";
const FALLBACK_RADIUS = "6px";

// The trigger's own horizontal padding/vertical rhythm — fontSize and
// minHeight (the actual height-determining values) come from the shared
// SIZE_STYLE table instead (see internal/theme.ts), the same one
// ActionButton/FieldTextInput use, so this trigger lines up with them at
// "the same size" instead of merely resembling it — but only ever grows
// from there (min-height, not height), so a long selected-value label
// wrapping to 2+ lines (see maxDisplayLines) still has room to grow into
// instead of getting clipped. The open option list below stays on its
// own separate scale (OPTION_PADDING/OPTION_FONT_SIZE) — it has no
// reason to match an external row's height.
const TRIGGER_PADDING_V = { small: 6, medium: 10, large: 14 } as const;
const TRIGGER_PADDING_H = { small: 10, medium: 14, large: 18 } as const;
const OPTION_PADDING = { small: "4px 8px", medium: "10px 14px", large: "12px 16px" } as const;
const OPTION_FONT_SIZE = { small: "11px", medium: "14px", large: "16px" } as const;
const OPTION_ROW_HEIGHT = { small: 26, medium: 42, large: 48 } as const;
// Shared across instances so "row" reuses a "boxed" one's measured radius.
let sharedBoxedRadius: string | null = null;

let uidCounter = 0;

const splitCsv = (value: string): string[] =>
  value.split(",").map((v) => v.trim()).filter(Boolean);

const toggleCsv = (
  csv: string,
  value: string,
  options: DropdownOption[],
): string => {
  const selected = splitCsv(csv);
  const next = selected.includes(value)
    ? selected.filter((v) => v !== value)
    : [...selected, value];
  return options
    .filter((o) => next.includes(o.value))
    .map((o) => o.value)
    .join(",");
};

// Native Steam popups reset the panel on close — this is an inline overlay instead.
export const AnchoredDropdown: React.FC<AnchoredDropdownProps> = ({
  options,
  selectedValue,
  onChange,
  label,
  variant = "boxed",
  focusStyle = "fill",
  size = "medium",
  bgColor = DEFAULT_BG,
  textColor = DEFAULT_TEXT,
  borderColor = DEFAULT_BORDER,
  blurBackground = true,
  multiple = false,
  selectedValuesLayout = "inline",
  selectedCountLabel,
  onSecondaryButton,
  onSecondaryActionDescription,
  onOptionsButton,
  onOptionsActionDescription,
  maxDisplayLines = 1,
  maxVisibleOptions,
  highlightOnFocus = true,
  bottomSeparator = true,
}) => {
  // Scoped per instance so sibling dropdowns don't share class names.
  const [uid] = useState(() => `dck-anchored-dd${uidCounter++}`);
  const [expanded, setExpanded] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const [openUp, setOpenUp] = useState(false);
  // Mirrors the trigger's real computed radius instead of a guessed CSS var.
  const [listRadius, setListRadius] = useState(FALLBACK_RADIUS);
  // CSS-only truncation proved unreliable through Field's layout — measure instead.
  const [labelMaxWidth, setLabelMaxWidth] = useState<number | undefined>(
    undefined,
  );
  useLayoutEffect(() => {
    if (variant !== "boxed" || !triggerRef.current) return;
    const el = triggerRef.current;
    const horizontalPadding = TRIGGER_PADDING_H[size];
    const overhead = horizontalPadding * 2 + 12 + 8;
    const measure = () => setLabelMaxWidth(Math.max(0, el.clientWidth - overhead));
    measure();
    // One more pass next frame — a remount can measure before the panel settles.
    const raf = requestAnimationFrame(measure);
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [variant, size]);
  useEffect(() => {
    if (variant === "boxed" && triggerRef.current) {
      const r = getComputedStyle(triggerRef.current).borderRadius;
      if (r) {
        sharedBoxedRadius = r;
        setListRadius(r);
      }
    } else if (sharedBoxedRadius) {
      setListRadius(sharedBoxedRadius);
    }
  }, [variant]);

  const selectedValues = multiple ? splitCsv(selectedValue) : [];
  const singleSelected = options.find((o) => o.value === selectedValue);
  const displayLabel = multiple
    ? selectedValues
        .map((v) => options.find((o) => o.value === v)?.label ?? v)
        .join(selectedValuesLayout === "stacked" ? "\n" : ", ") || selectedValue
    : singleSelected?.label ?? selectedValue;

  useEffect(() => {
    if (!expanded) return;
    const idx = options.findIndex((o) =>
      multiple ? selectedValues.includes(o.value) : o.value === selectedValue,
    );
    setFocusedIndex(idx >= 0 ? idx : 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded]);

  useEffect(() => {
    if (expanded) itemRefs.current[focusedIndex]?.focus();
  }, [focusedIndex, expanded]);

  // The list unmounts on close, dropping focus — send it back to the trigger.
  const closeList = () => {
    setExpanded(false);
    triggerRef.current?.focus();
  };

  const pick = (value: string) => {
    if (multiple) {
      onChange(toggleCsv(selectedValue, value, options));
    } else {
      onChange(value);
      closeList();
    }
  };

  // Steam's focus engine picks by geometry — handle DIR_UP/DOWN ourselves.
  const handleListButtonDown = (evt: GamepadEvent) => {
    if (evt.detail.button === GamepadButton.DIR_DOWN) {
      evt.stopPropagation();
      setFocusedIndex((i) => Math.min(i + 1, options.length - 1));
    } else if (evt.detail.button === GamepadButton.DIR_UP) {
      evt.stopPropagation();
      setFocusedIndex((i) => Math.max(i - 1, 0));
    } else if (evt.detail.button === GamepadButton.CANCEL) {
      evt.stopPropagation();
      closeList();
    } else if (evt.detail.button === GamepadButton.SECONDARY && onSecondaryButton) {
      evt.stopPropagation();
      onSecondaryButton();
    } else if (evt.detail.button === GamepadButton.OPTIONS && onOptionsButton) {
      evt.stopPropagation();
      onOptionsButton();
    }
  };

  // Padding + line-height + the option's 2px border.
  const rowHeight = OPTION_ROW_HEIGHT[size];
  // 0 means "show every option, no scroll cap".
  const listMaxHeight =
    maxVisibleOptions === 0 ? undefined : maxVisibleOptions ? maxVisibleOptions * (rowHeight + 2) : 220;

  const toggle = () => {
    setExpanded((prev) => {
      const next = !prev;
      if (next && wrapperRef.current) {
        const r = wrapperRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - r.bottom;
        const spaceAbove = r.top;
        setOpenUp(spaceBelow < (listMaxHeight ?? Infinity) && spaceAbove > spaceBelow);
      }
      return next;
    });
  };

  const optionCls = `${uid}-option`;
  const selectedCls = `${uid}-selected`;
  const triggerCls = `${uid}-trigger`;
  const triggerLabelCls = `${uid}-trigger-label`;
  const countCls = `${uid}-count`;
  const wrapperCls = `${uid}-wrapper`;

  const optionPadding = OPTION_PADDING[size];
  const optionFontSize = OPTION_FONT_SIZE[size];
  const triggerPadding = `${TRIGGER_PADDING_V[size]}px ${TRIGGER_PADDING_H[size]}px`;
  const { fontSize: triggerFontSize, minHeight: triggerMinHeight } = SIZE_STYLE[size];

  return (
    <div
      ref={wrapperRef}
      className={wrapperCls}
      style={{ position: "relative", width: "100%", maxWidth: "100%", boxSizing: "border-box" }}
    >
      <style>{`
        .${optionCls} {
          box-sizing: border-box !important;
          padding: ${optionPadding} !important;
          font-size: ${optionFontSize} !important;
          min-width: 0 !important;
          width: 100% !important;
          display: flex !important;
          justify-content: space-between !important;
          align-items: center !important;
          background: ${bgColor} !important;
          background-image: none !important;
          box-shadow: none !important;
          border: 2px solid transparent !important;
          color: ${textColor} !important;
        }
        .${triggerCls} {
          box-sizing: border-box !important;
          width: 100% !important;
          max-width: 100% !important;
          display: flex !important;
          justify-content: space-between !important;
          align-items: center !important;
          gap: 8px !important;
          padding: ${triggerPadding} !important;
          font-size: ${triggerFontSize} !important;
          min-height: ${triggerMinHeight}px !important;
          background: ${bgColor} !important;
          border: 1px solid ${borderColor} !important;
          color: ${textColor} !important;
          overflow: hidden !important;
        }
        .${countCls} {
          font-size: 11px !important;
          opacity: 0.75 !important;
          text-align: left !important;
          color: ${textColor} !important;
        }
        .${triggerLabelCls} {
          ${
            maxDisplayLines > 0
              ? `
          display: -webkit-box !important;
          -webkit-box-orient: vertical !important;
          -webkit-line-clamp: ${maxDisplayLines} !important;
          overflow: hidden !important;
          text-overflow: ellipsis !important;
          `
              : ""
          }
          ${selectedValuesLayout === "stacked" ? "white-space: pre-line !important;" : ""}
          text-align: left !important;
          flex: 1 !important;
          min-width: 0 !important;
        }
        ${
          focusStyle === "outline"
            ? `
        .${optionCls}.${selectedCls} {
          border-color: #dcdedf !important;
          color: #fff !important;
        }
        .${optionCls}:focus,
        .${optionCls}:hover {
          background: #555 !important;
          border-color: #fff !important;
          color: #fff !important;
        }
        .${wrapperCls}:focus-within .${triggerCls},
        .${triggerCls}:hover {
          background: #555 !important;
          border-color: #fff !important;
          color: #fff !important;
        }
        `
            : `
        .${optionCls}.${selectedCls} {
          color: #fff !important;
        }
        .${optionCls}:focus,
        .${optionCls}:hover {
          background: #fff !important;
          color: #111 !important;
        }
        .${wrapperCls}:focus-within .${triggerCls},
        .${triggerCls}:hover {
          background: #fff !important;
          color: #111 !important;
        }
        `
        }
      `}</style>
      {(() => {
        const countNode =
          multiple && selectedCountLabel && selectedValues.length > 0 ? (
            <div className={countCls}>{selectedCountLabel(selectedValues.length)}</div>
          ) : null;

        if (variant === "boxed") {
          return (
            <Field
              focusable
              label={label}
              // Field's own default isn't "label sits above the
              // control" — explicit here so a caller-supplied label
              // renders on top, the same convention FieldTextInput's own
              // labelPosition="top" already uses.
              childrenLayout={label ? "below" : undefined}
              highlightOnFocus={highlightOnFocus}
              bottomSeparator={bottomSeparator ? "standard" : "none"}
              childrenContainerWidth="max"
              onActivate={toggle}
              onClick={toggle}
              onSecondaryButton={onSecondaryButton}
              onSecondaryActionDescription={onSecondaryButton ? onSecondaryActionDescription : undefined}
              onOptionsButton={onOptionsButton}
              onOptionsActionDescription={onOptionsButton ? onOptionsActionDescription : undefined}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}>
                {countNode}
                <DialogButton
                  className={triggerCls}
                  ref={(el: HTMLElement | null) => {
                    triggerRef.current = el;
                  }}
                >
                  <span
                    className={triggerLabelCls}
                    style={labelMaxWidth !== undefined ? { maxWidth: labelMaxWidth } : undefined}
                  >
                    {displayLabel}
                  </span>
                  <FaChevronDown size={12} style={{ flexShrink: 0 }} />
                </DialogButton>
              </div>
            </Field>
          );
        }

        return (
          <Field
            focusable
            highlightOnFocus={highlightOnFocus}
            bottomSeparator={bottomSeparator ? "standard" : "none"}
            onActivate={toggle}
            onClick={toggle}
            onSecondaryButton={onSecondaryButton}
            onSecondaryActionDescription={onSecondaryButton ? onSecondaryActionDescription : undefined}
            onOptionsButton={onOptionsButton}
            onOptionsActionDescription={onOptionsButton ? onOptionsActionDescription : undefined}
            label={
              label || countNode ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}>
                  {label}
                  {countNode}
                  {displayLabel}
                </div>
              ) : (
                displayLabel
              )
            }
            childrenLayout="inline"
            ref={(el: HTMLDivElement | null) => {
              triggerRef.current = el;
            }}
          >
            {expanded ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />}
          </Field>
        );
      })()}
      {expanded && blurBackground && (
        <div
          onClick={closeList}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 49,
            background: "rgba(0,0,0,0.25)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
          }}
        />
      )}
      {expanded && (
        // This div clips/rounds; Focusable inside only handles scroll + gamepad focus.
        <div
          style={{
            boxSizing: "border-box",
            position: "absolute",
            ...(openUp ? { bottom: "100%" } : { top: "100%" }),
            left: 0,
            right: 0,
            zIndex: 50,
            maxHeight: listMaxHeight,
            overflow: "hidden",
            background: bgColor,
            border: `1px solid ${borderColor}`,
            borderRadius: listRadius,
            boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
            marginTop: openUp ? 0 : 2,
            marginBottom: openUp ? 2 : 0,
          }}
        >
          <Focusable
            noFocusRing
            onCancelButton={closeList}
            onButtonDown={handleListButtonDown}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              maxHeight: listMaxHeight,
              overflowY: "auto",
            }}
            flow-children="vertical"
          >
            {options.map((opt, i) => {
              const isSelected = multiple
                ? selectedValues.includes(opt.value)
                : opt.value === selectedValue;
              return (
                <DialogButton
                  key={opt.value}
                  ref={(el: HTMLElement | null) => {
                    itemRefs.current[i] = el;
                  }}
                  className={`${optionCls}${isSelected ? ` ${selectedCls}` : ""}`}
                  onClick={() => pick(opt.value)}
                >
                  <span>{opt.label}</span>
                  {isSelected && <FaCheck size={10} />}
                </DialogButton>
              );
            })}
          </Focusable>
        </div>
      )}
    </div>
  );
};
