import { S3Client } from "@aws-sdk/client-s3";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

export async function POST(request: Request) {
  const { key } = await request.json();

  try {
    const region = process.env.AWS_REGION;
    const bucket = process.env.AWS_BUCKET_NAME;

    if (!region || !bucket) {
      return Response.json(
        { error: "Missing AWS_REGION or AWS_BUCKET_NAME" },
        { status: 500 },
      );
    }

    const bucketParams = { Bucket: bucket, Key: key };
    const client = new S3Client({ region });
    const data = await client.send(new DeleteObjectCommand(bucketParams));
    console.log("Success. Object deleted.");
    return Response.json({ data });
  } catch (error) {
    console.log(error);
    return Response.json({ error: error });
  }
}
