import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Field, TextField } from "@decky/ui";
// TextField lacks bottomSeparator/highlightOnFocus/size, so this wraps it in Field.
export const FieldTextInput = ({ label, value, onChange, size = "default", mustBeNumeric, bottomSeparator = true, highlightOnFocus = true, labelPosition = "top", placeholder, iconStart, iconEnd, }) => {
    const padV = size === "small" ? 6 : 10;
    const padH = size === "small" ? 8 : 12;
    // Fixed regardless of size, so icon margins stay identical in both.
    const iconSlot = 30;
    const fontSize = size === "small" ? 12 : 14;
    const input = (_jsxs("div", { style: { position: "relative", width: "100%" }, children: [_jsx(TextField, { mustBeNumeric: mustBeNumeric, value: value, onChange: (e) => onChange(e.target.value), style: {
                    fontSize,
                    width: "100%",
                    boxSizing: "border-box",
                    padding: `${padV}px ${iconEnd ? iconSlot : padH}px ${padV}px ${iconStart ? iconSlot : padH}px`,
                } }), !value && placeholder && (_jsx("span", { style: {
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
                }, children: placeholder })), iconStart && (_jsx("span", { style: {
                    position: "absolute",
                    left: (iconSlot - 16) / 2,
                    top: "50%",
                    transform: "translateY(-50%)",
                    display: "flex",
                    pointerEvents: "none",
                }, children: iconStart })), iconEnd && (_jsx("span", { style: {
                    position: "absolute",
                    right: (iconSlot - 16) / 2,
                    top: "50%",
                    transform: "translateY(-50%)",
                    display: "flex",
                    pointerEvents: "none",
                }, children: iconEnd }))] }));
    return (_jsx(Field, { label: labelPosition === "right" ? undefined : label, bottomSeparator: bottomSeparator ? "standard" : "none", childrenLayout: labelPosition === "top" ? "below" : "inline", highlightOnFocus: highlightOnFocus, children: labelPosition === "right" ? (_jsxs("div", { style: {
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                width: "100%",
            }, children: [input, label] })) : (input) }));
};
