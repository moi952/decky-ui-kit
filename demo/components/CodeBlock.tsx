import React, { useState } from "react";

export const CodeBlock: React.FC<{ code: string }> = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const onCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div style={{ position: "relative" }}>
      <pre
        style={{
          margin: 0,
          padding: "10px 12px",
          background: "#181a1f",
          border: "1px solid #2a2d33",
          borderRadius: 6,
          overflowX: "auto",
          fontSize: 12,
          lineHeight: 1.5,
          color: "#c9d1d9",
          fontFamily: "SFMono-Regular, Consolas, Menlo, monospace",
        }}
      >
        <code>{code}</code>
      </pre>
      <button
        onClick={onCopy}
        style={{
          position: "absolute",
          top: 6,
          right: 6,
          padding: "3px 8px",
          fontSize: 11,
          color: copied ? "#7ee787" : "#9aa1a8",
          background: "#22252b",
          border: "1px solid #2a2d33",
          borderRadius: 4,
          cursor: "pointer",
        }}
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
};
