// Landing-page sample photos.
//
// The photos in `public/landing/` are Unsplash stock (see CREDITS.md there);
// swap in your own using the same file names. Until a file exists, its slot
// renders as an empty mount labelled with the file name it is waiting for.
//
// The tags are SAMPLE readings written by hand in the exact shape and
// vocabulary `/api/analyze` returns. Once you run the real photos through
// Lumen, replace them with what it actually returned.

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
    alt: "Work boat heading out over grey water with gulls wheeling around it",
    orientation: "landscape",
    reading: {
      subjects: ["boat", "gulls", "sea"],
      setting: "outdoor",
      timeOfDay: "morning",
      weather: "overcast",
      mood: "restless",
      composition: ["rule of thirds", "wide angle"],
      colorPalette: "cool",
    },
  },
  {
    file: "street.jpg",
    alt: "Cyclist in a clear rain poncho riding down a wet street past a shopfront",
    orientation: "portrait",
    reading: {
      subjects: ["cyclist", "rain poncho", "shopfront"],
      setting: "outdoor",
      timeOfDay: "afternoon",
      weather: "rainy",
      mood: "determined",
      composition: ["rule of thirds"],
      colorPalette: "high contrast",
    },
  },
  {
    file: "field.jpg",
    alt: "Lone tree in a grass field with the low sun directly behind its trunk",
    orientation: "landscape",
    reading: {
      subjects: ["tree", "field", "sun"],
      setting: "outdoor",
      timeOfDay: "golden hour",
      weather: "clear",
      mood: "calm",
      composition: ["silhouette", "symmetry"],
      colorPalette: "high contrast",
    },
  },
  {
    file: "portrait.jpg",
    alt: "Woman in a red hat by a window, half her face in shadow",
    orientation: "portrait",
    reading: {
      subjects: ["woman", "red hat", "window"],
      setting: "indoor",
      timeOfDay: "afternoon",
      weather: "unknown",
      mood: "pensive",
      composition: ["portrait", "rule of thirds"],
      colorPalette: "high contrast",
    },
  },
  {
    file: "skyline.jpg",
    alt: "City skyline across a river at dusk, lights coming on and reflected in the water",
    orientation: "landscape",
    reading: {
      subjects: ["skyline", "river", "towers"],
      setting: "outdoor",
      timeOfDay: "dusk",
      weather: "clear",
      mood: "quiet",
      composition: ["wide angle"],
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
