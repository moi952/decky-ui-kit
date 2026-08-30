import React from "react";
import { Field, TextField } from "@decky/ui";
import { ComponentSize, DEFAULT_ROUNDNESS, SIZE_STYLE } from "./internal/theme";

export interface FieldTextInputProps {
  label?: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  size?: ComponentSize;
  mustBeNumeric?: boolean;
  bottomSeparator?: boolean;
  highlightOnFocus?: boolean;
  // "top" default, "left" row, "right" reversed row (built manually).
  labelPosition?: "top" | "left" | "right";
  // TextField itself has no native placeholder — this is a positioned
  // overlay, hidden as soon as there's any value.
  placeholder?: string;
  iconStart?: React.ReactNode;
  iconEnd?: React.ReactNode;
}

// TextField lacks bottomSeparator/highlightOnFocus/size, so this wraps it in Field.
export const FieldTextInput: React.FC<FieldTextInputProps> = ({
  label,
  value,
  onChange,
  size = "medium",
  mustBeNumeric,
  bottomSeparator = true,
  highlightOnFocus = true,
  labelPosition = "top",
  placeholder,
  iconStart,
  iconEnd,
}) => {
  const { fontSize, minHeight } = SIZE_STYLE[size];
  // Horizontal-only — vertical rhythm comes entirely from the shared
  // table's own minHeight below, not from padding, so this can never
  // drift from what ActionButton/AnchoredDropdown's own trigger resolve
  // to at "the same size". A native <input> never wraps to more than one
  // line regardless, so minHeight vs. a fixed height makes no practical
  // difference here — kept as minHeight anyway, only for consistency
  // with the other two (which do need the real floor, not a hard cap).
  const padH = { small: 8, medium: 12, large: 16 }[size];
  // Fixed regardless of size, so icon margins stay identical in both.
  const iconSlot = 30;

  const input = (
    <div style={{ position: "relative", width: "100%" }}>
      <TextField
        mustBeNumeric={mustBeNumeric}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          fontSize,
          width: "100%",
          boxSizing: "border-box",
          // No vertical padding — a native <input> already centers its
          // own text within its box regardless of extra height, so
          // minHeight alone reserves the room, guaranteeing this lines
          // up with ActionButton/AnchoredDropdown's own trigger at "the
          // same size" instead of merely resembling it.
          padding: `0 ${iconEnd ? iconSlot : padH}px 0 ${iconStart ? iconSlot : padH}px`,
          minHeight,
          borderRadius: DEFAULT_ROUNDNESS,
        }}
      />
      {!value && placeholder && (
        <span
          style={{
            position: "absolute",
            left: iconStart ? iconSlot : padH,
            top: "50%",
            transform: "translateY(-50%)",
            fontSize,
            color: "rgba(255, 255, 255, 0.4)",
            pointerEvents: "none",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: `calc(100% - ${(iconStart ? iconSlot : padH) + (iconEnd ? iconSlot : padH)}px)`,
          }}
        >
          {placeholder}
        </span>
      )}
      {iconStart && (
        <span
          style={{
            position: "absolute",
            left: (iconSlot - 16) / 2,
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
            pointerEvents: "none",
          }}
        >
          {iconStart}
        </span>
      )}
      {iconEnd && (
        <span
          style={{
            position: "absolute",
            right: (iconSlot - 16) / 2,
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
            pointerEvents: "none",
          }}
        >
          {iconEnd}
        </span>
      )}
    </div>
  );

  return (
    <Field
      label={labelPosition === "right" ? undefined : label}
      bottomSeparator={bottomSeparator ? "standard" : "none"}
      childrenLayout={labelPosition === "top" ? "below" : "inline"}
      highlightOnFocus={highlightOnFocus}
    >
      {labelPosition === "right" ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            width: "100%",
          }}
        >
          {input}
          {label}
        </div>
      ) : (
        input
      )}
    </Field>
  );
};
