export const DEMO_TRIP = {
  destination: 'Rajasthan, India',
  dates: { from: 'Mar 28', to: 'Apr 4' },
  duration: 7,
  vibes: ['Photo stops', 'Local favorites', 'Handicrafts', 'Hidden gems'],
  stats: { places: 38, tips: 34, photoStops: 17 },
  days: ['Jaipur', 'Jaipur', 'Jodhpur', 'Jodhpur → Jaisalmer', 'Jaisalmer', 'Jaisalmer', 'Jaipur'],
};

export const SOURCE_BADGE_COLORS = {
  youtube: { bg: '#E8593C', text: '#fff', label: '▶ YouTube' },
  reddit: { bg: '#FF4500', text: '#fff', label: 'R Reddit' },
  blog: { bg: '#2A7A56', text: '#fff', label: 'Blog' },
  maps: { bg: '#2E6FAA', text: '#fff', label: 'Maps' },
} as const;

export type SourceKey = keyof typeof SOURCE_BADGE_COLORS;

// --- Plan Your Trip data ---

export const VIBE_CATEGORIES = [
  {
    label: 'Food',
    vibes: ['Local favorites', 'Street food', 'Aesthetic cafes', 'Luxury dining'],
  },
  {
    label: 'Explore',
    vibes: [
      'Hidden gems',
      'Photo stops',
      'Sunrise points',
      'Religious places',
      'History & archaeology',
      'Beaches',
      'Mountains',
    ],
  },
  {
    label: 'Shopping',
    vibes: ['Handlooms', 'Local markets', 'Handicrafts', 'Souvenirs'],
  },
];

export const ACCOMMODATION_OPTIONS = [
  'Hostel',
  'Budget Hotel',
  'Luxury Hotel',
  'Airbnb / Homestay',
] as const;

export const PACE_OPTIONS = ['Slow & Soulful', 'Balanced', 'Action-Packed'] as const;

export const BUDGET_TIERS = ['Low', 'Medium', 'High', 'Very-High'] as const;

// Exact traveller counts, 1–10 — rendered as a dropdown on the plan form.
export const MAX_TRAVELERS = 10;

export const TRAVELER_OPTIONS = Array.from({ length: MAX_TRAVELERS }, (_, i) => {
  const n = i + 1;
  return { value: String(n), label: `${n} ${n === 1 ? 'traveler' : 'travelers'}` };
});

// --- Research Ticker data ---

export const RESEARCH_SOURCES = [
  { key: 'youtube' as const, label: 'YouTube vlogs', color: '#E8593C' },
  { key: 'reddit' as const, label: 'Reddit: r/travel', color: '#FF4500' },
  { key: 'google' as const, label: 'Google Search', color: '#2E6FAA' },
  { key: 'blog' as const, label: 'Travel blogs', color: '#2A7A56' },
];
