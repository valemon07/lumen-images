import postgres from "postgres";
import { env } from "@/lib/env";

const connectionString = env.DATABASE_URL;
const sql = postgres(connectionString, { ssl: "require" });

export default sql;
