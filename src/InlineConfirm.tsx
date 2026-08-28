import React, { useId } from "react";
import { DialogButton, Focusable } from "@decky/ui";

export interface InlineConfirmProps {
  description: React.ReactNode;
  onCancel: () => void;
  onConfirm: () => void;
  cancelLabel?: React.ReactNode;
  confirmLabel?: React.ReactNode;
  size?: "small" | "medium" | "large";
  // "danger": red confirm button, for destructive actions (the default).
  // "primary": blue confirm button, for a plain non-destructive confirm.
  variant?: "danger" | "primary";
}

const SIZE_STYLE = {
  small: { padding: "4px 8px", fontSize: 12, minHeight: 28 },
  medium: { padding: "6px 12px", fontSize: 14, minHeight: 32 },
  large: { padding: "8px 16px", fontSize: 16, minHeight: 36 },
} as const;

const VARIANT_COLOR = {
  danger: "#ef4444",
  primary: "#3b82f6",
} as const;

// A confirmation shown inline, below whatever triggered it — not a modal.
// Description line + an equal-width Cancel/Confirm pair.
export const InlineConfirm: React.FC<InlineConfirmProps> = ({
  description,
  onCancel,
  onConfirm,
  cancelLabel = "Cancel",
  confirmLabel = "Delete",
  size = "small",
  variant = "danger",
}) => {
  const confirmCls = `dck-inline-confirm${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const buttonStyle = SIZE_STYLE[size];
  const color = VARIANT_COLOR[variant];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%" }}>
      <style>{`
        .${confirmCls} {
          background-color: ${color} !important;
          color: #fff !important;
        }
        .${confirmCls}:focus,
        .${confirmCls}:hover {
          background-color: #fff !important;
          color: ${color} !important;
        }
      `}</style>
      <span style={{ fontSize: 11, color: "#aaa" }}>{description}</span>
      <Focusable style={{ display: "flex", gap: 8, width: "100%" }} flow-children="horizontal">
        <div style={{ flex: 1 }}>
          <DialogButton
            onClick={onCancel}
            style={{
              ...buttonStyle,
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: "unset",
            }}
          >
            {cancelLabel}
          </DialogButton>
        </div>
        <div style={{ flex: 1 }}>
          <DialogButton
            className={confirmCls}
            onClick={onConfirm}
            style={{
              ...buttonStyle,
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: "unset",
            }}
          >
            {confirmLabel}
          </DialogButton>
        </div>
      </Focusable>
    </div>
  );
};
