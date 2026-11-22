// Landing-page sample photos.
//
// Drop your own photos into `public/landing/` using the file names below.
// Until a file exists, its slot renders as an empty mount labelled with the
// file name it is waiting for.
//
// The tags are SAMPLE readings written by hand in the exact shape and
// vocabulary `/api/analyze` returns. Once your photos are in, replace them
// with what Lumen actually returned for each photo.

export type SampleReading = {
  subjects: string[];
  setting: "indoor" | "outdoor" | "studio";
  timeOfDay: string;
  weather: string;
  mood: string;
  composition: string[];
  colorPalette: string;
};

export type SamplePhoto = {
  file: string;
  alt: string;
  orientation: "landscape" | "portrait";
  reading: SampleReading;
};

export const samplePhotos: SamplePhoto[] = [
  {
    file: "harbour.jpg",
    alt: "Fishing boat moored against a harbour wall on a grey morning",
    orientation: "landscape",
    reading: {
      subjects: ["fishing boat", "harbour wall", "gulls"],
      setting: "outdoor",
      timeOfDay: "morning",
      weather: "overcast",
      mood: "quiet",
      composition: ["leading lines", "wide angle"],
      colorPalette: "cool",
    },
  },
  {
    file: "street.jpg",
    alt: "Cyclist crossing a wet street under shop signs",
    orientation: "portrait",
    reading: {
      subjects: ["cyclist", "street", "shop signs"],
      setting: "outdoor",
      timeOfDay: "afternoon",
      weather: "rainy",
      mood: "hurried",
      composition: ["rule of thirds"],
      colorPalette: "high contrast",
    },
  },
  {
    file: "field.jpg",
    alt: "Lone tree in a field with low sun behind it",
    orientation: "landscape",
    reading: {
      subjects: ["tree", "field"],
      setting: "outdoor",
      timeOfDay: "golden hour",
      weather: "clear",
      mood: "calm",
      composition: ["silhouette", "rule of thirds"],
      colorPalette: "warm",
    },
  },
  {
    file: "portrait.jpg",
    alt: "Person by a window, face half in shadow",
    orientation: "portrait",
    reading: {
      subjects: ["person", "window"],
      setting: "indoor",
      timeOfDay: "afternoon",
      weather: "overcast",
      mood: "thoughtful",
      composition: ["portrait", "bokeh"],
      colorPalette: "neutral",
    },
  },
  {
    file: "skyline.jpg",
    alt: "City skyline at dusk with lights coming on",
    orientation: "landscape",
    reading: {
      subjects: ["skyline", "towers"],
      setting: "outdoor",
      timeOfDay: "golden hour",
      weather: "clear",
      mood: "expectant",
      composition: ["symmetry", "wide angle"],
      colorPalette: "warm",
    },
  },
];

export const readingRows = (r: SampleReading) => [
  { label: "Subjects", value: r.subjects.join(", ") },
  { label: "Setting", value: r.setting },
  { label: "Time of day", value: r.timeOfDay },
  { label: "Weather", value: r.weather },
  { label: "Mood", value: r.mood },
  { label: "Composition", value: r.composition.join(", ") },
  { label: "Palette", value: r.colorPalette },
];
