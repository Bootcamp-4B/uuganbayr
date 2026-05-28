export function getWebglPosterSource(source) {
  if (!source || typeof window === "undefined") {
    return source || "";
  }

  try {
    const url = new URL(source, window.location.href);

    if (url.origin === window.location.origin) {
      return `${url.pathname}${url.search}${url.hash}`;
    }

    if (url.hostname === "image.tmdb.org") {
      return `/api/image-proxy?src=${encodeURIComponent(url.href)}`;
    }
  } catch {
    return source;
  }

  return source;
}
