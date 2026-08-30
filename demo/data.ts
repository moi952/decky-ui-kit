export const OPTIONS = [
  { value: "a", label: "Option A" },
  { value: "b", label: "Option B" },
  { value: "c", label: "Option C" },
];

export const LONG_OPTIONS = Array.from({ length: 12 }, (_, i) => ({
  value: `opt${i}`,
  label: `Option ${i + 1}`,
}));

// Long enough, and enough of them pre-selected, that the joined summary
// actually reaches 2 lines and gets clipped — short labels never wrap, so
// they'd make this example look broken rather than demonstrate anything.
export const MULTI_OPTIONS = [
  { value: "a", label: "Ultra High Resolution Textures" },
  { value: "b", label: "Adaptive Frame Generation" },
  { value: "c", label: "Ray-Traced Global Illumination" },
  { value: "d", label: "Volumetric Cloud Shadows" },
  { value: "e", label: "Dynamic Foliage Rendering" },
];

// `examples` mirrors the <Section title="..."> strings in each component's
// demo file — the sidebar links to them by slugified id, so a title here
// must match its Section's title exactly (see Section.tsx / slug.ts).
export const COMPONENTS = [
  {
    id: "action-button",
    label: "ActionButton",
    examples: [
      'variant="normal" — the native DialogButton, untouched',
      'variant="bordered" — translucent gray card',
      'variant="danger" — destructive action',
      'variant="primary" — non-destructive confirm',
      "disabled",
      "every variant, side by side",
    ],
  },
  {
    id: "anchored-dropdown",
    label: "AnchoredDropdown",
    examples: [
      'variant="row" (default colors)',
      'variant="boxed" (default colors)',
      'focusStyle="outline"',
      'size="small"',
      "custom colors (e.g. a themed wrapper)",
      "multiple + maxDisplayLines=2",
      "maxVisibleOptions=4 (12 options, scrolls)",
      "blurBackground={false}",
      "bottomSeparator={false}",
      "highlightOnFocus={false}",
      "selectedCountLabel",
      'selectedValuesLayout="stacked"',
      "onSecondaryButton + onOptionsButton",
    ],
  },
  {
    id: "collapsible-section",
    label: "CollapsibleSection",
    examples: ["expanded (default)", "collapsed (default)"],
  },
  {
    id: "field-text-input",
    label: "FieldTextInput",
    examples: [
      "mustBeNumeric",
      "free text, no label",
      'labelPosition="left"',
      'labelPosition="right"',
      "highlightOnFocus={false}",
      'size="small"',
      "placeholder",
      "iconStart",
      "iconEnd + placeholder",
    ],
  },
  {
    id: "info-table",
    label: "InfoTable",
    examples: [
      "version + source + path",
      "with an accented row",
      "long value, wraps instead of clipping",
      "custom colors (e.g. a themed wrapper)",
    ],
  },
  {
    id: "inline-confirm",
    label: "InlineConfirm",
    examples: ["shown inline, not a modal", 'size="medium"', 'variant="primary"'],
  },
  {
    id: "media-row",
    label: "MediaRow",
    examples: [
      "status-stack app row, collapsed until pressed",
      "cover-image capsule, no actions row",
      'color="success" ("now playing")',
      "every color, side by side",
    ],
  },
  {
    id: "screenshot-carousel",
    label: "ScreenshotCarousel",
    examples: ["several screenshots", "a single screenshot", "no screenshots"],
  },
  {
    id: "status-card",
    label: "StatusCard",
    examples: [
      "success, with an action",
      'variant="error"',
      "title only, no description or children",
    ],
  },
];

// Hash format is "#component-id/example-id" — the example segment is
// optional, so a shared link can point at either a whole component page or
// one specific example within it.
export const parseHash = (): { id: string; exampleId: string | null } => {
  const [rawId, exampleId] = window.location.hash.slice(1).split("/");
  const id = COMPONENTS.some((c) => c.id === rawId) ? rawId : COMPONENTS[0].id;
  return { id, exampleId: exampleId || null };
};
