import { mysqlTable, int, bigint } from "drizzle-orm/mysql-core"

const allocations = mysqlTable("allocations", {
    id: int().primaryKey(),
    next_available: bigint("next_available", {mode: "number"}).notNull()
})

export default allocations;