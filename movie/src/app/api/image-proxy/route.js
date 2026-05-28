const ALLOWED_IMAGE_HOSTS = new Set(["image.tmdb.org"]);

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const source = searchParams.get("src");

  if (!source) {
    return new Response("Missing image source", { status: 400 });
  }

  let sourceUrl;

  try {
    sourceUrl = new URL(source);
  } catch {
    return new Response("Invalid image source", { status: 400 });
  }

  if (!ALLOWED_IMAGE_HOSTS.has(sourceUrl.hostname)) {
    return new Response("Image host is not allowed", { status: 400 });
  }

  const imageResponse = await fetch(sourceUrl, {
    next: { revalidate: 60 * 60 * 24 * 7 },
  });

  if (!imageResponse.ok || !imageResponse.body) {
    return new Response("Image could not be loaded", { status: imageResponse.status || 502 });
  }

  const contentType = imageResponse.headers.get("content-type") || "image/jpeg";

  if (!contentType.startsWith("image/")) {
    return new Response("Source is not an image", { status: 415 });
  }

  return new Response(imageResponse.body, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=86400, s-maxage=604800",
      "Content-Type": contentType,
    },
  });
}
