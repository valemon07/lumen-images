import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import sql from "@/app/lib/db";
import { GoogleGenAI } from "@google/genai";
import { z } from "zod";

const ai = new GoogleGenAI({});

const analysisSchema = z.object({
  placeholder: z.string(),
});

const PLACEHOLDER_PROMPT = "Analyze this image and return structured data.";

async function analyzeWithGemini(
  base64: string,
  mimeType: string,
  prompt: string,
  schema: z.ZodSchema,
) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        inlineData: { mimeType, data: base64 },
        text: prompt,
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: schema,
    },
  });
  return JSON.parse(response.text ?? "{}");
}

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { photoId } = await request.json();

    if (!photoId) {
      return Response.json({ error: "photoId is required" }, { status: 400 });
    }

    const photos = await sql<{ s3_key: string }[]>`
      SELECT s3_key FROM photos WHERE photo_id = ${photoId} AND user_id = ${session.user.id}
    `;

    if (photos.length === 0) {
      return Response.json(
        { error: "Photo not found or unauthorized" },
        { status: 404 },
      );
    }

    const { s3_key } = photos[0];

    const region = process.env.AWS_REGION;
    const bucket = process.env.AWS_BUCKET_NAME;

    if (!region || !bucket) {
      return Response.json(
        { error: "Missing AWS_REGION or AWS_BUCKET_NAME" },
        { status: 500 },
      );
    }

    const client = new S3Client({ region });
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: s3_key,
    });

    const response = await client.send(command);

    if (!response.Body) {
      return Response.json(
        { error: "Failed to retrieve image from S3" },
        { status: 500 },
      );
    }

    const chunks: Uint8Array[] = [];
    for await (const chunk of response.Body as AsyncIterable<Uint8Array>) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);
    const base64 = buffer.toString("base64");

    console.log(
      "Successfully converted photo",
      photoId,
      "to base64 (length:",
      base64.length,
      ")",
    );

    const mimeType = response.ContentType || "image/jpeg";
    const result = await analyzeWithGemini(
      base64,
      mimeType,
      PLACEHOLDER_PROMPT,
      analysisSchema,
    );

    return Response.json(result);
  } catch (error) {
    console.error("Analyze error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
