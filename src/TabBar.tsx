import React, { useEffect, useRef } from "react";
import { Focusable, GamepadButton } from "@decky/ui";
import type { GamepadEvent } from "@decky/ui";
import { BUMPER_LABELS, ControllerKind, useControllerKind } from "./internal/controllerKind";

export interface TabBarItem {
  id: string;
  icon: React.ReactNode;
  // Accessible name of the icon (hover tooltip / screen readers).
  label: string;
}

export interface TabBarProps {
  items: TabBarItem[];
  activeId: string;
  onSelect: (id: string) => void;
  // The page shown under the bar. Rendered inside the same gamepad scope as
  // the bar, so L1 / R1 switch pages from anywhere in it — not only while
  // the bar itself has focus.
  children?: React.ReactNode;
  activeColor?: string;
  inactiveColor?: string;
  showHints?: boolean;
  // Which pad's bumper names the pills show: "auto" follows the pad in use
  // (LB/RB on Xbox, L1/R1 on PlayStation and Steam, L/R on Switch).
  controller?: "auto" | ControllerKind;
  // Override the pill texts (otherwise picked from `controller`).
  previousHint?: string;
  nextHint?: string;
  hintBackground?: string;
  hintColor?: string;
  // After a page switch (the focused element unmounts) or on mount, put
  // focus back on the first control of `children` — without focus inside
  // the page, the next L1 / R1 goes to Steam instead of the bar.
  restoreFocus?: boolean;
}

const RESTORE_INTERVAL_MS = 100;
const RESTORE_MAX_TRIES = 15;

const Hint: React.FC<{
  label: string;
  radius: string;
  background: string;
  color: string;
}> = ({ label, radius, background, color }) => (
  <span
    style={{
      background,
      color,
      fontSize: 11,
      fontWeight: 800,
      lineHeight: 1,
      padding: "8px 11px 6px",
      borderRadius: radius,
      flexShrink: 0,
    }}
  >
    {label}
  </span>
);

// Icon tabs flanked by bumper hints (L1 / R1, LB / RB or L / R depending on
// the pad in use). The icons are pointer/touch only —
// the gamepad never lands on them, it switches page with the bumpers
// (stopping at both ends). Controlled: the parent owns `activeId`.
export const TabBar: React.FC<TabBarProps> = ({
  items,
  activeId,
  onSelect,
  children,
  activeColor = "#d0d5dc",
  inactiveColor = "#4b515b",
  showHints = true,
  controller = "auto",
  previousHint,
  nextHint,
  hintBackground = "#ffffff",
  hintColor = "#14181d",
  restoreFocus = true,
}) => {
  const detected = useControllerKind(controller === "auto");
  const labels = BUMPER_LABELS[controller === "auto" ? detected : controller];
  const rootRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleButtonDown = (evt: GamepadEvent) => {
    const index = items.findIndex((item) => item.id === activeId);
    let delta = 0;
    if (evt.detail.button === GamepadButton.BUMPER_LEFT) delta = -1;
    else if (evt.detail.button === GamepadButton.BUMPER_RIGHT) delta = 1;
    const next = delta ? items[index + delta] : undefined;
    if (next) onSelect(next.id);
  };

  useEffect(() => {
    if (!restoreFocus) return;
    let tries = 0;
    const timer = setInterval(() => {
      const root = rootRef.current;
      tries += 1;
      if (
        !root ||
        tries > RESTORE_MAX_TRIES ||
        root.contains(root.ownerDocument.activeElement)
      ) {
        clearInterval(timer);
        return;
      }
      const target = [
        ...(contentRef.current?.querySelectorAll<HTMLElement>(".Focusable") ??
          []),
      ].find((el) => !el.querySelector(".Focusable"));
      if (target) {
        target.focus();
        clearInterval(timer);
      }
    }, RESTORE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [activeId, restoreFocus]);

  return (
    <Focusable onButtonDown={handleButtonDown}>
      <div ref={rootRef}>
        <div style={{ display: "flex", alignItems: "center", padding: "6px 16px" }}>
          {showHints && (
            <Hint
              label={previousHint ?? labels.left}
              radius="12px 4px 4px 4px"
              background={hintBackground}
              color={hintColor}
            />
          )}
          <div
            style={{ flex: 1, display: "flex", justifyContent: "center", gap: 10 }}
          >
            {items.map((item) => (
              <div
                key={item.id}
                role="button"
                tabIndex={-1}
                title={item.label}
                aria-label={item.label}
                aria-current={item.id === activeId}
                onClick={() => onSelect(item.id)}
                onKeyDown={(evt) => {
                  if (evt.key === "Enter") onSelect(item.id);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "6px 8px",
                  cursor: "pointer",
                  color: item.id === activeId ? activeColor : inactiveColor,
                }}
              >
                {item.icon}
              </div>
            ))}
          </div>
          {showHints && (
            <Hint
              label={nextHint ?? labels.right}
              radius="4px 12px 4px 4px"
              background={hintBackground}
              color={hintColor}
            />
          )}
        </div>
        <div ref={contentRef}>{children}</div>
      </div>
    </Focusable>
  );
};
