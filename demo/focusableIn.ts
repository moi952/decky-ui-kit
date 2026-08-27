// Every AnchoredDropdown trigger carries tabIndex=0 (or is a real <button>)
// on its own, so this reads the live focus order straight from the DOM
// instead of tracking a parallel ref list — works for any number of
// examples without extra bookkeeping.
export const focusableIn = (container: HTMLElement | null): HTMLElement[] => {
  if (!container) return [];
  // A "boxed" trigger is a focusable Field wrapping a native <button> that's
  // also independently tabbable — keep only the outer one per group so each
  // example is a single stop, not two.
  const all = Array.from(
    container.querySelectorAll<HTMLElement>('[tabindex="0"], button'),
  );
  return all.filter((el) => !all.some((other) => other !== el && other.contains(el)));
};
