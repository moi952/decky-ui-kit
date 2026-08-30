import React, { useId } from "react";
import { DialogButton, Focusable } from "@decky/ui";
import { ActionButton } from "./ActionButton";
import { ComponentSize, SIZE_STYLE } from "./internal/theme";

export interface InlineConfirmProps {
  description: React.ReactNode;
  onCancel: () => void;
  onConfirm: () => void;
  cancelLabel?: React.ReactNode;
  confirmLabel?: React.ReactNode;
  size?: ComponentSize;
  // "danger": red confirm button, for destructive actions (the default).
  // "primary": blue confirm button, for a plain non-destructive confirm.
  // Both are just ActionButton's own same-named variants underneath.
  variant?: "danger" | "primary";
}

// Cancel (this file's own hand-styled button, its "always white" look
// has no ActionButton variant to match) and Confirm (ActionButton
// itself) need to line up at the same height regardless of size — same
// shared table ActionButton/FieldTextInput/AnchoredDropdown's own
// trigger all use, so this can never quietly drift from what Confirm
// itself actually renders at.
const PADDING_V = { small: 4, medium: 6, large: 8 } as const;
const PADDING_H = { small: 8, medium: 12, large: 16 } as const;

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
  const cancelCls = `dck-inline-cancel${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const { fontSize, minHeight } = SIZE_STYLE[size];
  const buttonStyle = {
    padding: `${PADDING_V[size]}px ${PADDING_H[size]}px`,
    fontSize,
    minHeight,
    boxSizing: "border-box" as const,
    // Reserved even though Cancel never shows a visible border — Confirm
    // (ActionButton itself, variant="danger"/"primary") reserves the
    // same 1px on its own side now, precisely so a border some variants
    // show and others don't never changes how much of the shared
    // minHeight budget either one actually needs.
    border: "1px solid transparent",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%" }}>
      <style>{`
        .${cancelCls} {
          background-color: #fff !important;
          color: #1a1a1a !important;
        }
      `}</style>
      <span style={{ fontSize: 11, color: "#aaa" }}>{description}</span>
      <Focusable style={{ display: "flex", gap: 8, width: "100%" }} flow-children="horizontal">
        <div style={{ flex: 1 }}>
          <DialogButton
            className={cancelCls}
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
          <ActionButton variant={variant} size={size} width="100%" onClick={onConfirm}>
            {confirmLabel}
          </ActionButton>
        </div>
      </Focusable>
    </div>
  );
};
