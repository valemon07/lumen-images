// Server-only helper (deliberately NOT a "use server" module, so it is not
// exposed as a client-callable server action). Callers must have already
// verified that `userId` owns `photoId`.
import sql from "./db";
import { AnalysisResult } from "./types";

export async function insertPhotoTags(
  userId: string,
  photoId: string,
  analysis: AnalysisResult,
) {
  const owned = await sql<{ photo_id: string }[]>`
    SELECT photo_id FROM photos WHERE photo_id = ${photoId} AND user_id = ${userId}
  `;
  if (owned.length === 0) throw new Error("Photo not found or unauthorized");

  const categories: string[] = [];
  const labels: string[] = [];
  const add = (category: string, label: string) => {
    categories.push(category);
    labels.push(label);
  };

  analysis.subjects.forEach((s) => add("subjects", s));
  analysis.composition.forEach((c) => add("composition", c));
  add("setting", analysis.setting);
  add("timeOfDay", analysis.timeOfDay);
  add("weather", analysis.weather);
  add("mood", analysis.mood);
  add("colorPalette", analysis.colorPalette);

  await sql`
    INSERT INTO tags (photo_id, category, label)
    SELECT ${photoId}, c.category, c.label
    FROM UNNEST(${categories}::text[], ${labels}::text[]) AS c(category, label)
  `;
}
