import React, { useState } from "react";
import { FaSearch, FaDollarSign } from "react-icons/fa";
import { FieldTextInput } from "../../src/FieldTextInput";
import { ControlConfig } from "../controls";
import { Section } from "./Section";
import { Playground } from "./Playground";
import { DemoPage } from "./DemoPage";

const controls: ControlConfig[] = [
  { key: "label", label: "label", type: "text" },
  { key: "placeholder", label: "placeholder", type: "text" },
  { key: "size", label: "size", type: "select", options: ["default", "small"] },
  { key: "labelPosition", label: "labelPosition", type: "select", options: ["top", "left", "right"] },
  { key: "mustBeNumeric", label: "mustBeNumeric", type: "checkbox" },
  { key: "bottomSeparator", label: "bottomSeparator", type: "checkbox" },
  { key: "highlightOnFocus", label: "highlightOnFocus", type: "checkbox" },
  { key: "iconStart", label: "iconStart", type: "checkbox" },
  { key: "iconEnd", label: "iconEnd", type: "checkbox" },
];

const initialValues = {
  label: "Frame Rate Limit",
  placeholder: "",
  size: "default",
  labelPosition: "top",
  mustBeNumeric: false,
  bottomSeparator: true,
  highlightOnFocus: true,
  iconStart: false,
  iconEnd: false,
  text: "60",
};

const genCode = (values: Record<string, any>) => {
  const props: string[] = [];
  if (values.label) props.push(`  label="${values.label}"`);
  if (values.placeholder) props.push(`  placeholder="${values.placeholder}"`);
  if (values.size !== "default") props.push(`  size="${values.size}"`);
  if (values.labelPosition !== "top") props.push(`  labelPosition="${values.labelPosition}"`);
  if (values.mustBeNumeric) props.push(`  mustBeNumeric`);
  if (!values.bottomSeparator) props.push(`  bottomSeparator={false}`);
  if (!values.highlightOnFocus) props.push(`  highlightOnFocus={false}`);
  if (values.iconStart) props.push(`  iconStart={<FaDollarSign size={12} />}`);
  if (values.iconEnd) props.push(`  iconEnd={<FaSearch size={12} />}`);
  props.push(`  value={value}`, `  onChange={setValue}`);
  return `<FieldTextInput\n${props.join("\n")}\n/>`;
};

export const FieldTextInputDemo: React.FC = () => {
  const [v1, setV1] = useState("60");
  const [v2, setV2] = useState("");
  const [v3, setV3] = useState("60");
  const [v4, setV4] = useState("60");
  const [v5, setV5] = useState("60");
  const [v6, setV6] = useState("60");
  const [v7, setV7] = useState("");
  const [v8, setV8] = useState("");
  const [v9, setV9] = useState("");

  return (
    <DemoPage
      playground={
        <Playground
          controls={controls}
          initialValues={initialValues}
          genCode={genCode}
          render={(values, set) => (
            <FieldTextInput
              label={values.label}
              placeholder={values.placeholder}
              size={values.size}
              labelPosition={values.labelPosition}
              mustBeNumeric={values.mustBeNumeric}
              bottomSeparator={values.bottomSeparator}
              highlightOnFocus={values.highlightOnFocus}
              iconStart={values.iconStart ? <FaDollarSign size={12} color="#8b929a" /> : undefined}
              iconEnd={values.iconEnd ? <FaSearch size={12} color="#8b929a" /> : undefined}
              value={values.text}
              onChange={(v) => set("text", v)}
            />
          )}
        />
      }
    >
      <Section
        title="mustBeNumeric"
        code={`<FieldTextInput\n  label="Frame Rate Limit"\n  mustBeNumeric\n  value={value}\n  onChange={setValue}\n/>`}
      >
        <FieldTextInput label="Frame Rate Limit" mustBeNumeric value={v1} onChange={setV1} />
      </Section>

      <Section
        title="free text, no label"
        code={`<FieldTextInput\n  value={value}\n  onChange={setValue}\n/>`}
      >
        <FieldTextInput value={v2} onChange={setV2} />
      </Section>

      <Section
        title='labelPosition="left"'
        code={`<FieldTextInput\n  label="Frame Rate Limit"\n  labelPosition="left"\n  mustBeNumeric\n  value={value}\n  onChange={setValue}\n/>`}
      >
        <FieldTextInput label="Frame Rate Limit" labelPosition="left" mustBeNumeric value={v3} onChange={setV3} />
      </Section>

      <Section
        title='labelPosition="right"'
        code={`<FieldTextInput\n  label="Frame Rate Limit"\n  labelPosition="right"\n  mustBeNumeric\n  value={value}\n  onChange={setValue}\n/>`}
      >
        <FieldTextInput label="Frame Rate Limit" labelPosition="right" mustBeNumeric value={v6} onChange={setV6} />
      </Section>

      <Section
        title="highlightOnFocus={false}"
        code={`<FieldTextInput\n  label="Frame Rate Limit"\n  highlightOnFocus={false}\n  mustBeNumeric\n  value={value}\n  onChange={setValue}\n/>`}
      >
        <FieldTextInput label="Frame Rate Limit" highlightOnFocus={false} mustBeNumeric value={v4} onChange={setV4} />
      </Section>

      <Section
        title='size="small"'
        code={`<FieldTextInput\n  label="Frame Rate Limit"\n  size="small"\n  mustBeNumeric\n  value={value}\n  onChange={setValue}\n/>`}
      >
        <FieldTextInput label="Frame Rate Limit" size="small" mustBeNumeric value={v5} onChange={setV5} />
      </Section>

      <Section
        title="placeholder"
        code={`<FieldTextInput\n  placeholder="Search..."\n  value={value}\n  onChange={setValue}\n/>`}
      >
        <FieldTextInput placeholder="Search..." value={v7} onChange={setV7} />
      </Section>

      <Section
        title="iconStart"
        code={`<FieldTextInput\n  iconStart={<FaDollarSign size={12} color="#8b929a" />}\n  value={value}\n  onChange={setValue}\n/>`}
      >
        <FieldTextInput iconStart={<FaDollarSign size={12} color="#8b929a" />} value={v8} onChange={setV8} />
      </Section>

      <Section
        title="iconEnd + placeholder"
        code={`<FieldTextInput\n  placeholder="Search..."\n  iconEnd={<FaSearch size={12} color="#8b929a" />}\n  size="small"\n  value={value}\n  onChange={setValue}\n/>`}
      >
        <FieldTextInput
          placeholder="Search..."
          iconEnd={<FaSearch size={12} color="#8b929a" />}
          size="small"
          value={v9}
          onChange={setV9}
        />
      </Section>
    </DemoPage>
  );
};
