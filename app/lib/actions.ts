"use server";
import sql from "./db";
import { auth } from "./auth";
import { headers } from "next/headers";

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
