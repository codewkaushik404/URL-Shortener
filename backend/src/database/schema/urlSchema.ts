import { sql } from "drizzle-orm";
import { mysqlTable, varchar, int, datetime } from "drizzle-orm/mysql-core";
import users from "./userSchema.js";

//index is the third arg of mysqlTable
// short_id is a primary key so it is already indexed
const urls = mysqlTable("urls", {
  shortId: varchar("short_id", { length: 7 }).primaryKey(),
  originalUrl: varchar("original_url", { length: 2000 }).notNull(),
  userId: int("user_id").references(() => users.id, {
    onDelete: "set null",
    onUpdate: "cascade"
  }),
  createdAt: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
  expiredAt: datetime().notNull(),
})

export default urls;
