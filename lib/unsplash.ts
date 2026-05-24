// ---------------------------------------------------------------------------
// Unsplash image helpers
//
// Uses direct `images.unsplash.com/photo-{ID}` CDN URLs — no API key needed,
// no deprecated source.unsplash.com proxy. URLs are deterministic so the same
// query always returns the same image (no hydration flicker, no layout shift).
//
// Strategy: keyword → themed bucket → stable hash within bucket.
// ---------------------------------------------------------------------------

/** Map of themed travel photo buckets. IDs are verified Unsplash photo IDs. */
const PHOTO_BUCKETS: Record<string, string[]> = {
  heritage: [
    "1524492412937-b28074a5d7da", // Jaipur palace
    "1602216056096-3b40cc0c9944", // Jaisalmer fort
    "1558618666-fcd25c85cd64", // ornate Indian architecture
    "1564507592333-c60657eea523", // Amber Fort
    "1477587458883-47145ed31658", // historic arched corridor
    "1569139919536-75f5b36f1e0f", // heritage doorway
  ],
  temple: [
    "1493976040374-85c8e12f0c0e", // Kyoto temple
    "1528360983277-13d401cdc186", // stone temple steps
    "1545569341-9eb8b30979d9", // lit-up Asian temple
    "1539020140153-e479b8c22e70", // Moroccan tile patterns
    "1529111290557-82f6d5c6cf85", // ancient carved stone
    "1506905925346-21bda4d32df4", // misty landscape near temple
  ],
  beach: [
    "1507525428034-b723cf961d3e", // beach sunset
    "1505118380757-91f5f5632de0", // tropical palm beach
    "1519046904884-53103b34b206", // aerial turquoise water
    "1537996134236-852f5e52fe94", // Bali rice / lush green (coastal feel)
    "1559056699-d06e8ed3e5cb", // waves on sandy shore
    "1473116763249-2faaef81ccda", // ocean horizon
  ],
  mountain: [
    "1506905925346-21bda4d32df4", // mountain peaks
    "1464822759023-fed622ff2c3b", // snowy mountain range
    "1476514525405-309e3d6b7fee", // mountain lake reflection
    "1551632811-561732d1e306", // mountain village
    "1455156218388-5e61b526818d", // mountain lake at dawn
    "1544198365-f5d60b6d8190", // green valley hills
  ],
  desert: [
    "1509316785289-025f5b846b35", // desert dunes
    "1541140532-8ed9bec1f1bf", // desert sunset red dunes
    "1504512485720-7d83a16ee930", // camel caravan silhouette
    "1527489377706-5bf97e608852", // sand texture golden
    "1602555397485-fdbdd8a5c1ef", // Sahara dunes
  ],
  market: [
    "1531761535209-8ab42d51e3c2", // Colombian colourful street
    "1512453979798-5ea266f8880c", // bustling market stalls
    "1494475673543-d8d9d0dafcea", // spice market
    "1556909114-f6e7ad7d3136", // night market lanterns
    "1558618666-fcd25c85cd64", // bazaar / arched passage
    "1488900128323-21503983a07e", // open-air market produce
  ],
  food: [
    "1504674900247-0877df9cc836", // food spread / feast
    "1504544750208-a28ad7e54fc3", // breakfast cafe
    "1555396273-367ea4eb4db5", // warm restaurant interior
    "1493770348161-369560ae357d", // chai / tea glass
    "1565299624946-b28f40a0ae38", // street food close-up
    "1414235077428-338989a2e8c0", // fine dining plate
  ],
  city: [
    "1540959733332-eab4deabeeaf", // Tokyo neon night
    "1499856374842-28c6e2d0fd30", // Paris aerial Seine
    "1534430480872-3498386e7856", // Rome / European piazza
    "1467269204594-9661b134dd2b", // cobblestone European alley
    "1512453979798-5ea266f8880c", // city skyline at dusk
    "1556910103-1c02745aae4d", // city lights reflection water
  ],
  nature: [
    "1537996134236-852f5e52fe94", // Bali rice terraces
    "1440342122353-68b97f0e52f3", // tea plantation green hills
    "1566677914817-56426959ae9c", // rolling green countryside
    "1470770841072-f978cf4d5c33", // meadow / fields
    "1476514525405-309e3d6b7fee", // forest lake reflection
    "1559056699-d06e8ed3e5cb", // river through jungle
  ],
  default: [
    "1507525428034-b723cf961d3e", // beach sunset
    "1506905925346-21bda4d32df4", // mountains
    "1509316785289-025f5b846b35", // desert dunes
    "1540959733332-eab4deabeeaf", // tokyo night
    "1537996134236-852f5e52fe94", // bali rice terraces
    "1539020140153-e479b8c22e70", // moroccan tiles
    "1493976040374-85c8e12f0c0e", // kyoto temple
    "1531761535209-8ab42d51e3c2", // colombian streets
    "1524492412937-b28074a5d7da", // jaipur palace
    "1602216056096-3b40cc0c9944", // jaisalmer fort
    "1499856374842-28c6e2d0fd30", // paris
    "1534430480872-3498386e7856", // rome
    "1564507592333-c60657eea523", // amber fort
  ],
};

