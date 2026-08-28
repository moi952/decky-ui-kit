import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Field, TextField } from "@decky/ui";
// TextField lacks bottomSeparator/highlightOnFocus/size, so this wraps it in Field.
export const FieldTextInput = ({ label, value, onChange, size = "default", mustBeNumeric, bottomSeparator = true, highlightOnFocus = true, labelPosition = "top", }) => {
    const input = (_jsx(TextField, { mustBeNumeric: mustBeNumeric, value: value, onChange: (e) => onChange(e.target.value), style: {
            fontSize: size === "small" ? 12 : 14,
            padding: size === "small" ? "6px 8px" : "10px 12px",
        } }));
    return (_jsx(Field, { label: labelPosition === "right" ? undefined : label, bottomSeparator: bottomSeparator ? "standard" : "none", childrenLayout: labelPosition === "top" ? "below" : "inline", highlightOnFocus: highlightOnFocus, children: labelPosition === "right" ? (_jsxs("div", { style: {
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                width: "100%",
            }, children: [input, label] })) : (input) }));
};
