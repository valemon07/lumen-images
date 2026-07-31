import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { sendPhotoToDatabase } from "@/app/lib/actions";

export async function POST(request: Request) {
  try {
    const region = process.env.AWS_REGION;
    const bucket = process.env.AWS_BUCKET_NAME;

    if (!region || !bucket) {
      return Response.json(
        { error: "Missing AWS_REGION or AWS_BUCKET_NAME" },
        { status: 500 },
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }

    const filename = (formData.get("filename") as string) || file.name;
    const fileType = (formData.get("fileType") as string) || file.type;
    const fileSize = parseInt(formData.get("fileSize") as string) || file.size;
    const lastModified = new Date(
      parseInt(formData.get("lastModified") as string) || file.lastModified,
    );
    const width = parseInt(formData.get("width") as string) || undefined;
    const height = parseInt(formData.get("height") as string) || undefined;
    const albumId = formData.get("albumId") as string || undefined;

    const s3Key = uuidv4();
    const bytes = await file.arrayBuffer();

    const client = new S3Client({ region });
    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: s3Key,
        Body: new Uint8Array(bytes),
        ContentType: fileType,
      }),
    );

    await sendPhotoToDatabase(
      filename,
      fileSize,
      fileType,
      lastModified,
      s3Key,
      width,
      height,
      albumId,
    );

    return Response.json({ success: true, key: s3Key });
  } catch (error) {
    console.error("Upload error:", error);
    return Response.json({ error: error });
  }
}
