"use server";
import sql from "./db";
import { auth } from "./auth";
import { headers } from "next/headers";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { unstable_noStore } from "next/cache";
import { env } from "@/lib/env";
import {
  Album,
  AlbumWithPreviews,
  Photo,
  AnalysisResult,
  Tag,
  FilterState,
  DateFilter,
  TagFilter,
  InsightsData,
  CategoryStat,
} from "./types";

const s3Client = new S3Client({
  region: env.AWS_REGION,
});

function buildDateCondition(dateFilter: DateFilter | undefined): {
  from: Date | null;
  to: Date | null;
} {
  if (!dateFilter || dateFilter.type === "all") {
    return { from: null, to: null };
  }
  const now = new Date();
  if (dateFilter.type === "preset") {
    const daysAgo = new Date(now);
    daysAgo.setDate(now.getDate() - dateFilter.days);
    return { from: daysAgo, to: now };
  }
  return { from: dateFilter.from, to: dateFilter.to };
}

function buildTagConditions(
  tagFilter: TagFilter | undefined,
): { categories: string[]; labels: string[] } | null {
  if (!tagFilter || Object.keys(tagFilter).length === 0) {
    return null;
  }
  const categories: string[] = [];
  const labels: string[] = [];
  const excludedCategories = ["subjects", "mood"];

  for (const [category, labelList] of Object.entries(tagFilter)) {
    if (excludedCategories.includes(category)) continue;
    if (labelList.length === 0) continue;
    for (const label of labelList) {
      categories.push(category);
      labels.push(label);
    }
  }

  if (categories.length === 0) return null;
  return { categories, labels };
}

export async function getPhotosPerUserId(
  userId: string,
  filters?: FilterState,
): Promise<Photo[]> {
  try {
    const { from, to } = buildDateCondition(filters?.date);
    const tagConditions = buildTagConditions(filters?.tags);

    let query = sql`SELECT * FROM photos WHERE user_id = ${userId}`;

    if (from) {
      query = sql`${query} AND last_modified >= ${from}`;
    }
    if (to) {
      query = sql`${query} AND last_modified <= ${to}`;
    }
    if (tagConditions) {
      query = sql`${query} AND photo_id IN (
        SELECT DISTINCT photo_id FROM tags 
        WHERE category = ANY(${tagConditions.categories}) 
        AND label = ANY(${tagConditions.labels})
      )`;
    }

    query = sql`${query} ORDER BY last_modified DESC`;

    const data = (await query) as unknown as Photo[];
    return data.map((photo) => ({ ...photo }));
  } catch (e) {
    console.error(e, "SQL Error: ");
    throw new Error("Failed to fetch images");
  }
}

export async function sendPhotoToDatabase(
  fileName: string,
  fileSize: number,
  fileType: string,
  lastModified: Date,
  key: string,
  width?: number,
  height?: number,
  albumId?: string,
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (session) {
    const userId = session?.user.id;
    try {
      await sql`
        INSERT INTO photos(file_name, user_id, file_size, file_type, last_modified, s3_key, width, height, album_id)
        VALUES (${fileName}, ${userId}, ${fileSize}, ${fileType}, ${lastModified}, ${key}, ${width ?? null}, ${height ?? null}, ${albumId ?? null})
        `;
    } catch (e) {
      console.error("Error uploading to db: ", e);
    }
  }
}

async function getPresignedPhotoUrl(photoKey: string) {
  const command = new GetObjectCommand({
    Bucket: env.AWS_BUCKET_NAME,
    Key: photoKey,
  });

  // Generates a URL that expires in 3600 seconds (1 hour)
  const url: string = await getSignedUrl(s3Client, command, {
    expiresIn: 3600,
  });
  return url;
}

export async function getAllPresignedPhotos(
  userId: string,
  filters?: FilterState,
) {
  const photos = await getPhotosPerUserId(userId, filters);
  const photoUrls = await Promise.all(
    photos.map(async (photo) => {
      const key = photo.s3_key;
      const presignedPhotoUrl = await getPresignedPhotoUrl(key);
      return presignedPhotoUrl;
    }),
  );

  return { photos: photos, urls: photoUrls };
}

export async function getCurrentUserPhotos(filters?: FilterState) {
  unstable_noStore();
  const s = await auth.api.getSession({ headers: await headers() });
  if (!s) return null;
  return getAllPresignedPhotos(s.user.id, filters);
}

