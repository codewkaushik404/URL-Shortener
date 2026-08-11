import "dotenv/config";
import { drizzle, MySql2Database } from "drizzle-orm/mysql2";
import mysql from "mysql2";

const write_url = process.env.WRITE_DATABASE_URL;
if (!write_url) {
  throw new Error("Database URL not found");
}

const write_pool = mysql.createPool({ uri: write_url });
export const writeDB: MySql2Database = drizzle({client: write_pool})

