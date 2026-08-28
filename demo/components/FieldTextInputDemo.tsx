import React, { useState } from "react";
import { FieldTextInput } from "../../src/FieldTextInput";
import { ControlConfig } from "../controls";
import { Section } from "./Section";
import { Playground } from "./Playground";
import { DemoPage } from "./DemoPage";

const controls: ControlConfig[] = [
  { key: "label", label: "label", type: "text" },
  { key: "size", label: "size", type: "select", options: ["default", "small"] },
  { key: "labelPosition", label: "labelPosition", type: "select", options: ["top", "left", "right"] },
  { key: "mustBeNumeric", label: "mustBeNumeric", type: "checkbox" },
  { key: "bottomSeparator", label: "bottomSeparator", type: "checkbox" },
  { key: "highlightOnFocus", label: "highlightOnFocus", type: "checkbox" },
];

const initialValues = {
  label: "Frame Rate Limit",
  size: "default",
  labelPosition: "top",
  mustBeNumeric: false,
  bottomSeparator: true,
  highlightOnFocus: true,
  text: "60",
};

export const FieldTextInputDemo: React.FC = () => {
  const [v1, setV1] = useState("60");
  const [v2, setV2] = useState("");
  const [v3, setV3] = useState("60");
  const [v4, setV4] = useState("60");
  const [v5, setV5] = useState("60");
  const [v6, setV6] = useState("60");

  return (
    <DemoPage
      playground={
        <Playground
          controls={controls}
          initialValues={initialValues}
          render={(values, set) => (
            <FieldTextInput
              label={values.label}
              size={values.size}
              labelPosition={values.labelPosition}
              mustBeNumeric={values.mustBeNumeric}
              bottomSeparator={values.bottomSeparator}
              highlightOnFocus={values.highlightOnFocus}
              value={values.text}
              onChange={(v) => set("text", v)}
            />
          )}
        />
      }
    >
      <Section title="mustBeNumeric">
        <FieldTextInput label="Frame Rate Limit" mustBeNumeric value={v1} onChange={setV1} />
      </Section>

      <Section title="free text, no label">
        <FieldTextInput value={v2} onChange={setV2} />
      </Section>

      <Section title='labelPosition="left"'>
        <FieldTextInput label="Frame Rate Limit" labelPosition="left" mustBeNumeric value={v3} onChange={setV3} />
      </Section>

      <Section title='labelPosition="right"'>
        <FieldTextInput label="Frame Rate Limit" labelPosition="right" mustBeNumeric value={v6} onChange={setV6} />
      </Section>

      <Section title="highlightOnFocus={false}">
        <FieldTextInput label="Frame Rate Limit" highlightOnFocus={false} mustBeNumeric value={v4} onChange={setV4} />
      </Section>

      <Section title='size="small"'>
        <FieldTextInput label="Frame Rate Limit" size="small" mustBeNumeric value={v5} onChange={setV5} />
      </Section>
    </DemoPage>
  );
};
