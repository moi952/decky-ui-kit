import React from "react";
import { ActionButton } from "../../src/ActionButton";
import { ControlConfig } from "../controls";
import { Section } from "./Section";
import { Playground } from "./Playground";
import { DemoPage } from "./DemoPage";

const controls: ControlConfig[] = [
  { key: "label", label: "label", type: "text" },
  { key: "size", label: "size", type: "select", options: ["small", "medium", "large"] },
  {
    key: "variant",
    label: "variant",
    type: "select",
    options: ["normal", "bordered", "danger", "primary"],
  },
  { key: "disabled", label: "disabled", type: "checkbox" },
];

const initialValues = {
  label: "Remove",
  size: "small",
  variant: "bordered",
  disabled: false,
};

const genCode = (values: Record<string, any>) => {
  const props: string[] = [];
  if (values.size !== "small") props.push(`  size="${values.size}"`);
  if (values.variant !== "normal") props.push(`  variant="${values.variant}"`);
  if (values.disabled) props.push(`  disabled`);
  props.push(`  onClick={onClick}`);
  return `<ActionButton\n${props.join("\n")}\n>\n  ${values.label}\n</ActionButton>`;
};

export const ActionButtonDemo: React.FC = () => (
  <DemoPage
    playground={
      <Playground
        controls={controls}
        initialValues={initialValues}
        genCode={genCode}
        render={(values) => (
          <ActionButton
            size={values.size}
            variant={values.variant}
            disabled={values.disabled}
            onClick={() => {}}
          >
            {values.label}
          </ActionButton>
        )}
      />
    }
  >
    <Section
      title='variant="normal" — the native DialogButton, untouched'
      description="No color/border override of any kind — whatever Steam's own chrome (and a CSSLoader theme, for radius) already gives it."
      code={`<ActionButton onClick={onClick}>\n  Cancel\n</ActionButton>`}
    >
      <ActionButton onClick={() => {}}>Cancel</ActionButton>
    </Section>

    <Section
      title='variant="bordered" — translucent gray card'
      description="A plain secondary action next to something more important."
      code={`<ActionButton variant="bordered" onClick={onClick}>\n  Configure\n</ActionButton>`}
    >
      <ActionButton variant="bordered" onClick={() => {}}>
        Configure
      </ActionButton>
    </Section>

    <Section
      title='variant="danger" — destructive action'
      code={`<ActionButton variant="danger" onClick={onClick}>\n  Delete\n</ActionButton>`}
    >
      <ActionButton variant="danger" onClick={() => {}}>
        Delete
      </ActionButton>
    </Section>

    <Section
      title='variant="primary" — non-destructive confirm'
      description="The same blue InlineConfirm's own variant=&quot;primary&quot; uses — ActionButton is what it renders underneath."
      code={`<ActionButton variant="primary" onClick={onClick}>\n  Apply\n</ActionButton>`}
    >
      <ActionButton variant="primary" onClick={() => {}}>
        Apply
      </ActionButton>
    </Section>

    <Section
      title="disabled"
      code={`<ActionButton variant="bordered" disabled onClick={onClick}>\n  Configure\n</ActionButton>`}
    >
      <ActionButton variant="bordered" disabled onClick={() => {}}>
        Configure
      </ActionButton>
    </Section>

    <Section
      title="every variant, side by side"
      code={`<ActionButton onClick={onClick}>Normal</ActionButton>\n<ActionButton variant="bordered" onClick={onClick}>Bordered</ActionButton>\n<ActionButton variant="danger" onClick={onClick}>Danger</ActionButton>\n<ActionButton variant="primary" onClick={onClick}>Primary</ActionButton>`}
    >
      <div style={{ display: "flex", gap: 8 }}>
        <ActionButton onClick={() => {}}>Normal</ActionButton>
        <ActionButton variant="bordered" onClick={() => {}}>
          Bordered
        </ActionButton>
        <ActionButton variant="danger" onClick={() => {}}>
          Danger
        </ActionButton>
        <ActionButton variant="primary" onClick={() => {}}>
          Primary
        </ActionButton>
      </div>
    </Section>
  </DemoPage>
);
