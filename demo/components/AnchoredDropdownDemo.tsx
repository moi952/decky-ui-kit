import React, { useState } from "react";
import { AnchoredDropdown } from "../../src/AnchoredDropdown";
import { OPTIONS, LONG_OPTIONS, MULTI_OPTIONS } from "../data";
import { ControlConfig } from "../controls";
import { Section } from "./Section";
import { Playground } from "./Playground";
import { DemoPage } from "./DemoPage";

const controls: ControlConfig[] = [
  { key: "variant", label: "variant", type: "select", options: ["row", "boxed"] },
  { key: "focusStyle", label: "focusStyle", type: "select", options: ["fill", "outline"] },
  { key: "size", label: "size", type: "select", options: ["default", "small"] },
  { key: "maxDisplayLines", label: "maxDisplayLines", type: "number", min: 1 },
  {
    key: "maxVisibleOptions",
    label: "maxVisibleOptions (0 = all)",
    type: "number",
    min: 0,
    placeholder: "(default)",
  },
  { key: "multiple", label: "multiple", type: "checkbox" },
  {
    key: "selectedValuesLayout",
    label: "selectedValuesLayout",
    type: "select",
    options: ["inline", "stacked"],
    showIf: (v) => v.multiple,
  },
  { key: "enableCountLabel", label: "selectedCountLabel", type: "checkbox", showIf: (v) => v.multiple },
  {
    key: "countLabelTemplate",
    label: "countLabel text ({n})",
    type: "text",
    showIf: (v) => v.multiple && v.enableCountLabel,
  },
  { key: "blurBackground", label: "blurBackground", type: "checkbox" },
  { key: "bottomSeparator", label: "bottomSeparator", type: "checkbox" },
  { key: "highlightOnFocus", label: "highlightOnFocus", type: "checkbox" },
  { key: "enableSecondaryButton", label: "onSecondaryButton (X)", type: "checkbox" },
  {
    key: "onSecondaryActionDescription",
    label: "secondary hint text",
    type: "text",
    showIf: (v) => v.enableSecondaryButton,
  },
  { key: "enableOptionsButton", label: "onOptionsButton (Y)", type: "checkbox" },
  {
    key: "onOptionsActionDescription",
    label: "options hint text",
    type: "text",
    showIf: (v) => v.enableOptionsButton,
  },
  { key: "customColors", label: "custom colors", type: "checkbox" },
  { key: "bgColor", label: "bgColor", type: "color", showIf: (v) => v.customColors },
  { key: "textColor", label: "textColor", type: "color", showIf: (v) => v.customColors },
  { key: "borderColor", label: "borderColor", type: "color", showIf: (v) => v.customColors },
];

const initialValues = {
  variant: "boxed",
  focusStyle: "fill",
  size: "default",
  multiple: false,
  selectedValuesLayout: "inline",
  enableCountLabel: true,
  countLabelTemplate: "{n} selected",
  blurBackground: true,
  bottomSeparator: true,
  highlightOnFocus: true,
  maxDisplayLines: 1,
  maxVisibleOptions: undefined,
  enableSecondaryButton: false,
  onSecondaryActionDescription: "secondary action",
  secondaryPressed: false,
  enableOptionsButton: false,
  onOptionsActionDescription: "options action",
  optionsPressed: false,
  customColors: false,
  bgColor: "#35373c",
  textColor: "#bfbfbf",
  borderColor: "#8b5cf6",
  selectedValue: "opt0",
};

