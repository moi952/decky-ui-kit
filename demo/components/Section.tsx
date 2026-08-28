import React from "react";
import { slugify } from "../slug";
import { CodeBlock } from "./CodeBlock";

export const Section: React.FC<{
  title: string;
  description?: string;
  code?: string;
  children: React.ReactNode;
}> = ({ title, description, code, children }) => (
  <div id={slugify(title)} style={{ marginBottom: 24, scrollMarginTop: 16 }}>
    <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: description ? 3 : 8 }}>
      {title}
    </div>
    {description && (
      <div style={{ fontSize: 13, color: "#9aa1a8", marginBottom: 10 }}>
        {description}
      </div>
    )}
    {children}
    {code && (
      <div style={{ marginTop: 10 }}>
        <CodeBlock code={code} />
      </div>
    )}
  </div>
);
