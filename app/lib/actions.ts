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

export async function getImagesPerUserId(userId: string) {
  try {
    const data = await sql<
      Photo[]
    >`SELECT * FROM images WHERE user_id = ${userId}`;
    const images = data.map((image) => ({
      ...image,
    }));
    return images;
  } catch (e) {
    console.error(e, "SQL Error: ");
    throw new Error("Failed to fetch images");
  }
}

export async function sendImageToDatabase(
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
        INSERT INTO images(file_name, user_id, file_size, file_type, last_modified, s3_key)
        VALUES (${fileName}, ${userId}, ${fileSize}, ${fileType}, ${lastModified}, ${key})
        `;
    } catch (e) {
      console.error("Error uploading to db: ", e);
    }
  }
}

async function getPresignedImage(imageKey: string) {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: imageKey, // e.g., "profiles/user-123.jpg"
  });

  // Generates a URL that expires in 3600 seconds (1 hour)
  const url: string = await getSignedUrl(s3Client, command, {
    expiresIn: 3600,
  });
  return url;
}

export async function getAllPresignedImages(userId: string) {
  const images = await getImagesPerUserId(userId);
  const imageUrls = await Promise.all(
    images.map((image) => {
      // TODO: Change to not need the substring!
      const key = image.s3_key;
      return getPresignedImage(key);
    }),
  );
  return { images: images, urls: imageUrls };
}

export async function deleteImage(key: string) {
  const response = await fetch(
    process.env.NEXT_PUBLIC_BASE_URL + "/api/delete",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ key: key }),
    },
  );
  if (response.ok) {
    try {
      console.log("deleting!");
      await sql`
        DELETE FROM images WHERE s3_key=${key}
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
