import React from "react";
import { Field, TextField } from "@decky/ui";

export interface FieldTextInputProps {
  label?: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  size?: "default" | "small";
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
  size = "default",
  mustBeNumeric,
  bottomSeparator = true,
  highlightOnFocus = true,
  labelPosition = "top",
  placeholder,
  iconStart,
  iconEnd,
}) => {
  const padV = size === "small" ? 6 : 10;
  const padH = size === "small" ? 8 : 12;
  // Fixed regardless of size, so icon margins stay identical in both.
  const iconSlot = 30;
  const fontSize = size === "small" ? 12 : 14;

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
          padding: `${padV}px ${iconEnd ? iconSlot : padH}px ${padV}px ${iconStart ? iconSlot : padH}px`,
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
