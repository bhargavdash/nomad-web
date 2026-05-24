export const DEMO_TRIP = {
  destination: 'Rajasthan, India',
  dates: { from: 'Mar 28', to: 'Apr 4' },
  duration: 7,
  vibes: ['Photo spots', 'Local food', 'Handicrafts', 'Slow travel'],
  stats: { places: 38, tips: 34, photoStops: 17 },
  days: ['Jaipur', 'Jaipur', 'Jodhpur', 'Jodhpur → Jaisalmer', 'Jaisalmer', 'Jaisalmer', 'Jaipur'],
};

export const DEMO_STOPS_DAY1 = [
  {
    id: 'pc1',
    time: '7:00',
    ampm: 'AM',
    duration: '2 hrs',
    name: 'Amber Fort — sunrise',
    desc: 'Empty fort, golden light. Go before 9 AM to beat crowds.',
    source: 'youtube' as const,
    tags: ['📸 Photo stop', '🏛️ Heritage', 'Trending'],
    locked: true,
  },
  {
    id: 'pc2',
    time: '9:30',
    ampm: 'AM',
    duration: '45 min',
    name: 'Lassiwala — Old City',
    desc: 'Legendary lassi stall. Open from 8 AM, queue fast.',
    source: 'reddit' as const,
    tags: ['🍜 Street food', "Locals' choice"],
    locked: false,
  },
  {
    id: 'pc3',
    time: '11:00',
    ampm: 'AM',
    duration: '1.5 hrs',
    name: 'Johari Bazaar walk',
    desc: 'Main handicrafts street. Back alleys have better prices.',
    source: 'blog' as const,
    tags: ['🧵 Handicrafts', 'Shopping'],
    locked: false,
  },
  {
    id: 'pc4',
    time: '1:30',
    ampm: 'PM',
    duration: '1 hr',
    name: 'Hawa Mahal exterior',
    desc: 'Best shot from the cafe across the street. Avoid noon heat.',
    source: 'youtube' as const,
    tags: ['📸 Photo stop', 'Trending'],
    locked: false,
  },
  {
    id: 'pc5',
    time: '3:30',
    ampm: 'PM',
    duration: '1 hr',
    name: 'City Palace museum',
    desc: 'Avoid weekends. Audio guide worth it, get the good one.',
    source: 'maps' as const,
    tags: ['🏛️ Heritage', 'Museum'],
    locked: false,
  },
];

export const TRENDING_DESTINATIONS = [
  {
    id: 't1',
    name: 'Tokyo',
    country: 'Japan',
    duration: '5–10 days',
    signal: '🔥 Trending this week',
    emoji: '🗼',
    query: 'Tokyo Japan neon',
  },
  {
    id: 't2',
    name: 'Bali',
    country: 'Indonesia',
    duration: '7–14 days',
    signal: '🔥 4.2k trips planned',
    emoji: '🌴',
    query: 'Bali rice terraces',
  },
  {
    id: 't3',
    name: 'Morocco',
    country: 'Africa',
    duration: '8–12 days',
    signal: '⬆ Up 34% this month',
    emoji: '🕌',
    query: 'Marrakech Morocco',
  },
  {
    id: 't4',
    name: 'Kyoto',
    country: 'Japan',
    duration: '4–7 days',
    signal: '🌸 Cherry blossom',
    emoji: '⛩️',
    query: 'Kyoto cherry blossom',
  },
  {
    id: 't5',
    name: 'Colombia',
    country: 'South America',
    duration: '10–14 days',
    signal: '✦ Hidden gem pick',
    emoji: '☕',
    query: 'Cartagena Colombia',
  },
];

export const SOURCE_BADGE_COLORS = {
  youtube: { bg: '#E8593C', text: '#fff', label: '▶ YouTube' },
  reddit: { bg: '#FF4500', text: '#fff', label: 'R Reddit' },
  blog: { bg: '#2A7A56', text: '#fff', label: '✍ Blog' },
  maps: { bg: '#2E6FAA', text: '#fff', label: '📍 Maps' },
} as const;

export type SourceKey = keyof typeof SOURCE_BADGE_COLORS;

// --- Plan Your Trip data ---

export const VIBE_CATEGORIES = [
  {
    label: 'Food + Drink',
    vibes: ['Local cuisines', 'Street food', 'Chai stops', 'Fine dining'],
  },
  {
    label: 'Explore',
    vibes: ['Photo spots', 'Heritage walks', 'Handicrafts', 'Hidden gems', 'Sunrise spots'],
  },
  {
    label: 'Shopping',
    vibes: ['Local Markets', 'Luxury Boutiques', 'Artisan Crafts', 'Souvenirs'],
  },
];

export const ACCOMMODATION_OPTIONS = [
  { icon: '🏡', label: 'Boutique Villa', desc: 'Private, curated, intimate' },
  { icon: '🏨', label: 'Luxury Hotel', desc: 'Full-service, high-end amenities' },
  { icon: '🌿', label: 'Eco Lodge', desc: 'Sustainable, close to nature' },
  { icon: '🏠', label: 'Homestay', desc: 'Authentic, local living experiences' },
  { icon: '🛋', label: 'Airbnb', desc: 'Unique stays in local neighborhoods' },
  { icon: '🛏', label: 'Hostel', desc: 'Social, budget-friendly for solo travelers' },
  { icon: '✨', label: 'Custom Stay', desc: 'Request specific lodging' },
];

export const PACE_OPTIONS = ['Slow & Soulful', 'Balanced', 'Action-Packed'] as const;

export const BUDGET_TIERS = ['Low', 'Medium', 'High', 'Very-High'] as const;

export const TRAVELER_OPTIONS = [
  { value: '1' as const, label: '1 Person' },
  { value: '2' as const, label: '2 People' },
  { value: '3+' as const, label: '3+ People' },
  { value: 'large' as const, label: 'Large Group' },
];

// --- Research Ticker data ---

export const RESEARCH_SOURCES = [
  { key: 'youtube' as const, label: 'YouTube vlogs', color: '#E8593C' },
  { key: 'reddit' as const, label: 'Reddit: r/travel', color: '#FF4500' },
  { key: 'google' as const, label: 'Google Search', color: '#2E6FAA' },
  { key: 'blog' as const, label: 'Travel blogs', color: '#2A7A56' },
];
