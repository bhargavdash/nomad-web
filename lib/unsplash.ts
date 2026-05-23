// Unsplash Source — no API key needed. Returns a deterministic image
// for a query, sized to the requested dimensions.
//
// Format: https://source.unsplash.com/{width}x{height}/?{query}
//
// Note: source.unsplash.com is deprecated as of 2024 but still serves images.
// For long-term reliability, switch to the Unsplash API with an access key.

export function unsplashUrl(query: string, w = 1200, h = 800): string {
  const q = encodeURIComponent(query.toLowerCase().replace(/[^\w\s,]/g, "").trim());
  return `https://source.unsplash.com/${w}x${h}/?${q}`;
}

// A more reliable alternative — uses Unsplash's photo IDs for curated travel.
// Picks one based on a stable hash of the query so the same destination
// always shows the same image.
const FALLBACK_PHOTO_IDS = [
  "qyAka7W5uMY", // mountains + temple
  "VWcPlbHglYc", // beach sunset
  "n7DY58YFg9E", // desert dunes
  "wpU4veNGnHg", // tokyo night
  "Iy7QyzOs1Lc", // bali rice
  "S3Rd4i7lkrI", // moroccan tiles
  "AiqIic3sLwQ", // kyoto temple
  "iEEBWgY_6lA", // colombian streets
  "Yh3CrZj9z0Y", // jaipur palace
  "GpVukWaXKEs", // jaisalmer
];

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function unsplashByQuery(query: string, w = 1200, h = 800): string {
  const id = FALLBACK_PHOTO_IDS[hash(query) % FALLBACK_PHOTO_IDS.length];
  return `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&q=80`;
}
