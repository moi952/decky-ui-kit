import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Field } from "@decky/ui";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
// Field is the generic building block Decky's own ToggleField/SliderField
// are built on — using it here gets native padding/separator for free,
// instead of approximating them with a hand-styled button.
export const CollapsibleSection = ({ label, expanded, onToggle, children, }) => (_jsxs(_Fragment, { children: [_jsx(Field, { label: label, onActivate: onToggle, onClick: onToggle, focusable: true, bottomSeparator: "standard", childrenLayout: "inline", children: expanded ? _jsx(FaChevronDown, { size: 12 }) : _jsx(FaChevronRight, { size: 12 }) }), expanded && children] }));
