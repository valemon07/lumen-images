"use server";
import sql from "./db";
import { auth } from "./auth";
import { headers } from "next/headers";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Photo } from "./types";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
});

export async function getPhotosPerUserId(userId: string): Promise<Photo[]> {
  try {
    const data = await sql<
      Photo[]
    >`SELECT * FROM photos WHERE user_id = ${userId}`;
    const photos = data.map((photo) => ({
      ...photo,
    }));
    return photos;
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
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) {
    const userId = session?.user.id;
    try {
      await sql`
        INSERT INTO photos(file_name, user_id, file_size, file_type, last_modified, s3_key)
        VALUES (${fileName}, ${userId}, ${fileSize}, ${fileType}, ${lastModified}, ${key})
        `;
    } catch (e) {
      console.error("Error uploading to db: ", e);
    }
  }
}

async function getPresignedPhotoUrl(photoKey: string) {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: photoKey, // e.g., "profiles/user-123.jpg"
  });

  // Generates a URL that expires in 3600 seconds (1 hour)
  const url: string = await getSignedUrl(s3Client, command, {
    expiresIn: 3600,
  });
  return url;
}

export async function getAllPresignedPhotos(userId: string) {
  //await new Promise((resolve) => setTimeout(resolve, 3000)); // REMOVE!
  const photos = await getPhotosPerUserId(userId);
  const photoUrls = await Promise.all(
    photos.map(async (photo) => {
      const key = photo.s3_key;
      const presignedPhotoUrl = await getPresignedPhotoUrl(key);
      return presignedPhotoUrl;
    }),
  );

  return { photos: photos, urls: photoUrls };
}

export async function deletePhoto(photo: Photo) {
  const response = await fetch(
    process.env.NEXT_PUBLIC_BASE_URL + "/api/delete",
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
