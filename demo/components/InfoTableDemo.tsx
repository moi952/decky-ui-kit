import React from "react";
import { FiCheckCircle, FiFile, FiTag, FiUpload } from "react-icons/fi";
import { InfoTable } from "../../src/InfoTable";
import { ControlConfig } from "../controls";
import { Section } from "./Section";
import { Playground } from "./Playground";
import { DemoPage } from "./DemoPage";

const controls: ControlConfig[] = [
  { key: "version", label: "version", type: "text" },
  { key: "withUpdate", label: "with an available update", type: "checkbox" },
  {
    key: "availableVersion",
    label: "available version",
    type: "text",
    showIf: (values) => values.withUpdate,
  },
  { key: "path", label: "file path", type: "text" },
];

const initialValues = {
  version: "1.4.2",
  withUpdate: true,
  availableVersion: "1.5.0",
  path: "/home/deck/Applications/App.AppImage",
};

const genCode = (values: Record<string, any>) => {
  const rows = [`    { icon: <FiTag />, label: "Version", value: "${values.version}" }`];
  if (values.withUpdate) {
    rows.push(
      `    { icon: <FiUpload />, label: "Available", value: "${values.availableVersion}", accent: "#4caf50" }`
    );
  }
  rows.push(`    { icon: <FiFile />, label: "Path", value: "${values.path}" }`);
  return `<InfoTable\n  rows={[\n${rows.join(",\n")},\n  ]}\n/>`;
};

export const InfoTableDemo: React.FC = () => (
  <DemoPage
    playground={
      <Playground
        controls={controls}
        initialValues={initialValues}
        genCode={genCode}
        render={(values) => (
          <InfoTable
            rows={[
              { icon: <FiTag size={13} />, label: "Version", value: values.version },
              ...(values.withUpdate
                ? [
                    {
                      icon: <FiUpload size={13} />,
                      label: "Available",
                      value: values.availableVersion,
                      accent: "#4caf50",
                    },
                  ]
                : []),
              { icon: <FiFile size={13} />, label: "Path", value: values.path },
            ]}
          />
        )}
      />
    }
  >
    <Section
      title="version + source + path"
      description="A typical detail-screen table: current version, where it comes from, and its file path — no accent, all rows the same neutral color."
      code={`<InfoTable\n  rows={[\n    { icon: <FiTag />, label: "Version", value: "1.4.2" },\n    { icon: <FiCheckCircle />, label: "Source", value: "Embedded in the AppImage" },\n    { icon: <FiFile />, label: "Path", value: "/home/deck/App.AppImage" },\n  ]}\n/>`}
    >
      <InfoTable
        rows={[
          { icon: <FiTag size={13} />, label: "Version", value: "1.4.2" },
          {
            icon: <FiCheckCircle size={13} />,
            label: "Source",
            value: "Embedded in the AppImage",
          },
          { icon: <FiFile size={13} />, label: "Path", value: "/home/deck/App.AppImage" },
        ]}
      />
    </Section>

    <Section
      title="with an accented row"
      description="An available-update row in green, standing out from the plain rows around it."
      code={`<InfoTable\n  rows={[\n    { icon: <FiTag />, label: "Version", value: "1.4.2" },\n    { icon: <FiUpload />, label: "Available", value: "1.5.0", accent: "#4caf50" },\n  ]}\n/>`}
    >
      <InfoTable
        rows={[
          { icon: <FiTag size={13} />, label: "Version", value: "1.4.2" },
          {
            icon: <FiUpload size={13} />,
            label: "Available",
            value: "1.5.0",
            accent: "#4caf50",
          },
        ]}
      />
    </Section>

    <Section
      title="long value, wraps instead of clipping"
      code={`<InfoTable\n  rows={[\n    { icon: <FiFile />, label: "Path", value: "/home/deck/Applications/Some Very Long App Name Here.AppImage" },\n  ]}\n/>`}
    >
      <InfoTable
        rows={[
          {
            icon: <FiFile size={13} />,
            label: "Path",
            value: "/home/deck/Applications/Some Very Long App Name Here.AppImage",
          },
        ]}
      />
    </Section>

    <Section
      title="custom colors (e.g. a themed wrapper)"
      description="Every color is a prop — a plugin with its own accent palette doesn't have to fight this table's Steam-gray defaults."
      code={`<InfoTable\n  labelColor="#c9a8ff"\n  valueColor="#f4e9ff"\n  iconColor="#8b5cf6"\n  bgColor="rgba(139, 92, 246, 0.08)"\n  borderColor="rgba(139, 92, 246, 0.3)"\n  rows={[\n    { icon: <FiTag />, label: "Version", value: "1.4.2" },\n    { icon: <FiFile />, label: "Path", value: "/home/deck/App.AppImage" },\n  ]}\n/>`}
    >
      <InfoTable
        labelColor="#c9a8ff"
        valueColor="#f4e9ff"
        iconColor="#8b5cf6"
        bgColor="rgba(139, 92, 246, 0.08)"
        borderColor="rgba(139, 92, 246, 0.3)"
        rows={[
          { icon: <FiTag size={13} />, label: "Version", value: "1.4.2" },
          { icon: <FiFile size={13} />, label: "Path", value: "/home/deck/App.AppImage" },
        ]}
      />
    </Section>
  </DemoPage>
);
