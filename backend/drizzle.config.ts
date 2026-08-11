import "dotenv/config";
import { defineConfig } from "drizzle-kit"

export default defineConfig({
  out: "./src/drizzle",
  schema: "./src/database/schema",
  dialect: "mysql",
  dbCredentials: {
    url: process.env.WRITE_DATABASE_URL!
  }
})
