import React, { useState } from "react";
import { FiGlobe, FiLayers, FiList, FiPlay, FiSettings } from "react-icons/fi";
import { TabBar, TabBarItem } from "../../src/TabBar";
import { ControlConfig } from "../controls";
import { Section } from "./Section";
import { Playground } from "./Playground";
import { DemoPage } from "./DemoPage";

const ALL_ITEMS: TabBarItem[] = [
  { id: "list", icon: <FiList size={18} />, label: "List" },
  { id: "play", icon: <FiPlay size={18} />, label: "Games" },
  { id: "global", icon: <FiGlobe size={18} />, label: "Global" },
  { id: "groups", icon: <FiLayers size={18} />, label: "Groups" },
  { id: "settings", icon: <FiSettings size={18} />, label: "Settings" },
];

// Stateful wrapper — TabBar is controlled, so the demo owns the active tab.
// In the demo Q / E stand in for L1 / R1.
const TabBarPreview: React.FC<
  Omit<React.ComponentProps<typeof TabBar>, "items" | "activeId" | "onSelect"> & {
    count: number;
  }
> = ({ count, ...props }) => {
  const items = ALL_ITEMS.slice(0, count);
  const [activeId, setActiveId] = useState(items[0].id);
  const current = items.find((item) => item.id === activeId) ?? items[0];
  return (
    <TabBar items={items} activeId={current.id} onSelect={setActiveId} {...props}>
      <div style={{ padding: "12px 16px", fontSize: 13, color: "#9aa1a8" }}>
        Page: {current.label}
      </div>
    </TabBar>
  );
};

// One control per real prop — `count` is the one exception (how many tabs
// to demo with isn't itself a prop, `items` is an array).
const controls: ControlConfig[] = [
  { key: "count", label: "tab count", type: "select", options: ["2", "3", "5"] },
  { key: "activeColor", label: "activeColor", type: "color" },
  { key: "inactiveColor", label: "inactiveColor", type: "color" },
  { key: "showHints", label: "showHints", type: "checkbox" },
  {
    key: "controller",
    label: "controller",
    type: "select",
    options: ["auto", "xbox", "playstation", "switch", "steam"],
    showIf: (v) => v.showHints,
  },
  { key: "previousHint", label: "previousHint (override)", type: "text", showIf: (v) => v.showHints },
  { key: "nextHint", label: "nextHint (override)", type: "text", showIf: (v) => v.showHints },
  { key: "hintBackground", label: "hintBackground", type: "color", showIf: (v) => v.showHints },
  { key: "hintColor", label: "hintColor", type: "color", showIf: (v) => v.showHints },
  { key: "restoreFocus", label: "restoreFocus", type: "checkbox" },
];

const initialValues = {
  count: "5",
  activeColor: "#d0d5dc",
  inactiveColor: "#4b515b",
  showHints: true,
  controller: "xbox",
  previousHint: "",
  nextHint: "",
  hintBackground: "#ffffff",
  hintColor: "#14181d",
  restoreFocus: true,
};

const genCode = (values: Record<string, any>) => {
  const lines = [
    `<TabBar`,
    `  items={[${ALL_ITEMS.slice(0, Number(values.count))
      .map((item) => `{ id: "${item.id}", icon: <Icon />, label: "${item.label}" }`)
      .join(", ")}]}`,
    `  activeId={tab}`,
    `  onSelect={setTab}`,
    `  activeColor="${values.activeColor}"`,
    `  inactiveColor="${values.inactiveColor}"`,
    `  showHints={${values.showHints}}`,
  ];
  if (values.showHints) {
    if (values.controller !== "auto") lines.push(`  controller="${values.controller}"`);
    if (values.previousHint) lines.push(`  previousHint="${values.previousHint}"`);
    if (values.nextHint) lines.push(`  nextHint="${values.nextHint}"`);
    lines.push(`  hintBackground="${values.hintBackground}"`);
    lines.push(`  hintColor="${values.hintColor}"`);
  }
  lines.push(`  restoreFocus={${values.restoreFocus}}`);
  lines.push(`>`, `  {page}`, `</TabBar>`);
  return lines.join("\n");
};

export const TabBarDemo: React.FC = () => (
  <DemoPage
    playground={
      <Playground
        controls={controls}
        initialValues={initialValues}
        genCode={genCode}
        render={(values) => (
          <TabBarPreview
            count={Number(values.count)}
            activeColor={values.activeColor}
            inactiveColor={values.inactiveColor}
            showHints={values.showHints}
            controller={values.controller}
            previousHint={values.previousHint || undefined}
            nextHint={values.nextHint || undefined}
            hintBackground={values.hintBackground}
            hintColor={values.hintColor}
            restoreFocus={values.restoreFocus}
          />
        )}
      />
    }
  >
    <Section
      title="three pages"
      description="Icons are click/touch only — the gamepad never lands on them; the bumpers (Q / E on the keyboard here) switch page from anywhere inside the page, stopping at both ends. The pill names follow the pad in use on a real Steam UI; here they stay on the default, use the playground to preview each pad."
      code={`<TabBar items={tabs} activeId={tab} onSelect={setTab}>\n  {page}\n</TabBar>`}
    >
      <TabBarPreview count={3} />
    </Section>

    <Section
      title="without hints"
      description="showHints={false} hides the bumper pills; the bumpers still work."
      code={`<TabBar items={tabs} activeId={tab} onSelect={setTab} showHints={false}>\n  {page}\n</TabBar>`}
    >
      <TabBarPreview count={3} showHints={false} />
    </Section>

    <Section
      title="custom colors and hints"
      code={`<TabBar\n  items={tabs}\n  activeId={tab}\n  onSelect={setTab}\n  activeColor="#66c0f4"\n  inactiveColor="#3d4450"\n  previousHint="LB"\n  nextHint="RB"\n  hintBackground="#66c0f4"\n>\n  {page}\n</TabBar>`}
    >
      <TabBarPreview
        count={3}
        activeColor="#66c0f4"
        inactiveColor="#3d4450"
        previousHint="LB"
        nextHint="RB"
        hintBackground="#66c0f4"
      />
    </Section>
  </DemoPage>
);
