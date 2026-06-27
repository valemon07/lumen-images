"use server";
import sql from "./db";
import { auth } from "./auth";
import { headers } from "next/headers";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getImagesPerUserId } from "./data";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
});

export async function sendImageToDatabase(fileName: string, key: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) {
    const userId = session?.user.id;
    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}://${key}`;
    try {
      await sql`
        INSERT INTO images(file_name, s3_url, user_id)
        VALUES (${fileName}, ${fileUrl}, ${userId})
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
      const key = image.s3_url.substring(image.s3_url.lastIndexOf("/") + 1);
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
    
    return "Delete successful";
  } else {
    console.log("Failed to delete image");
  }
}
