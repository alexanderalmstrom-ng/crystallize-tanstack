export function isServer() {
  return typeof window === "undefined";
}

export function normalizeSlug(slug: string) {
  return slug.startsWith("/") ? slug : `/${slug}`;
}

export function removeLeadingSlash(slug: string) {
  return slug.startsWith("/") ? slug.slice(1) : slug;
}

export function getBaseURL() {
  return isServer() ? "http://localhost:3000" : window.location.origin;
}
