"use server";
import { User } from "./types";
import sql from "./db";
import { auth } from "./auth";
import { headers } from "next/headers";

export const uploadImage = async (file: File) => {
  if (!file) {
    alert("Please select a file to upload.");
    return;
  }

  const response = await fetch(
    process.env.NEXT_PUBLIC_BASE_URL + "/api/upload",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ filename: file.name, contentType: file.type }),
    },
  );

  if (response.ok) {
    const { url, fields } = await response.json();

    const formData = new FormData();
    Object.entries(fields).forEach(([key, value]) => {
      formData.append(key, value as string);
    });
    formData.append("file", file);

    const uploadResponse = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (uploadResponse.ok) {
      alert("Upload successful!");
    } else {
      console.error("S3 Upload Error:", uploadResponse);
      alert("Upload failed.");
    }
  } else {
    alert("Failed to get pre-signed URL.");
  }
};

export async function sendImageToDatabase(fileName: string, key: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) {
    const userId = session?.user.id;
    const fileUrl = `https://${process.env.BUCKET_NAME}://${key}`;
    try {
      await sql`
        INSERT INTO images(file_name, s3_url, user_id)
        VALUES (${fileName}, ${fileUrl}, ${userId})
        `;
    } catch (e) {
      return `Error uploading to database: ${e}`;
    }
  }
}
