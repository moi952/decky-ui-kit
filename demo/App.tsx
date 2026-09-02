import React, { useEffect, useRef, useState } from "react";
import { COMPONENTS, parseHash } from "./data";
import { focusableIn } from "./focusableIn";
import { slugify } from "./slug";
import { DeckyIcon } from "./icons";
import { ActionButtonDemo } from "./components/ActionButtonDemo";
import { AnchoredDropdownDemo } from "./components/AnchoredDropdownDemo";
import { CollapsibleSectionDemo } from "./components/CollapsibleSectionDemo";
import { FieldTextInputDemo } from "./components/FieldTextInputDemo";
import { InfoTableDemo } from "./components/InfoTableDemo";
import { InlineConfirmDemo } from "./components/InlineConfirmDemo";
import { MediaRowDemo } from "./components/MediaRowDemo";
import { QrCodeButtonDemo } from "./components/QrCodeButtonDemo";
import { ScreenshotCarouselDemo } from "./components/ScreenshotCarouselDemo";
import { StatusCardDemo } from "./components/StatusCardDemo";
import { VersionSwitcher } from "./components/VersionSwitcher";
import { FOOTER_HINT_EVENT, FooterHint } from "./mocks/decky-ui";

const TOPBAR_HEIGHT = 44;
const BOTTOMBAR_HEIGHT = 32;
const PANEL_WIDTH = 440;
const PANEL_BG = "#10161c";
const RAIL_WIDTH = 52;

