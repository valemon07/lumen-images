"use server";

import sql from "@/app/lib/db";
import z from "zod";

export async function createTestObject(formData: FormData) {
  const schema = z.object({
    name: z.string({}),
  });
  const validatedFields = schema.safeParse({
    name: formData.get("name"),
  });
  if (!validatedFields.success) {
    return;
  }

  const { name } = validatedFields.data;

  try {
    await sql`
      INSERT INTO test_items(name) VALUES (${name})
      `;
  } catch (error) {
    console.log(error);
    return;
  }
}
