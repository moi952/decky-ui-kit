import React from "react";
import { DialogButton, Field } from "@decky/ui";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import { IconType } from "react-icons";

export interface CollapsibleSectionProps {
  label: React.ReactNode;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  // A second separator after the expanded content, mirroring the one
  // Field's own bottomSeparator already draws before it — only relevant
  // while expanded (collapsed, there's no content below to separate
  // from). Off by default so existing callers don't change look.
  // "field" variant only — "group-header" never draws either separator.
  contentBottomSeparator?: boolean;
  // "field" (default): a native Field-based row — gets Steam's own
  // padding/highlight/separator for free, right for a settings-page-style
  // toggle.
  // "group-header": a flat, transparent, uppercase trigger with an
  // optional icon+count — decky-proton-launch's own game-list category
  // headers (GameGroupHeader), unchanged, for a caller building a
  // collapsible category list instead of a settings row.
  variant?: "field" | "group-header";
  // "group-header" variant only.
  icon?: IconType;
  iconColor?: string;
  count?: number;
}

const DIVIDER_COLOR = "rgba(255, 255, 255, 0.08)";

// Scoped by module load, not per-instance — this variant's focus/hover
// look never varies by caller (no color/size props), so one shared class
// for every instance is simpler than InlineConfirm/QrCodeButton's own
// per-instance useId() pattern, and it's already how the original
// GameGroupHeader this variant reproduces did it.
const GROUP_HEADER_CLASS = "dck-collapsible-group-header";
const groupHeaderStyleTag = `
  .${GROUP_HEADER_CLASS}:focus {
    outline: 2px solid #dcdedf !important;
    outline-offset: 0px !important;
    background: #2a3a4a !important;
  }
`;

// Field is the generic building block Decky's own ToggleField/SliderField
// are built on — using it here gets native padding/separator for free,
// instead of approximating them with a hand-styled button.
export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  label,
  expanded,
  onToggle,
  children,
  contentBottomSeparator = false,
  variant = "field",
  icon: Icon,
  iconColor = "#888",
  count,
}) => {
  if (variant === "group-header") {
    return (
      <>
        <style>{groupHeaderStyleTag}</style>
        <DialogButton
          className={GROUP_HEADER_CLASS}
          onClick={onToggle}
          style={{
            width: "100%",
            boxSizing: "border-box",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "6px 10px",
            marginBottom: "4px",
            background: "transparent",
            border: "none",
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {Icon && <Icon size={9} color={iconColor} />}
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "#aaa",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              {label}
            </span>
            {count !== undefined && <span style={{ fontSize: 11, color: "#666" }}>{count}</span>}
          </span>
          {expanded ? <FiChevronDown size={12} color="#888" /> : <FiChevronRight size={12} color="#888" />}
        </DialogButton>
        {expanded && children}
      </>
    );
  }

  return (
    <>
      <Field
        label={label}
        onActivate={onToggle}
        onClick={onToggle}
        focusable
        bottomSeparator="standard"
        childrenLayout="inline"
      >
        {expanded ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />}
      </Field>
      {expanded && children}
      {expanded && contentBottomSeparator && (
        <div style={{ marginTop: 8, borderBottom: `1px solid ${DIVIDER_COLOR}` }} />
      )}
    </>
  );
};
