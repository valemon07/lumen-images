"use server";

import { ImageType, TestType } from "@/app/lib/types";
import sql from "./db";

//TODO: return array?
export async function getImagesPerUserId(userId: string) {
  try {
    const data = await sql<
      ImageType[]
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

export async function getTestItems() {
  try {
    const data = await sql<TestType[]>`SELECT * FROM test_items`;
    const items = data.map((item) => ({
      ...item,
    }));
    return items;
  } catch (e) {
    console.error(e, "SQL Error: ");
    throw new Error("Failed to fetch test items");
  }
}