export const AnchoredDropdownDemo: React.FC = () => {
  const [v1, setV1] = useState("a");
  const [v2, setV2] = useState("a");
  const [v3, setV3] = useState("a");
  const [v4, setV4] = useState("a");
  const [v5, setV5] = useState("a");
  const [v6, setV6] = useState("a,c,e");
  const [v7, setV7] = useState("opt0");
  const [v8, setV8] = useState("a");
  const [v9, setV9] = useState("a");
  const [v10, setV10] = useState("a");
  const [v11, setV11] = useState("a,c,e");
  const [v12, setV12] = useState("a");
  const [v13, setV13] = useState("a,c,e");
  const [rawMode, setRawMode] = useState(false);
  const [colorMode, setColorMode] = useState(false);

  return (
    <DemoPage
      playground={
        <Playground
          controls={controls}
          initialValues={initialValues}
          render={(values, set) => (
            <AnchoredDropdown
              variant={values.variant}
              focusStyle={values.focusStyle}
              size={values.size}
              multiple={values.multiple}
              selectedValuesLayout={values.selectedValuesLayout}
              blurBackground={values.blurBackground}
              bottomSeparator={values.bottomSeparator}
              highlightOnFocus={values.highlightOnFocus}
              maxDisplayLines={values.maxDisplayLines}
              maxVisibleOptions={values.maxVisibleOptions}
              selectedCountLabel={
                values.multiple && values.enableCountLabel
                  ? (n: number) => values.countLabelTemplate.replace("{n}", String(n))
                  : undefined
              }
              onSecondaryButton={
                values.enableSecondaryButton ? () => set("secondaryPressed", !values.secondaryPressed) : undefined
              }
              onSecondaryActionDescription={
                values.enableSecondaryButton
                  ? `${values.onSecondaryActionDescription}${values.secondaryPressed ? " (pressed)" : ""}`
                  : undefined
              }
              onOptionsButton={
                values.enableOptionsButton ? () => set("optionsPressed", !values.optionsPressed) : undefined
              }
              onOptionsActionDescription={
                values.enableOptionsButton
                  ? `${values.onOptionsActionDescription}${values.optionsPressed ? " (pressed)" : ""}`
                  : undefined
              }
              {...(values.customColors
                ? { bgColor: values.bgColor, textColor: values.textColor, borderColor: values.borderColor }
                : {})}
              options={LONG_OPTIONS}
              selectedValue={values.selectedValue}
              onChange={(v: string) => set("selectedValue", v)}
            />
          )}
        />
      }
    >
      <Section title='variant="row" (default colors)'>
        <AnchoredDropdown
          variant="row"
          options={OPTIONS}
          selectedValue={v1}
          onChange={setV1}
        />
      </Section>

      <Section title='variant="boxed" (default colors)'>
        <AnchoredDropdown options={OPTIONS} selectedValue={v2} onChange={setV2} />
      </Section>

      <Section title='focusStyle="outline"'>
        <AnchoredDropdown
          focusStyle="outline"
          options={OPTIONS}
          selectedValue={v3}
          onChange={setV3}
        />
      </Section>

      <Section title='size="small"'>
        <AnchoredDropdown
          size="small"
          options={OPTIONS}
          selectedValue={v4}
          onChange={setV4}
        />
      </Section>

      <Section title="custom colors (e.g. a themed wrapper)">
        <AnchoredDropdown
          bgColor="#2b1b4d"
          textColor="#e0d4ff"
          borderColor="#8b5cf6"
          focusStyle="outline"
          options={OPTIONS}
          selectedValue={v5}
          onChange={setV5}
        />
      </Section>

      <Section
        title="multiple + maxDisplayLines=2"
        description="How many lines the trigger's selected-values summary can wrap to before clipping."
      >
        <AnchoredDropdown
          multiple
          maxDisplayLines={2}
          options={MULTI_OPTIONS}
          selectedValue={v6}
          onChange={setV6}
        />
      </Section>

      <Section
        title="maxVisibleOptions=4 (12 options, scrolls)"
        description="How many option rows are visible in the open list before it scrolls."
      >
        <AnchoredDropdown
          size="small"
          maxVisibleOptions={4}
          options={LONG_OPTIONS}
          selectedValue={v7}
          onChange={setV7}
        />
      </Section>

      <Section title="blurBackground={false}">
        <AnchoredDropdown
          blurBackground={false}
          options={OPTIONS}
          selectedValue={v8}
          onChange={setV8}
        />
      </Section>

      <Section title="bottomSeparator={false}">
        <AnchoredDropdown
          bottomSeparator={false}
          options={OPTIONS}
          selectedValue={v9}
          onChange={setV9}
        />
      </Section>

      <Section title="highlightOnFocus={false}">
        <AnchoredDropdown
          highlightOnFocus={false}
          options={OPTIONS}
          selectedValue={v10}
          onChange={setV10}
        />
      </Section>

      <Section
        title="selectedCountLabel"
        description="Caller-formatted caption above the trigger once options are picked."
      >
        <AnchoredDropdown
          multiple
          selectedCountLabel={(n) => `${n} selected`}
          options={MULTI_OPTIONS}
          selectedValue={v11}
          onChange={setV11}
        />
      </Section>

      <Section
        title='selectedValuesLayout="stacked"'
        description="Each selected value on its own line instead of comma-joined."
      >
        <AnchoredDropdown
          multiple
          maxDisplayLines={0}
          selectedValuesLayout="stacked"
          options={MULTI_OPTIONS}
          selectedValue={v13}
          onChange={setV13}
        />
      </Section>

      <Section
        title="onSecondaryButton + onOptionsButton"
        description="Open the list — press X to toggle raw/formatted labels, Y to swap the row colors. Both show in the bottom bar."
      >
        <AnchoredDropdown
          options={
            rawMode ? OPTIONS.map((o) => ({ ...o, label: o.value })) : OPTIONS
          }
          {...(colorMode ? { bgColor: "#2b1b4d", textColor: "#e0d4ff", borderColor: "#8b5cf6" } : {})}
          selectedValue={v12}
          onChange={setV12}
          onSecondaryButton={() => setRawMode((r) => !r)}
          onSecondaryActionDescription="show raw/formatted"
          onOptionsButton={() => setColorMode((c) => !c)}
          onOptionsActionDescription="swap colors"
        />
      </Section>
    </DemoPage>
  );
};
