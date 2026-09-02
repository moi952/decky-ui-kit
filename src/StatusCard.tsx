import React from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { FiInfo } from "react-icons/fi";
import { DEFAULT_ROUNDNESS } from "./internal/theme";

export interface StatusCardProps {
  variant?: "success" | "error" | "info";
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
  // Not a finished-state ("done, here's what happened") like the other
  // two — for a plain announcement/notice instead (e.g. "check out my
  // other plugins"), same card look, neutral blue instead of a verdict.
  info: {
    fg: "#4b9cf7",
    bg: "rgba(75, 156, 247, 0.12)",
    border: "rgba(75, 156, 247, 0.35)",
  },
};

const DEFAULT_ICON = {
  success: <FaCheckCircle />,
  error: <FaTimesCircle />,
  info: <FiInfo />,
};

// A finished-state card — "done, here's what happened" — for after an
// update/install/check completes (or, with variant="info", a plain
// announcement/notice instead). Colors and layout match the hand-rolled
// success/error cards several Decky plugins (e.g. decky-nvidia-update)
// already converged on independently; this gives that same look as one
// reusable component instead of copy-pasted CSS. There's no first-class
// dismiss-button prop — the same `children` slot that already fits a
// "Reboot now"/"Try again" action fits a dismiss button just as well
// (render one, e.g. `ActionButton`, straight into `children`).
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
        {icon ?? DEFAULT_ICON[variant]}
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
