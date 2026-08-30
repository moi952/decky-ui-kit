import React from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { DEFAULT_ROUNDNESS } from "./internal/theme";

export interface StatusCardProps {
  variant?: "success" | "error";
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

const VARIANT_COLORS = {
  success: {
    fg: "#5fdb6a",
    bg: "rgba(95, 219, 106, 0.12)",
    border: "rgba(95, 219, 106, 0.35)",
  },
  error: {
    fg: "#ff6b6b",
    bg: "rgba(255, 107, 107, 0.12)",
    border: "rgba(255, 107, 107, 0.35)",
  },
};

// A finished-state card — "done, here's what happened" — for after an
// update/install/check completes. Colors and layout match the
// hand-rolled success/error cards several Decky plugins (e.g.
// decky-nvidia-update) already converged on independently; this gives
// that same look as one reusable component instead of copy-pasted CSS.
export const StatusCard: React.FC<StatusCardProps> = ({
  variant = "success",
  title,
  description,
  icon,
  children,
}) => {
  const colors = VARIANT_COLORS[variant];
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        padding: "18px 10px 14px",
        borderRadius: DEFAULT_ROUNDNESS,
        background: colors.bg,
        border: `1px solid ${colors.border}`,
      }}
    >
      <div style={{ fontSize: 42, color: colors.fg, marginBottom: 8 }}>
        {icon ?? (variant === "success" ? <FaCheckCircle /> : <FaTimesCircle />)}
      </div>
      <div
        style={{
          fontSize: 15,
          fontWeight: 700,
          // No description: the title sits directly above `children`, so it
          // needs the same breathing room the description would otherwise
          // provide (see its own marginBottom below) — not the tighter gap
          // meant for a title/description pair.
          marginBottom: description ? 4 : children ? 14 : 0,
        }}
      >
        {title}
      </div>
      {description && (
        <div
          style={{
            fontSize: 11,
            opacity: 0.75,
            marginBottom: children ? 14 : 0,
          }}
        >
          {description}
        </div>
      )}
      {children}
    </div>
  );
};
