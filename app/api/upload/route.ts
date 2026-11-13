import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { getAlbum } from "@/app/lib/actions";
import { auth } from "@/app/lib/auth";
import sql from "@/app/lib/db";
import { env } from "@/lib/env";

const metadataSchema = z.object({
  lastModified: z.coerce.date(),
  width: z.coerce.number().int().positive().optional(),
  height: z.coerce.number().int().positive().optional(),
  albumId: z.string().min(1).optional(),
});

async function sendPhotoToDatabase(
  userId: string,
  file: File,
  key: string,
  metadata: z.infer<typeof metadataSchema>,
) {
  await sql`
    INSERT INTO photos(file_name, user_id, file_size, file_type, last_modified, s3_key, width, height, album_id)
    VALUES (${file.name}, ${userId}, ${file.size}, ${file.type}, ${metadata.lastModified}, ${key}, ${metadata.width ?? null}, ${metadata.height ?? null}, ${metadata.albumId ?? null})
  `;
}

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return Response.json({ error: "Invalid form data" }, { status: 400 });
    }
    const file = formData.get("file");
    if (!(file instanceof File) || file.size === 0) {
      return Response.json({ error: "A nonempty image file is required" }, { status: 400 });
    }
    if (file.size > 20 * 1024 * 1024) {
      return Response.json({ error: "Maximum image size is 20 MiB" }, { status: 413 });
    }

    const metadata = metadataSchema.safeParse({
      lastModified: formData.has("lastModified")
        ? Number(formData.get("lastModified"))
        : file.lastModified,
      width: formData.get("width") ?? undefined,
      height: formData.get("height") ?? undefined,
      albumId: formData.get("albumId") ?? undefined,
    });
    if (!metadata.success) {
      return Response.json({ error: "Invalid photo metadata" }, { status: 400 });
    }

    // shortcut: signatures don't prove decodability; add decoding if stronger validation is needed.
    const signature = Buffer.from(await file.slice(0, 12).arrayBuffer());
    const validType =
      (file.type === "image/jpeg" && signature.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]))) ||
      (file.type === "image/png" && signature.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) ||
      (file.type === "image/webp" && signature.subarray(0, 4).equals(Buffer.from("RIFF")) && signature.subarray(8, 12).equals(Buffer.from("WEBP")));
    if (!validType) {
      return Response.json({ error: "Only JPEG, PNG, and WebP images are supported" }, { status: 400 });
    }
    if (metadata.data.albumId && !(await getAlbum(metadata.data.albumId))) {
      return Response.json({ error: "Album not found" }, { status: 404 });
    }

    const s3Key = uuidv4();
    const client = new S3Client({ region: env.AWS_REGION });
    await client.send(new PutObjectCommand({
      Bucket: env.AWS_BUCKET_NAME,
      Key: s3Key,
      Body: new Uint8Array(await file.arrayBuffer()),
      ContentType: file.type,
    }));
    try {
      await sendPhotoToDatabase(session.user.id, file, s3Key, metadata.data);
    } catch (error) {
      try {
        await client.send(new DeleteObjectCommand({ Bucket: env.AWS_BUCKET_NAME, Key: s3Key }));
      } catch (cleanupError) {
        // shortcut: failed cleanup leaves an orphan; add reconciliation if this recurs.
        console.error("Upload cleanup failed:", cleanupError);
      }
      throw error;
    }

    return Response.json({ success: true, key: s3Key });
  } catch (error) {
    console.error("Upload error:", error);
    return Response.json({ error: "Upload failed" }, { status: 500 });
  }
}
