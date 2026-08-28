// Reads the live focus order straight from the DOM via the standard set of
// natively-focusable elements, instead of a selector tailored to whichever
// component was built first — a new component (an <input>, a <select>, a
// custom tabIndex=0 div) is automatically included with no change here.
const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export const focusableIn = (container: HTMLElement | null): HTMLElement[] => {
  if (!container) return [];
  // A "boxed" AnchoredDropdown trigger is a focusable Field wrapping a
  // native <button> that's also independently tabbable — keep only the
  // outer one per group so each example is a single stop, not two.
  const all = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
  return all.filter((el) => !all.some((other) => other !== el && other.contains(el)));
};
