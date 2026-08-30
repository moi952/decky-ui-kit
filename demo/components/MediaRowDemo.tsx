import React, { useState } from "react";
import { FiEyeOff } from "react-icons/fi";
import { MediaRow } from "../../src/MediaRow";
import { ControlConfig } from "../controls";
import { Section } from "./Section";
import { Playground } from "./Playground";
import { DemoPage } from "./DemoPage";

const IconPlaceholder: React.FC<{ color: string }> = ({ color }) => (
  <div
    style={{
      width: "100%",
      height: "100%",
      borderRadius: 6,
      background: color,
    }}
  />
);

// mediaLayout="stretch" gives this exactly the row's height and nothing
// else — no fixed width, so a real <img> would size itself from its own
// aspect ratio (never cropped). This placeholder fakes that same sizing
// with a fixed demo width instead of a real image's natural one.
const CoverPlaceholder: React.FC<{ from: string; to: string }> = ({ from, to }) => (
  <div
    style={{
      width: 80,
      height: "100%",
      background: `linear-gradient(135deg, ${from}, ${to})`,
    }}
  />
);

const ActionButtonPreview: React.FC<{
  children: React.ReactNode;
  flex?: boolean;
  onClick?: () => void;
}> = ({ children, flex, onClick }) => (
  <div style={flex ? { flex: 1 } : undefined}>
    <button
      onClick={onClick}
      style={{
        width: "100%",
        padding: "4px 10px",
        fontSize: 12,
        fontWeight: 700,
        background: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.18)",
        color: "#fff",
        borderRadius: 4,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </button>
  </div>
);

// One control per real MediaRow prop — no invented meta-controls. Two
// exceptions are unavoidable: `layout`/`withActions`/`hasUpdate` pick
// which of the two example shapes renders (mediaLayout, actions and
// details all being real props that take arbitrary ReactNode/values, not
// something a single control could drive directly), and `mediaColor`
// tints the placeholder standing in for `media` (itself a ReactNode).
const controls: ControlConfig[] = [
  { key: "layout", label: "layout", type: "select", options: ["status-stack", "cover-capsule"] },
  { key: "withActions", label: "with an actions row (status-stack only)", type: "checkbox", showIf: (v) => v.layout === "status-stack" },
  { key: "collapsedByDefault", label: "collapsedByDefault", type: "checkbox", showIf: (v) => v.layout === "status-stack" && v.withActions },
  { key: "hasUpdate", label: "has an available update (status-stack only)", type: "checkbox", showIf: (v) => v.layout === "status-stack" },
  { key: "mediaWidth", label: "mediaWidth (fixed layout only)", type: "number", min: 8, showIf: (v) => v.layout === "status-stack" },
  { key: "mediaHeight", label: "mediaHeight", type: "number", min: 8 },
  { key: "titleLines", label: "titleLines", type: "number", min: 1 },
  { key: "color", label: "color", type: "select", options: ["light", "dark", "transparent", "success", "danger", "info", "warning"] },
  { key: "accentBorderColor", label: "accentBorderColor", type: "color" },
  { key: "accentBackground", label: "accentBackground", type: "color" },
  { key: "accentBorderWidth", label: "accentBorderWidth", type: "number", min: 1 },
  { key: "mediaColor", label: "media color", type: "color" },
  // Fully independent of each other — borderOnFocus is just the border,
  // highlightOnFocus is just the background tint behind the row.
  { key: "borderOnFocus", label: "borderOnFocus", type: "checkbox" },
  { key: "highlightColor", label: "highlightColor", type: "color", showIf: (v) => v.borderOnFocus },
  { key: "highlightOnFocus", label: "highlightOnFocus", type: "checkbox" },
  { key: "highlightBackground", label: "highlightBackground", type: "color", showIf: (v) => v.highlightOnFocus },
  { key: "spacing", label: "spacing", type: "number", min: 0 },
  { key: "bottomSeparator", label: "bottomSeparator", type: "checkbox" },
  { key: "onSecondaryActionDescription", label: "onSecondaryActionDescription", type: "text" },
];

const initialValues = {
  layout: "status-stack",
  withActions: true,
  collapsedByDefault: true,
  hasUpdate: true,
  mediaWidth: 32,
  mediaHeight: 32,
  titleLines: 1,
  color: "light",
  accentBorderColor: "#4caf50",
  accentBackground: "#0d1f0d",
  accentBorderWidth: 2,
  mediaColor: "#e67e22",
  highlightOnFocus: true,
  borderOnFocus: true,
  highlightColor: "#dcdedf",
  highlightBackground: "#2a3a4a",
  spacing: 0,
  bottomSeparator: true,
  onSecondaryActionDescription: "",
};

const genCode = (values: Record<string, any>) => {
  const sharedProps = [
    `  color="${values.color}"`,
    `  accentBorderColor="${values.accentBorderColor}"`,
    `  accentBackground="${values.accentBackground}"`,
    `  accentBorderWidth={${values.accentBorderWidth}}`,
    `  borderOnFocus={${values.borderOnFocus}}`,
    ...(values.borderOnFocus ? [`  highlightColor="${values.highlightColor}"`] : []),
    `  highlightOnFocus={${values.highlightOnFocus}}`,
    ...(values.highlightOnFocus
      ? [`  highlightBackground="${values.highlightBackground}"`]
      : []),
    `  spacing={${values.spacing}}`,
    ...(values.bottomSeparator ? [`  bottomSeparator`] : []),
    ...(values.onSecondaryActionDescription
      ? [
          `  onSecondaryButton={quickAction}`,
          `  onSecondaryActionDescription="${values.onSecondaryActionDescription}"`,
        ]
      : []),
  ];
  if (values.layout === "cover-capsule") {
    return [
      `<MediaRow`,
      `  mediaLayout="stretch"`,
      `  mediaHeight={${values.mediaHeight}}`,
      `  media={<img style={{ height: "100%", width: "auto" }} .../>}`,
      `  title="Half-Life 2"`,
      `  titleLines={${values.titleLines}}`,
      `  onPress={launch}`,
      ...sharedProps,
      `/>`,
    ].join("\n");
  }
  const lines = [
    `<MediaRow`,
    `  media={<img src={iconUrl} .../>}`,
    `  mediaWidth={${values.mediaWidth}}`,
    `  mediaHeight={${values.mediaHeight}}`,
    `  title="Firefox"`,
    `  titleLines={${values.titleLines}}`,
    `  details={<div>128.0${values.hasUpdate ? "\\n129.0 available" : ""}</div>}`,
  ];
  if (values.withActions) {
    lines.push(
      `  actions={<ActionButton>Update</ActionButton>}`,
      `  collapsedByDefault={${values.collapsedByDefault}}`,
    );
  }
  lines.push(...sharedProps, `/>`);
  return lines.join("\n");
};

export const MediaRowDemo: React.FC = () => {
  const [secondaryCount, setSecondaryCount] = useState(0);

  return (
    <DemoPage
      playground={
        <Playground
          controls={controls}
          initialValues={initialValues}
          genCode={genCode}
          render={(values) => {
            const shared = {
              color: values.color,
              accentBorderColor: values.accentBorderColor,
              accentBackground: values.accentBackground,
              accentBorderWidth: values.accentBorderWidth,
              highlightOnFocus: values.highlightOnFocus,
              borderOnFocus: values.borderOnFocus,
              highlightColor: values.highlightColor,
              highlightBackground: values.highlightBackground,
              spacing: values.spacing,
              bottomSeparator: values.bottomSeparator,
              ...(values.onSecondaryActionDescription
                ? {
                    onSecondaryButton: () => setSecondaryCount((c) => c + 1),
                    onSecondaryActionDescription: values.onSecondaryActionDescription,
                  }
                : {}),
            } as const;
            return (
              <>
                {values.layout === "cover-capsule" ? (
                  <MediaRow
                    {...shared}
                    mediaLayout="stretch"
                    mediaHeight={values.mediaHeight}
                    media={<CoverPlaceholder from={values.mediaColor} to="#1a1a2e" />}
                    title={<span style={{ fontSize: 11, fontWeight: "normal" }}>Half-Life 2</span>}
                    titleLines={values.titleLines}
                    onPress={() => {}}
                  />
                ) : (
                  <MediaRow
                    {...shared}
                    media={<IconPlaceholder color={values.mediaColor} />}
                    mediaWidth={values.mediaWidth}
                    mediaHeight={values.mediaHeight}
                    title="Firefox"
                    titleLines={values.titleLines}
                    details={
                      <>
                        <div style={{ fontSize: 11, color: "#9aa1a8" }}>128.0</div>
                        {values.hasUpdate && (
                          <div style={{ fontSize: 11, color: "#4caf50" }}>Available version: 129.0</div>
                        )}
                      </>
                    }
                    onPress={values.withActions ? undefined : () => {}}
                    collapsedByDefault={values.collapsedByDefault}
                    actions={
                      values.withActions ? (
                        <>
                          <ActionButtonPreview flex>Update</ActionButtonPreview>
                          <ActionButtonPreview>
                            <FiEyeOff size={12} />
                          </ActionButtonPreview>
                        </>
                      ) : undefined
                    }
                  />
                )}
                {values.onSecondaryActionDescription && (
                  <div style={{ marginTop: 8, fontSize: 11, color: "#9aa1a8" }}>
                    Focus the row and press X — fired {secondaryCount} time
                    {secondaryCount === 1 ? "" : "s"}.
                  </div>
                )}
              </>
            );
          }}
        />
      }
    >
      <Section
        title="status-stack app row, collapsed until pressed"
        description="An icon, a title, a multi-line status stack, and an inline action row that starts hidden — press the header to reveal Update/Exclude. This is decky-apps-manager's own AppRow, unchanged."
        code={`<MediaRow\n  media={<img src={iconUrl} .../>}\n  title="Firefox"\n  details={<div style={{ color: "#9aa1a8" }}>128.0</div>}\n  color="transparent"\n  bottomSeparator\n  collapsedByDefault\n  actions={<ActionButton>Update</ActionButton>}\n/>`}
      >
        <MediaRow
          color="transparent"
          media={<IconPlaceholder color="#e67e22" />}
          title="Firefox"
          details={
            <>
              <div style={{ fontSize: 11, color: "#9aa1a8" }}>128.0</div>
              <div style={{ fontSize: 11, color: "#4caf50" }}>Available version: 129.0</div>
            </>
          }
          bottomSeparator
          collapsedByDefault
          actions={
            <>
              <ActionButtonPreview flex>Update</ActionButtonPreview>
              <ActionButtonPreview>
                <FiEyeOff size={12} />
              </ActionButtonPreview>
            </>
          }
        />
      </Section>

      <Section
        title="cover-image capsule, no actions row"
        description="A fixed-height cover image, no fixed width at all — the image (or here, a placeholder) sizes itself from its own aspect ratio, so it's never cropped. A 2-line title, a single press target, a plain 'light' card background — no header/actions split at all. This is decky-proton-launch's own GameRow, unchanged."
        code={`<MediaRow\n  mediaLayout="stretch"\n  mediaHeight={37}\n  media={<img style={{ height: "100%", width: "auto" }} .../>}\n  title="Half-Life 2"\n  titleLines={2}\n  onPress={launch}\n  spacing={4}\n  color="light"\n/>`}
      >
        <MediaRow
          mediaLayout="stretch"
          mediaHeight={37}
          media={<CoverPlaceholder from="#2b6cb0" to="#1a2a4d" />}
          title={<span style={{ fontSize: 11, fontWeight: "normal" }}>Half-Life 2</span>}
          titleLines={2}
          onPress={() => {}}
          spacing={4}
          color="light"
        />
      </Section>

      <Section
        title={'color="success" ("now playing")'}
        description={'A ready-made accent look (border + tinted background) flags one row as active — color covers the exact tint, accentBorderWidth keeps the row\'s size from shifting when a row that isn\'t accented reserves the same width with color="light" (or "dark"/"transparent").'}
        code={`<MediaRow\n  color="success"\n  accentBorderWidth={2}\n  ...\n/>`}
      >
        <MediaRow
          mediaLayout="stretch"
          mediaHeight={37}
          media={<CoverPlaceholder from="#2b6cb0" to="#1a2a4d" />}
          title={<span style={{ fontSize: 11, fontWeight: "normal" }}>Half-Life 2</span>}
          titleLines={2}
          onPress={() => {}}
          spacing={4}
          color="success"
          accentBorderWidth={2}
        />
      </Section>

      <Section
        title="every color, side by side"
        description="light / dark / transparent / success / danger / info / warning — color is required, there's no 'no color at all' state, so a row's border width never shifts depending on which color a sibling happens to have. light/dark are the two plain card backgrounds (no state implied); transparent is for a flush row in a bottomSeparator list, which must show no card look of its own."
        code={`<MediaRow color="light" ... />\n<MediaRow color="dark" ... />\n<MediaRow color="transparent" ... />\n<MediaRow color="success" ... />\n<MediaRow color="danger" ... />\n<MediaRow color="info" ... />\n<MediaRow color="warning" ... />`}
      >
        {(["light", "dark", "transparent", "success", "danger", "info", "warning"] as const).map((c) => (
          <MediaRow
            key={c}
            mediaLayout="stretch"
            mediaHeight={37}
            media={<CoverPlaceholder from="#2b6cb0" to="#1a2a4d" />}
            title={<span style={{ fontSize: 11, fontWeight: "normal" }}>{c}</span>}
            titleLines={2}
            onPress={() => {}}
            spacing={4}
            color={c}
            accentBorderWidth={2}
          />
        ))}
      </Section>
    </DemoPage>
  );
};
