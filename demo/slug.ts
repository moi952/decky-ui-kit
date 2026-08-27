// Shared between Section (which sets the id) and the sidebar (which links
// to it) so a title always resolves to the same anchor on both ends.
export const slugify = (s: string): string =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
