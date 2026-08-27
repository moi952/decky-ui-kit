export type ControlConfig = (
  | { type: "select"; options: string[] }
  | { type: "checkbox" }
  | { type: "number"; min?: number; placeholder?: string }
  | { type: "color" }
  | { type: "text" }
) & {
  key: string;
  label: string;
  // Lets a control (e.g. a color picker) only appear once another control
  // (e.g. a "custom colors" checkbox) enables it.
  showIf?: (values: Record<string, any>) => boolean;
};
