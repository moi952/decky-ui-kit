import React, { useState } from "react";
import { CollapsibleSection } from "../../src/CollapsibleSection";
import { ControlConfig } from "../controls";
import { Section } from "./Section";
import { Playground } from "./Playground";
import { DemoPage } from "./DemoPage";

const controls: ControlConfig[] = [{ key: "label", label: "label", type: "text" }];

const initialValues = { label: "Advanced settings", expanded: true };

const RevealedContent: React.FC = () => (
  <div style={{ padding: "10px 12px", color: "#9aa1a8", fontSize: 13 }}>
    Revealed content goes here — any children.
  </div>
);

export const CollapsibleSectionDemo: React.FC = () => {
  const [expanded1, setExpanded1] = useState(true);
  const [expanded2, setExpanded2] = useState(false);

  return (
    <DemoPage
      playground={
        <Playground
          controls={controls}
          initialValues={initialValues}
          render={(values, set) => (
            <CollapsibleSection
              label={values.label}
              expanded={values.expanded}
              onToggle={() => set("expanded", !values.expanded)}
            >
              <RevealedContent />
            </CollapsibleSection>
          )}
        />
      }
    >
      <Section title="expanded (default)">
        <CollapsibleSection label="Update history" expanded={expanded1} onToggle={() => setExpanded1((v) => !v)}>
          <RevealedContent />
        </CollapsibleSection>
      </Section>

      <Section title="collapsed (default)">
        <CollapsibleSection label="Update history" expanded={expanded2} onToggle={() => setExpanded2((v) => !v)}>
          <RevealedContent />
        </CollapsibleSection>
      </Section>
    </DemoPage>
  );
};
