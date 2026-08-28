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
}) => {
  const input = (
    <TextField
      mustBeNumeric={mustBeNumeric}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        fontSize: size === "small" ? 12 : 14,
        padding: size === "small" ? "6px 8px" : "10px 12px",
      }}
    />
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
