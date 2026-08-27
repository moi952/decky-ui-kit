import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { DialogButton, Field, Focusable, GamepadButton } from "@decky/ui";
import type { GamepadEvent } from "@decky/ui";
import { FaChevronDown, FaChevronRight, FaCheck } from "react-icons/fa";

interface DropdownOption {
  value: string;
  label: string;
}

export interface AnchoredDropdownProps {
  options: DropdownOption[];
  // Multi-select uses a comma-joined string, same as Decky's own convention.
  selectedValue: string;
  onChange: (value: string) => void;
  // "row": flat, matches surrounding rows. "boxed": bordered box + arrow.
  variant?: "row" | "boxed";
  // "fill": solid white on focus. "outline": transparent-border look.
  focusStyle?: "fill" | "outline";
  size?: "default" | "small";
  bgColor?: string;
  textColor?: string;
  borderColor?: string;
  blurBackground?: boolean;
  // Toggles picks instead of replacing, and keeps the list open on pick.
  multiple?: boolean;
  // Lines the trigger's selected-values summary can wrap before clipping.
  maxDisplayLines?: number;
  maxVisibleOptions?: number;
  // Native Steam focus highlight band, themeable via CSS Loader.
  highlightOnFocus?: boolean;
  // Native Steam separator line below the trigger.
  bottomSeparator?: boolean;
}

const DEFAULT_BG = "#35373c";
const DEFAULT_TEXT = "#bfbfbf";
const DEFAULT_BORDER = "transparent";
const FALLBACK_RADIUS = "6px";
// Shared across every instance so a "row" dropdown reuses the real native
// radius a "boxed" one already measured, instead of measuring its own
// differently-shaped native element (Field vs DialogButton).
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

// Native Steam popups reset the whole plugin panel on close — this renders
// an inline overlay anchored to its own trigger instead.
export const AnchoredDropdown: React.FC<AnchoredDropdownProps> = ({
  options,
  selectedValue,
  onChange,
  variant = "boxed",
  focusStyle = "fill",
  size = "default",
  bgColor = DEFAULT_BG,
  textColor = DEFAULT_TEXT,
  borderColor = DEFAULT_BORDER,
  blurBackground = true,
  multiple = false,
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
  // text-overflow only works against a real pixel width — CSS alone (flex
  // shrink, % width) proved unreliable through Field's own layout, so this
  // measures the trigger's actual rendered width instead of guessing it.
  const [labelMaxWidth, setLabelMaxWidth] = useState<number | undefined>(
    undefined,
  );
  useLayoutEffect(() => {
    if (variant !== "boxed" || !triggerRef.current) return;
    const el = triggerRef.current;
    const horizontalPadding = size === "small" ? 10 : 14;
    const overhead = horizontalPadding * 2 + 12 + 8;
    const measure = () => setLabelMaxWidth(Math.max(0, el.clientWidth - overhead));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
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
        .join(", ") || selectedValue
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

  // Steam's focus engine picks by screen geometry — handle DIR_UP/DOWN
  // ourselves to stay inside the list.
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
    }
  };

  // Padding + font line-height + the option's own 2px top/bottom border
  // (previously missing from this estimate, clipping the last visible row).
  const rowHeight = size === "small" ? 26 : 42;
  const listMaxHeight = maxVisibleOptions
    ? maxVisibleOptions * (rowHeight + 2)
    : 220;

  const toggle = () => {
    setExpanded((prev) => {
      const next = !prev;
      if (next && wrapperRef.current) {
        const r = wrapperRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - r.bottom;
        const spaceAbove = r.top;
        setOpenUp(spaceBelow < listMaxHeight && spaceAbove > spaceBelow);
      }
      return next;
    });
  };

  const optionCls = `${uid}-option`;
  const selectedCls = `${uid}-selected`;
  const triggerCls = `${uid}-trigger`;
  const triggerLabelCls = `${uid}-trigger-label`;
  const wrapperCls = `${uid}-wrapper`;

  const optionPadding = size === "small" ? "4px 8px" : "10px 14px";
  const optionFontSize = size === "small" ? "11px" : "14px";
  const triggerPadding = size === "small" ? "6px 10px" : "10px 14px";
  const triggerFontSize = size === "small" ? "12px" : "15px";

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
          width: calc(100% - 6px) !important;
          max-width: calc(100% - 6px) !important;
          margin: 3px !important;
          display: flex !important;
          justify-content: space-between !important;
          align-items: center !important;
          gap: 8px !important;
          padding: ${triggerPadding} !important;
          font-size: ${triggerFontSize} !important;
          background: ${bgColor} !important;
          border: 1px solid ${borderColor} !important;
          color: ${textColor} !important;
        }
        .${triggerLabelCls} {
          display: -webkit-box !important;
          -webkit-box-orient: vertical !important;
          -webkit-line-clamp: ${maxDisplayLines} !important;
          overflow: hidden !important;
          text-overflow: ellipsis !important;
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
      {variant === "boxed" ? (
        <Field
          focusable
          highlightOnFocus={highlightOnFocus}
          bottomSeparator={bottomSeparator ? "standard" : "none"}
          childrenContainerWidth="max"
          onActivate={toggle}
          onClick={toggle}
        >
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
        </Field>
      ) : (
        <Field
          focusable
          highlightOnFocus={highlightOnFocus}
          bottomSeparator={bottomSeparator ? "standard" : "none"}
          onActivate={toggle}
          onClick={toggle}
          label={displayLabel}
          childrenLayout="inline"
          ref={(el: HTMLDivElement | null) => {
            triggerRef.current = el;
          }}
        >
          {expanded ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />}
        </Field>
      )}
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
        // This div owns the rounded/clipped box; Focusable inside only
        // handles scrolling and gamepad focus (it's a native Steam module,
        // its own classes can beat an inline style).
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
