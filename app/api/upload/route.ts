import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { S3Client } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { sendImageToDatabase } from "@/app/lib/actions";

export async function POST(request: Request) {
  const { filename, contentType } = await request.json();

  try {
    const region = process.env.AWS_REGION;
    const bucket = process.env.AWS_BUCKET_NAME;

    if (!region || !bucket) {
      return Response.json(
        { error: "Missing AWS_REGION or AWS_BUCKET_NAME" },
        { status: 500 },
      );
    }

    const client = new S3Client({ region });
    const s3Key = uuidv4();
    const { url, fields } = await createPresignedPost(client, {
      Bucket: bucket,
      Key: s3Key,
      Conditions: [
        ["content-length-range", 0, 10485760], // up to 10 MB
        ["starts-with", "$Content-Type", contentType],
      ],
      Fields: {
        acl: "public-read",
        "Content-Type": contentType,
      },
      Expires: 600, // Seconds before the presigned post expires. 3600 by default.
    });
    await sendImageToDatabase(filename, s3Key);

    return Response.json({ url, fields });
  } catch (error) {
    return Response.json({ error: error });
  }
}