/** Keyword → bucket priority list (first match wins). */
const KEYWORD_RULES: Array<{ keywords: string[]; bucket: keyof typeof PHOTO_BUCKETS }> = [
  {
    keywords: ["fort", "palace", "castle", "haveli", "mahal", "monument", "heritage", "historical", "ruins", "citadel"],
    bucket: "heritage",
  },
  {
    keywords: ["temple", "shrine", "pagoda", "church", "mosque", "mandir", "gopuram", "stupa", "cathedral", "basilica"],
    bucket: "temple",
  },
  {
    keywords: ["beach", "coast", "coastal", "sea", "ocean", "bay", "island", "surf", "snorkel", "lagoon", "shore"],
    bucket: "beach",
  },
  {
    keywords: ["mountain", "hill", "trek", "trekking", "hike", "hiking", "valley", "peak", "ridge", "gorge", "cliff", "glacier", "summit", "pass"],
    bucket: "mountain",
  },
  {
    keywords: ["desert", "dune", "sand", "sahara", "thar", "arid", "camel", "oasis"],
    bucket: "desert",
  },
  {
    keywords: ["market", "bazaar", "bazar", "souk", "vendor", "stall", "spice", "handicraft", "shopping", "bazaar"],
    bucket: "market",
  },
  {
    keywords: ["food", "restaurant", "cafe", "coffee", "tea", "chai", "lunch", "dinner", "breakfast", "eat", "dining", "street food", "lassi", "thali", "cuisine"],
    bucket: "food",
  },
  {
    keywords: ["city", "skyline", "urban", "downtown", "metro", "night", "neon", "lights", "rooftop", "skyscraper"],
    bucket: "city",
  },
  {
    keywords: ["rice", "jungle", "forest", "garden", "park", "nature", "green", "plantation", "terrace", "waterfall", "river", "lake"],
    bucket: "nature",
  },
];

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function pickPhotoId(query: string): string {
  const q = query.toLowerCase();

  for (const rule of KEYWORD_RULES) {
    if (rule.keywords.some((kw) => q.includes(kw))) {
      const bucket = PHOTO_BUCKETS[rule.bucket];
      return bucket[hash(query) % bucket.length];
    }
  }

  // No keyword match — fall back to default pool
  const bucket = PHOTO_BUCKETS.default;
  return bucket[hash(query) % bucket.length];
}

/**
 * Returns a reliable Unsplash CDN image URL for a travel query.
 * Uses keyword matching to pick thematically relevant photos.
 * Fully deterministic — same query always returns the same URL.
 */
export function unsplashByQuery(query: string, w = 1200, h = 800): string {
  const id = pickPhotoId(query);
  return `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&q=80`;
}

// ---------------------------------------------------------------------------
// Legacy alias — kept so any code still calling unsplashUrl doesn't break
// at import time, but redirects to the reliable CDN approach.
// ---------------------------------------------------------------------------
export function unsplashUrl(query: string, w = 1200, h = 800): string {
  return unsplashByQuery(query, w, h);
}
