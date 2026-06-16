import sql from "@/app/lib/db";
import { z } from "zod";

export default function Page() {
  async function createTestObject(formData: FormData) {
    "use server";

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

  return (
    <main className="flex justify-center items-center">
      <form
        action={createTestObject}
        className="flex flex-col justify-center items-center"
      >
        <label htmlFor="name">Name of test object</label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="enter name"
          className="border-zinc-400 border-x border-y"
        />
        <input
          name="submit"
          value="create new test"
          type="submit"
          className="border-x border-y border-zinc-400 bg-zinc-600"
        ></input>
      </form>
    </main>
  );
}