const App: React.FC = () => {
  const [active, setActive] = useState(() => parseHash().id);
  const [activeExampleId, setActiveExampleId] = useState<string | null>(() => parseHash().exampleId);
  const [pendingScrollId, setPendingScrollId] = useState<string | null>(() => parseHash().exampleId);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const [footerHints, setFooterHints] = useState<FooterHint[]>([]);

  useEffect(() => {
    const onHint = (e: Event) => setFooterHints((e as CustomEvent).detail ?? []);
    window.addEventListener(FOOTER_HINT_EVENT, onHint);
    return () => window.removeEventListener(FOOTER_HINT_EVENT, onHint);
  }, []);

  // Direct links (including a shared "#component/example" URL) and browser
  // back/forward both land here.
  useEffect(() => {
    const onHashChange = () => {
      const { id, exampleId } = parseHash();
      setActive(id);
      setActiveExampleId(exampleId);
      setPendingScrollId(exampleId);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  // Without a focus target, arrow keys have nothing to bubble up from
  // (keydown only bubbles from document.activeElement), so the panel
  // handlers below never even run and the browser falls back to its own
  // default — scrolling the page. Re-running this on every `active` change
  // (not just on mount) matters because switching pages via the sidebar
  // doesn't unmount App — without the [active] dependency, the previous
  // page's now-removed element stayed "focused" in name only and
  // document.activeElement silently fell back to <body>, leaving arrow
  // keys dead on the newly-selected page.
  useEffect(() => {
    focusableIn(rightPanelRef.current)[0]?.focus();
  }, [active]);

  // Backstop: block the browser's own arrow-key scroll unconditionally, so
  // the page can never scroll even if focus ever ends up back on <body>.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const select = (id: string) => {
    window.location.hash = id;
    setActive(id);
    // A plain page switch (not via an example link) has no single example
    // to highlight — clear any stale highlight from a previous jump.
    setActiveExampleId(null);
  };

  // Selects the example's parent page, scrolls to it once mounted, and
  // writes both ids into the hash so the resulting URL is a direct,
  // shareable link back to this exact example — copying it and opening it
  // fresh lands on the same spot via the hashchange/initial-state parsing
  // above.
  const goToExample = (componentId: string, exampleId: string) => {
    window.location.hash = `${componentId}/${exampleId}`;
    setActive(componentId);
    setActiveExampleId(exampleId);
    setPendingScrollId(exampleId);
  };

  useEffect(() => {
    if (!pendingScrollId) return;
    const el = document.getElementById(pendingScrollId);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    (el.querySelector<HTMLElement>('[tabindex="0"], button') ?? el).focus();
    setPendingScrollId(null);
  }, [active, pendingScrollId]);

  // Arrow-key roving within a panel, matching Steam's own d-pad navigation
  // convention (as opposed to Tab, which is keyboard-only). jumpKey is the
  // single direction that leaves this panel for the other one — e.g. the
  // right panel only reacts to ArrowLeft, so pressing ArrowRight while
  // already inside it is a no-op instead of bouncing back to the sidebar.
  // A dropdown's own open list stops this from firing (see the Focusable
  // mock's stopPropagation) so it keeps handling its own options list
  // without interference.
  const handlePanelKeyDown = (
    e: React.KeyboardEvent,
    panelRef: React.RefObject<HTMLDivElement>,
    jumpKey: "ArrowLeft" | "ArrowRight",
    otherPanelRef: React.RefObject<HTMLDivElement>,
  ) => {
    const items = focusableIn(panelRef.current);
    const index = items.indexOf(document.activeElement as HTMLElement);

    if (e.key === "ArrowDown") {
      e.preventDefault();
      items[Math.min(index + 1, items.length - 1)]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      items[Math.max(index - 1, 0)]?.focus();
    } else if (e.key === jumpKey) {
      e.preventDefault();
      focusableIn(otherPanelRef.current)[0]?.focus();
    } else if (e.key === "Enter" || e.key === " ") {
      const el = document.activeElement as HTMLElement;
      if (el?.dataset.exampleId && el?.dataset.componentId) {
        e.preventDefault();
        goToExample(el.dataset.componentId, el.dataset.exampleId);
      } else if (el?.dataset.componentId) {
        e.preventDefault();
        select(el.dataset.componentId);
      }
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        background: "#000",
        display: "flex",
        flexDirection: "column",
        fontFamily:
          "Motiva Sans, -apple-system, BlinkMacSystemFont, sans-serif",
        boxSizing: "border-box",
      }}
    >
      {/* Top bar */}
      <div
        style={{
          height: TOPBAR_HEIGHT,
          flexShrink: 0,
          background: "#000",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
          color: "#fff",
        }}
      >
        <span style={{ fontSize: 20, fontWeight: 800 }}>decky-ui-kit</span>
        <VersionSwitcher />
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Left: Big Picture-style component list */}
        <div
          ref={leftPanelRef}
          onKeyDown={(e) => handlePanelKeyDown(e, leftPanelRef, "ArrowRight", rightPanelRef)}
          style={{
            width: PANEL_WIDTH,
            flexShrink: 0,
            background: PANEL_BG,
            color: "#e6eaed",
            overflowY: "auto",
            padding: "24px 0",
            boxSizing: "border-box",
          }}
        >
          {COMPONENTS.map((c) => (
            <React.Fragment key={c.id}>
              <div
                data-component-id={c.id}
                tabIndex={0}
                onClick={() => select(c.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "14px 24px",
                  fontSize: 16,
                  cursor: "pointer",
                  outline: "none",
                  borderLeft: active === c.id ? "4px solid #66c0f4" : "4px solid transparent",
                  background: active === c.id ? "rgba(255,255,255,0.08)" : "transparent",
                  color: active === c.id ? "#fff" : "#8b929a",
                }}
              >
                {c.label}
              </div>
              {active === c.id &&
                c.examples.map((title) => {
                  const exampleId = slugify(title);
                  return (
                    <div
                      key={exampleId}
                      data-example-id={exampleId}
                      data-component-id={c.id}
                      tabIndex={0}
                      onClick={() => goToExample(c.id, exampleId)}
                      style={{
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        padding: "8px 24px 8px 40px",
                        fontSize: 13,
                        cursor: "pointer",
                        outline: "none",
                        background: activeExampleId === exampleId ? "rgba(255,255,255,0.08)" : "transparent",
                        color: activeExampleId === exampleId ? "#fff" : "#8b929a",
                      }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          left: 30,
                          top: 6,
                          bottom: 6,
                          width: 3,
                          borderRadius: 2,
                          background: activeExampleId === exampleId ? "#66c0f4" : "#3a4048",
                        }}
                      />
                      {title}
                    </div>
                  );
                })}
            </React.Fragment>
          ))}
        </div>

        {/* Spacer background between panels */}
        <div style={{ flex: 1, background: "#161b21" }} />

        {/* Right: Decky QAM-style panel */}
        <div
          style={{
            width: PANEL_WIDTH,
            flexShrink: 0,
            display: "flex",
            background: PANEL_BG,
            boxShadow: "-8px 0 24px rgba(0,0,0,0.4)",
          }}
        >
          {/* Icon rail — only the Decky icon, active */}
          <div
            style={{
              width: RAIL_WIDTH,
              flexShrink: 0,
              background: "#0c1116",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              paddingTop: 16,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 6,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(255,255,255,0.1)",
                color: "#fff",
              }}
            >
              <DeckyIcon />
            </div>
          </div>

          {/* Content column */}
          <div
            ref={rightPanelRef}
            onKeyDown={(e) => handlePanelKeyDown(e, rightPanelRef, "ArrowLeft", leftPanelRef)}
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "16px 14px",
              boxSizing: "border-box",
              color: "#e6eaed",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 16,
              }}
            >
              <DeckyIcon />
              <span style={{ fontSize: 18, fontWeight: 700 }}>decky-ui-kit</span>
            </div>
            {active === "action-button" && <ActionButtonDemo />}
            {active === "anchored-dropdown" && <AnchoredDropdownDemo />}
            {active === "collapsible-section" && <CollapsibleSectionDemo />}
            {active === "field-text-input" && <FieldTextInputDemo />}
            {active === "info-table" && <InfoTableDemo />}
            {active === "inline-confirm" && <InlineConfirmDemo />}
            {active === "media-row" && <MediaRowDemo />}
            {active === "qr-code-button" && <QrCodeButtonDemo />}
            {active === "screenshot-carousel" && <ScreenshotCarouselDemo />}
            {active === "status-card" && <StatusCardDemo />}
          </div>
        </div>
      </div>

      {/* Bottom bar — stands in for Steam's real action-legend bar */}
      <div
        style={{
          height: BOTTOMBAR_HEIGHT,
          flexShrink: 0,
          background: "#000",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          padding: "0 20px",
          gap: 16,
          color: "#8b929a",
          fontSize: 12,
        }}
      >
        {footerHints.map((hint) => (
          <span key={hint.key} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span
              style={{
                background: "#2a2f36",
                color: "#e6eaed",
                borderRadius: 4,
                padding: "2px 8px",
                fontWeight: 700,
              }}
            >
              {hint.key}
            </span>
            {hint.text}
          </span>
        ))}
      </div>
    </div>
  );
};

export default App;
