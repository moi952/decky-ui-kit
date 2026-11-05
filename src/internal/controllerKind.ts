import { useEffect, useState } from "react";

export type ControllerKind = "xbox" | "playstation" | "switch" | "steam";

// What Steam itself would draw for the bumpers on each family of pad.
export const BUMPER_LABELS: Record<ControllerKind, { left: string; right: string }> = {
  xbox: { left: "LB", right: "RB" },
  playstation: { left: "L1", right: "R1" },
  switch: { left: "L", right: "R" },
  steam: { left: "L1", right: "R1" },
};

const FAMILY_BY_STEAM_NAME: Record<string, ControllerKind> = {
  Xbox: "xbox",
  PlayStation: "playstation",
  NintendoSwitch: "switch",
  // Third-party pads (GameSir, 8BitDo...) — Steam files them as "Generic" but
  // they follow the Xbox layout, so LB / RB is what the player expects.
  Generic: "xbox",
};

// Steam keeps the pad family of the last-used input in an observable on its
// own globals (FocusNavController / ControllerStore). Both are internal and
// undocumented, so every access is guarded: anything missing or renamed just
// falls back to "steam" (L1 / R1).
const read = (nextValue?: unknown): ControllerKind => {
  try {
    const w = window as any;
    const type =
      (nextValue as { nControllerType?: number } | undefined)?.nControllerType ??
      w.FocusNavController?.m_glyphInfo?.m_currentValue?.nControllerType;
    const family = w.ControllerStore?.GetConsolidatedControllerType?.(type);
    return FAMILY_BY_STEAM_NAME[family] ?? "steam";
  } catch {
    return "steam";
  }
};

// The pad family currently driving the UI, kept live as the player switches
// between pads (Xbox, PlayStation, Switch, Steam Deck...).
export const useControllerKind = (enabled = true): ControllerKind => {
  const [kind, setKind] = useState<ControllerKind>(read);
  useEffect(() => {
    if (!enabled) return;
    setKind(read());
    try {
      const sub = (window as any).FocusNavController?.m_glyphInfo?.Subscribe?.(
        (value: unknown) => setKind(read(value)),
      );
      return () => sub?.Unsubscribe?.();
    } catch {
      return undefined;
    }
  }, [enabled]);
  return kind;
};
