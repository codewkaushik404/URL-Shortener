import { sql } from "drizzle-orm";
import { datetime, int, mysqlTable, varchar } from "drizzle-orm/mysql-core";

const users = mysqlTable("users", {
  id: int().autoincrement().primaryKey(),
  email: varchar({length: 40}).notNull().unique(),
  username: varchar({length: 20}).notNull(),
  createdAt: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
})

export type User = typeof users.$inferSelect
export default users;
