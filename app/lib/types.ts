export type User = {
  id: string;
  name: string;
  email: string;
  emailVerified: Date | null;
  image: string | null;
  password_hash: string;
};

export type Photo = {
  file_name: string;
  s3_key: string;
  user_id: string;
  file_size: number;
  file_type: string;
  last_modified: Date;
  photo_id: string;
  width?: number;
  height?: number;
  album_id?: string;
};

export type Album = {
  album_id: string;
  album_name: string;
  user_id: string;
};

export type AlbumWithPreviews = Album & {
  previews: { photo: Photo; url: string }[];
  photoCount: number;
};

export type UserSession = {
  session: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    expiresAt: Date;
    token: string;
    ipAddress?: string | null | undefined | undefined;
    userAgent?: string | null | undefined | undefined;
  };
  user: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    emailVerified: boolean;
    name: string;
    image?: string | null | undefined | undefined;
  };
} | null;

export type Tag = {
  id: string;
  photo_id: string;
  category: string;
  label: string;
  created_at: Date;
};

export type AnalysisResult = {
  subjects: string[];
  setting: 'indoor' | 'outdoor' | 'studio' | 'unknown';
  timeOfDay: 'dawn' | 'morning' | 'midday' | 'afternoon' | 'golden hour' | 'dusk' | 'night' | 'unknown';
  weather: 'clear' | 'overcast' | 'foggy' | 'rainy' | 'snowy' | 'unknown';
  mood: string;
  composition: string[];
  colorPalette: 'warm' | 'cool' | 'neutral' | 'high contrast' | 'monochrome';
};

export type DateFilter =
  | { type: 'all' }
  | { type: 'preset'; days: 7 | 30 | 365 }
  | { type: 'custom'; from: Date; to: Date };

export type TagFilter = Record<string, string[]>;

export type FilterState = {
  date: DateFilter;
  tags: TagFilter;
};

export const FILTER_CATEGORIES = [
  'setting',
  'timeOfDay',
  'weather',
  'colorPalette',
  'composition',
] as const;

export type FilterCategory = (typeof FILTER_CATEGORIES)[number];

export const CATEGORY_LABELS: Record<FilterCategory, string> = {
  setting: 'Setting',
  timeOfDay: 'Time of Day',
  weather: 'Weather',
  colorPalette: 'Color Palette',
  composition: 'Composition',
};

export const CATEGORY_OPTIONS: Record<FilterCategory, string[]> = {
  setting: ['indoor', 'outdoor', 'studio'],
  timeOfDay: ['dawn', 'morning', 'midday', 'afternoon', 'golden hour', 'dusk', 'night'],
  weather: ['clear', 'overcast', 'foggy', 'rainy', 'snowy'],
  colorPalette: ['warm', 'cool', 'neutral', 'high contrast', 'monochrome'],
  composition: ['rule of thirds', 'leading lines', 'symmetry', 'framing', 'negative space', 'patterns'],
};
