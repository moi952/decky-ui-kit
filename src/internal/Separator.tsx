import React from "react";

// A continuous list's own row divider — a real, independent element, not
// a row's own `border-bottom`. A border always follows its own box's
// border-radius (curving in right at each corner it meets), so drawing
// the divider that way forced every bottomSeparator row to keep its own
// bottom corners perfectly square just to keep this line straight. A
// separate sibling element instead is flat no matter what radius the
// row itself uses.
export const DIVIDER_COLOR = "rgba(255, 255, 255, 0.08)";

export interface SeparatorProps {
  // Neutral by default (no opinion of its own) — a caller that wants a
  // gap between its own row and this line (so the line never touches the
  // row's own now-rounded corners) passes it explicitly.
  marginTop?: number;
  marginBottom?: number;
}

export const Separator: React.FC<SeparatorProps> = ({ marginTop = 0, marginBottom = 0 }) => (
  <div
    style={{
      height: 1,
      marginTop,
      marginBottom,
      background: DIVIDER_COLOR,
    }}
  />
);
