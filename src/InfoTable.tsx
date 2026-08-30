import React from "react";
import { DEFAULT_ROUNDNESS } from "./internal/theme";

export interface InfoTableRow {
  icon: React.ReactNode;
  label: React.ReactNode;
  value: React.ReactNode;
  // Icon + value color for this row only (e.g. green for "update
  // available"). Falls back to the table's own iconColor/valueColor.
  accent?: string;
}

export interface InfoTableProps {
  rows: InfoTableRow[];
  // Column the labels line up in — wide enough for the longest label
  // across every row, so values all start at the same x position.
  labelWidth?: number;
  labelColor?: string;
  // A row's own default icon/value color, when it has no `accent`.
  iconColor?: string;
  valueColor?: string;
  bgColor?: string;
  borderColor?: string;
}

const DEFAULT_LABEL_WIDTH = 90;
const DEFAULT_LABEL_COLOR = "#9aa1a8";
const DEFAULT_ICON_COLOR = "#6b7076";
const DEFAULT_VALUE_COLOR = "#fff";
const DEFAULT_BG = "rgba(255, 255, 255, 0.03)";
const DEFAULT_BORDER = "rgba(255, 255, 255, 0.08)";

const InfoTableRowView: React.FC<
  InfoTableRow & {
    last: boolean;
    labelWidth: number;
    labelColor: string;
    iconColor: string;
    valueColor: string;
  }
> = ({ icon, label, value, accent, last, labelWidth, labelColor, iconColor, valueColor }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "8px 10px",
      borderBottom: last ? "none" : "1px solid rgba(255, 255, 255, 0.06)",
    }}
  >
    <span style={{ color: accent ?? iconColor, flexShrink: 0, display: "flex" }}>
      {icon}
    </span>
    <span style={{ fontSize: 11, color: labelColor, flexShrink: 0, width: labelWidth }}>
      {label}
    </span>
    <span
      style={{
        fontSize: 12,
        color: accent ?? valueColor,
        marginLeft: "auto",
        textAlign: "right",
        overflowWrap: "anywhere",
        wordBreak: "break-all",
      }}
    >
      {value}
    </span>
  </div>
);

// A bordered, rounded key/value table — icon, short label, value
// right-aligned. Purely presentational: what each row means (an app's
// version, a save file's size, a save slot's date, ...) is entirely up to
// the caller. Built for a "detail" screen sitting below its header, but
// nothing here assumes any particular kind of entity. Rows with an
// `accent` (e.g. an available update in green) stand out against the rest.
export const InfoTable: React.FC<InfoTableProps> = ({
  rows,
  labelWidth = DEFAULT_LABEL_WIDTH,
  labelColor = DEFAULT_LABEL_COLOR,
  iconColor = DEFAULT_ICON_COLOR,
  valueColor = DEFAULT_VALUE_COLOR,
  bgColor = DEFAULT_BG,
  borderColor = DEFAULT_BORDER,
}) => (
  <div
    style={{
      background: bgColor,
      border: `1px solid ${borderColor}`,
      borderRadius: DEFAULT_ROUNDNESS,
      overflow: "hidden",
    }}
  >
    {rows.map((row, i) => (
      <InfoTableRowView
        key={i}
        {...row}
        last={i === rows.length - 1}
        labelWidth={labelWidth}
        labelColor={labelColor}
        iconColor={iconColor}
        valueColor={valueColor}
      />
    ))}
  </div>
);
