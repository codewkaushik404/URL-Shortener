import db from "../db/dbConnection.js";
import allocations from "../db/schema.js";
import { sql, eq } from "drizzle-orm";

await db.insert(allocations)
.values({
    id: 1,
    next_available: BigInt(2**41)
})
.onDuplicateKeyUpdate({
    set:{
        id: sql`id`
    }
});

const [exists] = await db.select().from(allocations).where(eq(allocations.id, 1));
if(!exists){
    throw new Error("Failed to initialize allocation row");
}

console.log("Allocation row id=1 verified");
process.exit(0);