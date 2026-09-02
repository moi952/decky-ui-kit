import React, { useState } from "react";
import { CollapsibleSection } from "../../src/CollapsibleSection";
import { ControlConfig } from "../controls";
import { Section } from "./Section";
import { Playground } from "./Playground";
import { DemoPage } from "./DemoPage";
import { FaCog } from "react-icons/fa";
import { FiGlobe, FiLink } from "react-icons/fi";
import { IconType } from "react-icons";

// "group-header"'s icon prop takes a component, not a string — the
// Playground control itself only ever hands back a string (the select's
// value), so this maps that string to the real icon component right
// before rendering.
const ICONS: Record<string, IconType> = { FaCog, FiGlobe, FiLink };

const controls: ControlConfig[] = [
  { key: "label", label: "label", type: "text" },
  { key: "variant", label: "variant", type: "select", options: ["field", "group-header"] },
  {
    key: "contentBottomSeparator",
    label: "contentBottomSeparator",
    type: "checkbox",
    showIf: (v) => v.variant === "field",
  },
  { key: "icon", label: "icon", type: "select", options: ["(none)", ...Object.keys(ICONS)], showIf: (v) => v.variant === "group-header" },
  { key: "iconColor", label: "iconColor", type: "color", showIf: (v) => v.variant === "group-header" && v.icon !== "(none)" },
  { key: "count", label: "count", type: "number", min: 0, showIf: (v) => v.variant === "group-header" },
];

const initialValues = {
  label: "Advanced settings",
  expanded: true,
  variant: "field",
  contentBottomSeparator: false,
  icon: "FaCog",
  iconColor: "#888888",
  count: 7,
};

const RevealedContent: React.FC = () => (
  <div style={{ padding: "10px 12px", color: "#9aa1a8", fontSize: 13 }}>
    Revealed content goes here — any children.
  </div>
);

const genCode = (values: Record<string, any>) => {
  const props: string[] = [`  label="${values.label}"`, `  expanded={expanded}`, `  onToggle={() => setExpanded(!expanded)}`];
  if (values.variant === "group-header") {
    props.push(`  variant="group-header"`);
    if (values.icon !== "(none)") {
      props.push(`  icon={${values.icon}}`);
      props.push(`  iconColor="${values.iconColor}"`);
    }
    props.push(`  count={${values.count}}`);
  } else if (values.contentBottomSeparator) {
    props.push(`  contentBottomSeparator`);
  }
  return `<CollapsibleSection\n${props.join("\n")}\n>\n  <MyContent />\n</CollapsibleSection>`;
};

export const CollapsibleSectionDemo: React.FC = () => {
  const [expanded1, setExpanded1] = useState(true);
  const [expanded2, setExpanded2] = useState(false);

  return (
    <DemoPage
      playground={
        <Playground
          controls={controls}
          initialValues={initialValues}
          genCode={genCode}
          render={(values, set) => (
            <CollapsibleSection
              label={values.label}
              expanded={values.expanded}
              onToggle={() => set("expanded", !values.expanded)}
              variant={values.variant}
              contentBottomSeparator={values.variant === "field" ? values.contentBottomSeparator : undefined}
              icon={values.variant === "group-header" && values.icon !== "(none)" ? ICONS[values.icon] : undefined}
              iconColor={values.variant === "group-header" ? values.iconColor : undefined}
              count={values.variant === "group-header" ? values.count : undefined}
            >
              <RevealedContent />
            </CollapsibleSection>
          )}
        />
      }
    >
      <Section
        title="expanded (default)"
        code={`<CollapsibleSection\n  label="Update history"\n  expanded={expanded}\n  onToggle={() => setExpanded(!expanded)}\n>\n  <MyContent />\n</CollapsibleSection>`}
      >
        <CollapsibleSection label="Update history" expanded={expanded1} onToggle={() => setExpanded1((v) => !v)}>
          <RevealedContent />
        </CollapsibleSection>
      </Section>

      <Section
        title="collapsed (default)"
        code={`<CollapsibleSection\n  label="Update history"\n  expanded={expanded}\n  onToggle={() => setExpanded(!expanded)}\n>\n  <MyContent />\n</CollapsibleSection>`}
      >
        <CollapsibleSection label="Update history" expanded={expanded2} onToggle={() => setExpanded2((v) => !v)}>
          <RevealedContent />
        </CollapsibleSection>
      </Section>
    </DemoPage>
  );
};