export async function refreshPresignedUrl(s3Key: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  const owned = await sql<Photo[]>`
    SELECT s3_key FROM photos WHERE s3_key=${s3Key} AND user_id=${session.user.id}
  `;
  if (owned.length === 0) return null;

  return getPresignedPhotoUrl(s3Key);
}

export async function deletePhoto(photo: Photo) {
  const response = await fetch(
    env.NEXT_PUBLIC_BASE_URL + "/api/delete",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ key: photo.s3_key }),
    },
  );
  if (response.ok) {
    try {
      console.log("deleting!");
      await sql`
        DELETE FROM photos WHERE s3_key=${photo.s3_key}
        `;
      console.log("deleted.");

      return "Delete successful";
    } catch (error) {
      console.log("SQL failure: ", error);
    }
  } else {
    console.log("Failed to delete image");
  }
}

export async function createAlbum(name: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (name && session) {
    try {
      const data = await sql<Album[]>`
      INSERT INTO albums(album_name, user_id) VALUES (${name}, ${session.user.id})
      `;
      return data.map((album) => ({ ...album }));
    } catch (e) {
      console.log("SQL failure ", e);
    }
  }
}

export async function updatePhotoAlbum(
  photoId: string,
  albumId: string | null,
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;
  try {
    await sql`
      UPDATE photos SET album_id = ${albumId}
      WHERE photo_id = ${photoId} AND user_id = ${session.user.id}
    `;
    return true;
  } catch (e) {
    console.error("Failed to update photo album: ", e);
    return null;
  }
}

export async function getCurrentUserAlbums() {
  const s = await auth.api.getSession({ headers: await headers() });
  if (!s) return null;
  try {
    const albums = await sql<
      Album[]
    >`SELECT * FROM albums WHERE user_id = ${s.user.id}`;
    return albums;
  } catch (e) {
    console.error(e, "SQL Error");
    throw new Error("Failed to fetch albums");
  }
}

export async function getCurrentUserAlbumsWithPreviews() {
  const s = await auth.api.getSession({ headers: await headers() });
  if (!s) return null;
  try {
    const albums = await sql<
      Album[]
    >`SELECT * FROM albums WHERE user_id = ${s.user.id}`;

    const photos = await sql<Photo[]>`
      SELECT * FROM photos
      WHERE user_id = ${s.user.id} AND album_id IS NOT NULL
    `;

    const albumsWithPreviews: AlbumWithPreviews[] = albums.map((album) => {
      const albumPhotos = photos
        .filter((photo) => photo.album_id === album.album_id)
        .sort(
          (a, b) =>
            new Date(b.last_modified).getTime() -
            new Date(a.last_modified).getTime(),
        );
      return {
        ...album,
        previews: albumPhotos.slice(0, 3).map((photo) => ({
          photo,
          url: "",
        })),
        photoCount: albumPhotos.length,
      };
    });

    const previewPhotos = albumsWithPreviews.flatMap((album) =>
      album.previews.map((preview) => ({
        albumId: album.album_id,
        preview,
      })),
    );
    const urls = await Promise.all(
      previewPhotos.map(({ preview }) =>
        getPresignedPhotoUrl(preview.photo.s3_key),
      ),
    );
    previewPhotos.forEach(({ preview }, i) => {
      preview.url = urls[i];
    });

    return albumsWithPreviews;
  } catch (e) {
    console.error(e, "SQL Error");
    throw new Error("Failed to fetch albums");
  }
}

export async function getAlbum(albumId: string) {
  const s = await auth.api.getSession({ headers: await headers() });
  if (!s) return null;
  const albums = await sql<Album[]>`
    SELECT * FROM albums WHERE album_id = ${albumId} AND user_id = ${s.user.id}
  `;
  return albums[0] ?? null;
}

export async function getAlbumPhotos(albumId: string, filters?: FilterState) {
  unstable_noStore();
  const s = await auth.api.getSession({ headers: await headers() });
  if (!s) return null;

  const { from, to } = buildDateCondition(filters?.date);
  const tagConditions = buildTagConditions(filters?.tags);

  let query = sql`SELECT * FROM photos WHERE album_id = ${albumId} AND user_id = ${s.user.id}`;

  if (from) {
    query = sql`${query} AND last_modified >= ${from}`;
  }
  if (to) {
    query = sql`${query} AND last_modified <= ${to}`;
  }
  if (tagConditions) {
    query = sql`${query} AND photo_id IN (
      SELECT DISTINCT photo_id FROM tags 
      WHERE category = ANY(${tagConditions.categories}) 
      AND label = ANY(${tagConditions.labels})
    )`;
  }

  query = sql`${query} ORDER BY last_modified DESC`;

  const photos = (await query) as unknown as Photo[];
  const urls = await Promise.all(
    photos.map((photo) => getPresignedPhotoUrl(photo.s3_key)),
  );
  return { photos, urls };
}

