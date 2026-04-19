const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "/api";

function getBackendOrigin() {
  if (/^https?:\/\//i.test(apiBaseUrl)) {
    return new URL(apiBaseUrl).origin;
  }

  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return "";
}

export function resolveBackendAssetUrl(path) {
  if (!path) return "";

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const origin = getBackendOrigin();

  return origin ? `${origin}${normalizedPath}` : normalizedPath;
}
