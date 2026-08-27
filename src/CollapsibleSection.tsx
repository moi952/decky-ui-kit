import React from "react";
import { Field } from "@decky/ui";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";

export interface CollapsibleSectionProps {
  label: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

// Field is the generic building block Decky's own ToggleField/SliderField
// are built on — using it here gets native padding/separator for free,
// instead of approximating them with a hand-styled button.
export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  label,
  expanded,
  onToggle,
  children,
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
  </>
);
