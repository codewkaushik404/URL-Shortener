import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("DATABASE_URL environment variable is required");
}

const db = drizzle(url);
export default db;