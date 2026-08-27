import React, { useState } from "react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { ControlConfig } from "../controls";

// Deliberately a light theme, breaking away from the dark Steam overlay
// above it — this is meta dev-tool chrome, not part of what's being
// demoed, so it needs to read as visually "outside" the mock at a glance.
const CONTROLS_BG = "#eceef0";
const CONTROLS_HEADER_BG = "#dde1e6";
const CONTROLS_TEXT = "#20242a";
const CONTROLS_LABEL = "#5f6670";

const controlLabelStyle: React.CSSProperties = {
  fontSize: 12,
  color: CONTROLS_LABEL,
  display: "block",
  marginBottom: 4,
};

const controlStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  background: "#ffffff",
  color: CONTROLS_TEXT,
  border: "1px solid #c7cbd1",
  borderRadius: 4,
  padding: "6px 8px",
  fontSize: 13,
};

const checkboxLabelStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  fontSize: 13,
  color: CONTROLS_TEXT,
};

interface PlaygroundProps {
  controls: ControlConfig[];
  initialValues: Record<string, any>;
  render: (values: Record<string, any>, set: (key: string, value: any) => void) => React.ReactNode;
}

// A Storybook-style "Controls" panel, generic over any component: pass a
// config array describing the props to expose plus a render function that
// turns the current values into a live preview. Every component's demo
// reuses this as-is — only the config and render differ.
export const Playground: React.FC<PlaygroundProps> = ({ controls, initialValues, render }) => {
  const [values, setValues] = useState(initialValues);
  const [controlsExpanded, setControlsExpanded] = useState(false);
  const set = (key: string, value: any) => setValues((v) => ({ ...v, [key]: value }));

  return (
    <div style={{ border: "1px solid #262c33", borderRadius: 6, marginBottom: 28, overflow: "hidden" }}>
      <div style={{ padding: 14 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 12 }}>
          Playground — every prop, live
        </div>
        {render(values, set)}
      </div>

      {/* Light background, deliberately not matching the dark overlay above
          — the props panel is a dev tool, not part of the mock, and needs
          to read as clearly separate rather than blending into it. */}
      <div style={{ background: CONTROLS_BG }}>
        <div
          role="button"
          tabIndex={0}
          onClick={() => setControlsExpanded((v) => !v)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setControlsExpanded((v) => !v);
            }
          }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 14px",
            background: CONTROLS_HEADER_BG,
            color: CONTROLS_TEXT,
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            outline: "none",
          }}
        >
          Props ({controls.length})
          {controlsExpanded ? <FaChevronDown size={11} /> : <FaChevronRight size={11} />}
        </div>

        {controlsExpanded && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, padding: "12px 14px 14px" }}>
            {controls
              .filter((c) => !c.showIf || c.showIf(values))
              .map((c) => {
                if (c.type === "select") {
                  return (
                    <div key={c.key}>
                      <label style={controlLabelStyle}>{c.label}</label>
                      <select style={controlStyle} value={values[c.key]} onChange={(e) => set(c.key, e.target.value)}>
                        {c.options.map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                }
                if (c.type === "checkbox") {
                  return (
                    <label key={c.key} style={checkboxLabelStyle}>
                      <input
                        type="checkbox"
                        checked={!!values[c.key]}
                        onChange={(e) => set(c.key, e.target.checked)}
                      />
                      {c.label}
                    </label>
                  );
                }
                if (c.type === "number") {
                  return (
                    <div key={c.key}>
                      <label style={controlLabelStyle}>{c.label}</label>
                      <input
                        type="number"
                        min={c.min}
                        placeholder={c.placeholder}
                        style={controlStyle}
                        value={values[c.key] ?? ""}
                        onChange={(e) => set(c.key, e.target.value === "" ? undefined : Number(e.target.value))}
                      />
                    </div>
                  );
                }
                if (c.type === "color") {
                  return (
                    <div key={c.key}>
                      <label style={controlLabelStyle}>{c.label}</label>
                      <input
                        type="color"
                        style={{ ...controlStyle, padding: 2, height: 30 }}
                        value={values[c.key]}
                        onChange={(e) => set(c.key, e.target.value)}
                      />
                    </div>
                  );
                }
                return (
                  <div key={c.key}>
                    <label style={controlLabelStyle}>{c.label}</label>
                    <input
                      type="text"
                      style={controlStyle}
                      value={values[c.key] ?? ""}
                      onChange={(e) => set(c.key, e.target.value)}
                    />
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
};
