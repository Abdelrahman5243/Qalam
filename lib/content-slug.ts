const knownSlugCorrections: Record<string, string> = {
  "supply-nstallation": "supply-installation",
};

export function normalizeContentSlug(value: string) {
  const slug = decodeURIComponent(value)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  return knownSlugCorrections[slug] || slug;
}