export async function insertPhotoTags(
  photoId: string,
  analysis: AnalysisResult,
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const owned = await sql<{ photo_id: string }[]>`
    SELECT photo_id FROM photos WHERE photo_id = ${photoId} AND user_id = ${session.user.id}
  `;
  if (owned.length === 0) throw new Error("Photo not found or unauthorized");

  const categories: string[] = [];
  const labels: string[] = [];

  analysis.subjects.forEach((s) => {
    categories.push("subjects");
    labels.push(s);
  });
  analysis.composition.forEach((c) => {
    categories.push("composition");
    labels.push(c);
  });

  categories.push("setting");
  labels.push(analysis.setting);

  categories.push("timeOfDay");
  labels.push(analysis.timeOfDay);

  categories.push("weather");
  labels.push(analysis.weather);

  categories.push("mood");
  labels.push(analysis.mood);

  categories.push("colorPalette");
  labels.push(analysis.colorPalette);

  await sql.begin(async (tx) => {
    await tx`
      INSERT INTO tags (photo_id, category, label)
      SELECT ${photoId}, c.category, c.label
      FROM UNNEST(${categories}::text[], ${labels}::text[]) AS c(category, label)
    `;
  });
}

export async function getPhotoTags(photoId: string): Promise<Tag[]> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const tags = await sql<Tag[]>`
    SELECT * FROM tags WHERE photo_id = ${photoId}
  `;
  return tags;
}

type TagCountRow = { label: string; count: number };

async function getCategoryStats(
  userId: string,
  category: string,
  taggedPhotos: number,
): Promise<CategoryStat[]> {
  const rows = await sql<TagCountRow[]>`
    SELECT label, COUNT(*) AS count
    FROM tags t
    JOIN photos p ON p.photo_id = t.photo_id
    WHERE p.user_id = ${userId} AND t.category = ${category}
    GROUP BY t.label
    ORDER BY count DESC
  `;
  return rows.map((row) => ({
    label: row.label,
    count: row.count,
    percentage:
      taggedPhotos > 0 ? Math.round((row.count / taggedPhotos) * 100) : 0,
  }));
}

async function getTopTags(
  userId: string,
  category: string,
  limit: number,
): Promise<{ label: string; count: number }[]> {
  return sql<TagCountRow[]>`
    SELECT label, COUNT(*) AS count
    FROM tags t
    JOIN photos p ON p.photo_id = t.photo_id
    WHERE p.user_id = ${userId} AND t.category = ${category}
    GROUP BY t.label
    ORDER BY count DESC
    LIMIT ${limit}
  `;
}

export async function getUserInsights(): Promise<InsightsData | null> {
  unstable_noStore();
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  const totalRows = await sql<{ count: number }[]>`
    SELECT COUNT(*) AS count FROM photos WHERE user_id = ${session.user.id}
  `;
  const totalPhotos = totalRows[0]?.count ?? 0;

  const taggedRows = await sql<{ count: number }[]>`
    SELECT COUNT(DISTINCT t.photo_id) AS count
    FROM tags t
    JOIN photos p ON p.photo_id = t.photo_id
    WHERE p.user_id = ${session.user.id}
  `;
  const taggedPhotos = taggedRows[0]?.count ?? 0;

  if (taggedPhotos === 0) {
    return {
      totalPhotos,
      taggedPhotos,
      perCategory: {
        setting: [],
        timeOfDay: [],
        weather: [],
        colorPalette: [],
        composition: [],
      },
      topSubjects: [],
      topMoods: [],
    };
  }

  const [setting, timeOfDay, weather, colorPalette, composition] =
    await Promise.all([
      getCategoryStats(session.user.id, "setting", taggedPhotos),
      getCategoryStats(session.user.id, "timeOfDay", taggedPhotos),
      getCategoryStats(session.user.id, "weather", taggedPhotos),
      getCategoryStats(session.user.id, "colorPalette", taggedPhotos),
      getCategoryStats(session.user.id, "composition", taggedPhotos),
    ]);

  const [topSubjects, topMoods] = await Promise.all([
    getTopTags(session.user.id, "subjects", 5),
    getTopTags(session.user.id, "mood", 5),
  ]);

  return {
    totalPhotos,
    taggedPhotos,
    perCategory: { setting, timeOfDay, weather, colorPalette, composition },
    topSubjects,
    topMoods,
  };
}
