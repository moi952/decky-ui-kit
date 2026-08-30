import React from "react";
import { Field } from "@decky/ui";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";

export interface CollapsibleSectionProps {
  label: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  // A second separator after the expanded content, mirroring the one
  // Field's own bottomSeparator already draws before it — only relevant
  // while expanded (collapsed, there's no content below to separate
  // from). Off by default so existing callers don't change look.
  contentBottomSeparator?: boolean;
}

const DIVIDER_COLOR = "rgba(255, 255, 255, 0.08)";

// Field is the generic building block Decky's own ToggleField/SliderField
// are built on — using it here gets native padding/separator for free,
// instead of approximating them with a hand-styled button.
export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  label,
  expanded,
  onToggle,
  children,
  contentBottomSeparator = false,
}) => (
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
