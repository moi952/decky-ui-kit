import React from "react";
import { ScreenshotCarousel } from "../../src/ScreenshotCarousel";
import { ControlConfig } from "../controls";
import { Section } from "./Section";
import { Playground } from "./Playground";
import { DemoPage } from "./DemoPage";

// Solid-color placeholders standing in for real screenshots — this
// component only sizes/navigates whatever URLs it's given, it never
// assumes anything about the images themselves.
const placeholder = (color: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180"><rect width="320" height="180" fill="${color}"/></svg>`,
  )}`;

const ALL_SCREENSHOTS = [
  placeholder("#2b6cb0"),
  placeholder("#38a169"),
  placeholder("#d69e2e"),
  placeholder("#9f2b68"),
];

// One control per real prop — `count` is the one unavoidable exception
// (how many screenshots to demo with isn't itself a prop, `screenshots`
// is an array of URLs, not something a single control could drive).
const controls: ControlConfig[] = [
  { key: "count", label: "screenshot count", type: "select", options: ["1", "2", "4"] },
  { key: "height", label: "height", type: "number", min: 40 },
  { key: "bottomSeparator", label: "bottomSeparator", type: "checkbox" },
  // Fully independent of each other — borderOnFocus is just the border,
  // highlightOnFocus is just the background tint behind the stage.
  { key: "borderOnFocus", label: "borderOnFocus", type: "checkbox" },
  { key: "highlightColor", label: "highlightColor", type: "color", showIf: (v) => v.borderOnFocus },
  { key: "highlightOnFocus", label: "highlightOnFocus", type: "checkbox" },
  { key: "highlightBackground", label: "highlightBackground", type: "color", showIf: (v) => v.highlightOnFocus },
];

const initialValues = {
  count: "4",
  height: 140,
  bottomSeparator: false,
  highlightOnFocus: true,
  borderOnFocus: true,
  highlightColor: "#dcdedf",
  highlightBackground: "#2a3a4a",
};

const genCode = (values: Record<string, any>) => {
  const n = Number(values.count);
  const lines = [
    `<ScreenshotCarousel`,
    `  screenshots={[${Array.from({ length: n }, (_, i) => `"screenshot${i + 1}.png"`).join(", ")}]}`,
    `  height={${values.height}}`,
  ];
  if (values.bottomSeparator) lines.push(`  bottomSeparator`);
  lines.push(`  borderOnFocus={${values.borderOnFocus}}`);
  if (values.borderOnFocus) lines.push(`  highlightColor="${values.highlightColor}"`);
  lines.push(`  highlightOnFocus={${values.highlightOnFocus}}`);
  if (values.highlightOnFocus) lines.push(`  highlightBackground="${values.highlightBackground}"`);
  lines.push(`/>`);
  return lines.join("\n");
};

export const ScreenshotCarouselDemo: React.FC = () => (
  <DemoPage
    playground={
      <Playground
        controls={controls}
        initialValues={initialValues}
        genCode={genCode}
        render={(values) => (
          <ScreenshotCarousel
            screenshots={ALL_SCREENSHOTS.slice(0, Number(values.count))}
            height={values.height}
            bottomSeparator={values.bottomSeparator}
            highlightOnFocus={values.highlightOnFocus}
            borderOnFocus={values.borderOnFocus}
            highlightColor={values.highlightColor}
            highlightBackground={values.highlightBackground}
          />
        )}
      />
    }
  >
    <Section
      title="several screenshots"
      description="One shown at a time — DIR_LEFT/DIR_RIGHT or LB/RB (advertised in Steam's own bottom action-legend bar) move between them, a dot row below tracks position. No on-screen prev/next buttons on this inline view — those only live in the full-screen zoom. Pressing the photo itself opens that zoom, a real Steam modal; the on-screen arrows (and DIR_LEFT/DIR_RIGHT/LB/RB) navigate there too."
      code={`<ScreenshotCarousel screenshots={[url1, url2, url3, url4]} height={140} />`}
    >
      <ScreenshotCarousel screenshots={ALL_SCREENSHOTS} height={140} />
    </Section>

    <Section
      title="a single screenshot"
      description="No dot row at all — nothing to navigate between. Still opens the full-screen zoom on press."
      code={`<ScreenshotCarousel screenshots={[url1]} height={140} />`}
    >
      <ScreenshotCarousel screenshots={[ALL_SCREENSHOTS[0]]} height={140} />
    </Section>

    <Section
      title="no screenshots"
      description="Renders nothing at all — a caller never needs its own `screenshots.length > 0 &&` guard around this component."
      code={`<ScreenshotCarousel screenshots={[]} height={140} />`}
    >
      <ScreenshotCarousel screenshots={[]} height={140} />
    </Section>
  </DemoPage>
);
