import React from "react";
import { QrCodeButton } from "../../src/QrCodeButton";
import { ControlConfig } from "../controls";
import { Section } from "./Section";
import { Playground } from "./Playground";
import { DemoPage } from "./DemoPage";

const controls: ControlConfig[] = [
  { key: "value", label: "value", type: "text" },
  { key: "label", label: "label", type: "text" },
  { key: "hint", label: "hint", type: "text" },
  { key: "qrSize", label: "qrSize", type: "number", min: 64 },
  // Fully independent of each other — borderOnFocus is just the border,
  // highlightOnFocus is just the background tint behind the panel. Same
  // two controls as MediaRow/ScreenshotCarousel's own demo.
  { key: "borderOnFocus", label: "borderOnFocus", type: "checkbox" },
  { key: "highlightColor", label: "highlightColor", type: "color", showIf: (v) => v.borderOnFocus },
  { key: "highlightOnFocus", label: "highlightOnFocus", type: "checkbox" },
  { key: "highlightBackground", label: "highlightBackground", type: "color", showIf: (v) => v.highlightOnFocus },
];

const initialValues = {
  value: "https://github.com/moi952/decky-proton-launch/issues",
  label: "Suggest a feature",
  hint: "Scan with your phone",
  qrSize: 160,
  borderOnFocus: true,
  highlightColor: "#2a3a4a",
  highlightOnFocus: false,
  highlightBackground: "#2a3a4a",
};

const genCode = (values: Record<string, any>) => {
  const props: string[] = [`  value="${values.value}"`, `  label="${values.label}"`];
  if (values.hint) props.push(`  hint="${values.hint}"`);
  if (values.qrSize !== 160) props.push(`  qrSize={${values.qrSize}}`);
  props.push(`  borderOnFocus={${values.borderOnFocus}}`);
  if (values.borderOnFocus) props.push(`  highlightColor="${values.highlightColor}"`);
  props.push(`  highlightOnFocus={${values.highlightOnFocus}}`);
  if (values.highlightOnFocus) props.push(`  highlightBackground="${values.highlightBackground}"`);
  return `<QrCodeButton\n${props.join("\n")}\n/>`;
};

export const QrCodeButtonDemo: React.FC = () => (
  <DemoPage
    playground={
      <Playground
        controls={controls}
        initialValues={initialValues}
        genCode={genCode}
        render={(values) => (
          <QrCodeButton
            value={values.value}
            label={values.label}
            hint={values.hint || undefined}
            qrSize={values.qrSize}
            borderOnFocus={values.borderOnFocus}
            highlightColor={values.highlightColor}
            highlightOnFocus={values.highlightOnFocus}
            highlightBackground={values.highlightBackground}
          />
        )}
      />
    }
  >
    <Section
      title="reveal on expand"
      description="A CollapsibleSection under the hood — expand to reveal the code inline. Press the code itself (gamepad or click) to open the URL directly instead of scanning it."
      code={`<QrCodeButton\n  value="https://github.com/moi952/decky-proton-launch/issues"\n  label="Suggest a feature"\n  hint="Scan with your phone"\n/>`}
    >
      <QrCodeButton
        value="https://github.com/moi952/decky-proton-launch/issues"
        label="Suggest a feature"
        hint="Scan with your phone"
      />
    </Section>
  </DemoPage>
);
