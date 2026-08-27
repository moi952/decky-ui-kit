import React from "react";

const groupHeadingStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "#66c0f4",
  marginBottom: 12,
};

interface DemoPageProps {
  playground: React.ReactNode;
  children: React.ReactNode;
}

// Groups every component demo page under the same two labeled zones — the
// live Playground, then the static one-prop-at-a-time examples — so the
// two are never mistaken for one continuous list. Shared here instead of
// repeated per demo file since every future component follows this layout.
export const DemoPage: React.FC<DemoPageProps> = ({ playground, children }) => (
  <>
    <div style={groupHeadingStyle}>Interactive Demo</div>
    {playground}
    <div style={{ ...groupHeadingStyle, marginTop: 8 }}>Examples</div>
    {children}
  </>
);
