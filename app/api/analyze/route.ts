import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import sql from "@/app/lib/db";
import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { insertPhotoTags } from "@/app/lib/actions";
import { env } from "@/lib/env";

const ai = new GoogleGenAI({ apiKey: env.GOOGLE_API_KEY });
const s3Client = new S3Client({ region: env.AWS_REGION });

const MAX_IMAGE_SIZE = 20 * 1024 * 1024; // 20MB

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 10; // 10 requests per minute per user

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return false;
  }

  record.count++;
  return true;
}

function getRateLimitKey(sessionUserId: string, ip?: string): string {
  return `analyze:${sessionUserId}:${ip || "unknown"}`;
}

const analysisSchema = z.object({
  subjects: z.array(z.string()).max(5),
  setting: z.enum(["indoor", "outdoor", "studio", "unknown"]),
  timeOfDay: z.enum([
    "dawn",
    "morning",
    "midday",
    "afternoon",
    "golden hour",
    "dusk",
    "night",
    "unknown",
  ]),
  weather: z.enum(["clear", "overcast", "foggy", "rainy", "snowy", "unknown"]),
  mood: z.string(),
  composition: z.array(
    z.enum([
      "rule of thirds",
      "leading lines",
      "symmetry",
      "bokeh",
      "silhouette",
      "long exposure",
      "macro",
      "wide angle",
      "portrait",
    ]),
  ),
  colorPalette: z.enum([
    "warm",
    "cool",
    "neutral",
    "high contrast",
    "monochrome",
  ]),
});

const PROMPT = `You are analyzing a photograph for a photography journal app.
Return a JSON object analyzing the following dimensions:

- subjects: array of the main subjects (e.g. "cat", "skyline", "flower", "person"). 
  Be specific but not overly granular. Maximum 5 items.
  
- setting: one of ["indoor", "outdoor", "studio", "unknown"]

- timeOfDay: one of ["dawn", "morning", "midday", "afternoon", 
  "golden hour", "dusk", "night", "unknown"]
  
- weather: one of ["clear" , "overcast", "foggy", "rainy", 
  "snowy", "unknown"] — return "unknown" if indoor or not applicable
  
- mood: single word describing the emotional tone of the image

- composition: array of applicable techniques from 
  ["rule of thirds", "leading lines", "symmetry", "bokeh", 
  "silhouette", "long exposure", "macro", "wide angle", "portrait"]
  
- colorPalette: one of ["warm", "cool", "neutral", "high contrast", "monochrome"]

Return ONLY the JSON object. No explanation, no markdown fences.`;

async function analyzeWithGemini(
  base64: string,
  mimeType: string,
  prompt: string,
  schema: z.ZodSchema,
) {
  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }, { inlineData: { mimeType, data: base64 } }],
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseJsonSchema: z.toJSONSchema(schema),
    },
  });
  return JSON.parse(response.text ?? "{}");
}

const photoIdSchema = z.string().uuid();

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const headersList = await headers();
    const ip =
      headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      headersList.get("x-real-ip") ||
      "unknown";

    const rateLimitKey = getRateLimitKey(session.user.id, ip);
    if (!checkRateLimit(rateLimitKey)) {
      return Response.json(
        { error: "Rate limit exceeded. Try again later." },
        { status: 429 },
      );
    }

    const { photoId } = await request.json();

    const photoIdResult = photoIdSchema.safeParse(photoId);
    if (!photoIdResult.success) {
      return Response.json(
        { error: "Invalid photoId format" },
        { status: 400 },
      );
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

    const region = env.AWS_REGION;
    const bucket = env.AWS_BUCKET_NAME;

    if (!region || !bucket) {
      return Response.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: s3_key,
    });

    const response = await s3Client.send(command);

    if (!response.Body) {
      return Response.json(
        { error: "Failed to retrieve image from S3" },
        { status: 500 },
      );
    }

    if (response.ContentLength && response.ContentLength > MAX_IMAGE_SIZE) {
      return Response.json(
        { error: "Image too large. Maximum size is 10MB." },
        { status: 413 },
      );
    }

    const chunks: Uint8Array[] = [];
    let totalSize = 0;
    for await (const chunk of response.Body as AsyncIterable<Uint8Array>) {
      totalSize += chunk.length;
      if (totalSize > MAX_IMAGE_SIZE) {
        return Response.json(
          { error: "Image too large. Maximum size is 10MB." },
          { status: 413 },
        );
      }
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
      PROMPT,
      analysisSchema,
    );

    await insertPhotoTags(photoId, result);

    return Response.json(result);
  } catch (error) {
    console.error("Analyze error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
