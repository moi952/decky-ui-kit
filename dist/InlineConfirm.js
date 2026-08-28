import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useId } from "react";
import { DialogButton, Focusable } from "@decky/ui";
const SIZE_STYLE = {
    small: { padding: "4px 8px", fontSize: 12, minHeight: 28 },
    medium: { padding: "6px 12px", fontSize: 14, minHeight: 32 },
    large: { padding: "8px 16px", fontSize: 16, minHeight: 36 },
};
const VARIANT_COLOR = {
    danger: "#ef4444",
    primary: "#3b82f6",
};
// A confirmation shown inline, below whatever triggered it — not a modal.
// Description line + an equal-width Cancel/Confirm pair.
export const InlineConfirm = ({ description, onCancel, onConfirm, cancelLabel = "Cancel", confirmLabel = "Delete", size = "small", variant = "danger", }) => {
    const confirmCls = `dck-inline-confirm${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
    const buttonStyle = SIZE_STYLE[size];
    const color = VARIANT_COLOR[variant];
    return (_jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 8, width: "100%" }, children: [_jsx("style", { children: `
        .${confirmCls} {
          background-color: ${color} !important;
          color: #fff !important;
        }
        .${confirmCls}:focus,
        .${confirmCls}:hover {
          background-color: #fff !important;
          color: ${color} !important;
        }
      ` }), _jsx("span", { style: { fontSize: 11, color: "#aaa" }, children: description }), _jsxs(Focusable, { style: { display: "flex", gap: 8, width: "100%" }, "flow-children": "horizontal", children: [_jsx("div", { style: { flex: 1 }, children: _jsx(DialogButton, { onClick: onCancel, style: {
                                ...buttonStyle,
                                width: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                minWidth: "unset",
                            }, children: cancelLabel }) }), _jsx("div", { style: { flex: 1 }, children: _jsx(DialogButton, { className: confirmCls, onClick: onConfirm, style: {
                                ...buttonStyle,
                                width: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                minWidth: "unset",
                            }, children: confirmLabel }) })] })] }));
};
