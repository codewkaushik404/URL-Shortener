import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("Database URL not found");
}

const db = drizzle(url);
export default db;
