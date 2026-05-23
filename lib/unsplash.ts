// Unsplash Source — no API key needed. Returns a deterministic image
// for a query, sized to the requested dimensions.
//
// Format: https://source.unsplash.com/{width}x{height}/?{query}
//
// Note: source.unsplash.com is deprecated as of 2024 but still serves images.
// For long-term reliability, switch to the Unsplash API with an access key.

export function unsplashUrl(query: string, w = 1200, h = 800): string {
  const q = encodeURIComponent(
    query
      .toLowerCase()
      .replace(/[^\w\s,]/g, "")
      .trim(),
  );
  return `https://source.unsplash.com/${w}x${h}/?${q}`;
}

// A more reliable alternative — uses Unsplash's photo IDs for curated travel.
// Picks one based on a stable hash of the query so the same destination
// always shows the same image.
const FALLBACK_PHOTO_IDS = [
  "1506905925346-21bda4d32df4", // mountains
  "1507525428034-b723cf961d3e", // beach sunset
  "1509316785289-025f5b846b35", // desert dunes
  "1540959733332-eab4deabeeaf", // tokyo night
  "1537996134236-852f5e52fe94", // bali rice terraces
  "1539020140153-e479b8c22e70", // moroccan tiles
  "1493976040374-85c8e12f0c0e", // kyoto temple
  "1531761535209-8ab42d51e3c2", // colombian streets
  "1524492412937-b28074a5d7da", // jaipur palace
  "1602216056096-3b40cc0c9944", // jaisalmer fort
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
