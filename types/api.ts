// Mirrors backend response shapes from c:/Users/DELL/code/nomad-api/src/routes/*.

export type ApiProfile = {
  id: string;
  email: string | null;
  displayName: string | null;
  avatarUrl: string | null;
};

export type TripStatus = 'researching' | 'ready' | 'active' | 'completed' | 'archived';

export type TripSummary = {
  id: string;
  destination: string;
  dateFrom: string | null;
  dateTo: string | null;
  durationDays: number | null;
  travelers: string | null;
  vibes: string[];
  accommodation: string | null;
  pace: string | null;
  budget: string | null;
  status: TripStatus;
  statsPlaces: number;
  statsTips: number;
  statsPhotoStops: number;
  emoji: string | null;
  createdAt: string;
};

export type TripDay = {
  id: string;
  dayNumber: number;
  city: string;
  title: string;
  description: string | null;
  highlights: string[];
  stopCount: number;
};

export type TripStop = {
  id: string;
  time: string;
  ampm: string;
  duration: string | null;
  name: string;
  description: string | null;
  source: 'youtube' | 'reddit' | 'blog' | 'maps' | null;
  tags: string[];
  locked: boolean;
};

export type TripFullResponse = {
  trip: TripSummary;
  days: (TripDay & { stops?: TripStop[] })[];
};

export type ResearchDiscovery = {
  id: string;
  title: string;
  body: string;
  tags: string[];
  source: 'youtube' | 'reddit' | 'blog' | 'maps';
};

export type ResearchJobResponse = {
  status: 'pending' | 'researching' | 'building' | 'completed' | 'failed';
  phase: number;
  progress: number;
  message: string | null;
  stats: { places: number; tips: number; photoStops: number };
  discoveries: ResearchDiscovery[];
};

export type TrendingDestination = {
  id: string;
  name: string;
  country: string;
  duration: string;
  signal: string;
  emoji: string | null;
};

export type Insight = {
  id: string;
  title: string;
  body: string;
  source: 'youtube' | 'reddit' | 'blog' | 'maps';
  destTag: string;
  icon: string;
};
