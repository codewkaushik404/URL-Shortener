import db from "../db/dbConnection.js";
import allocations from "../db/schema.js";

const existing = await db.select().from(allocations);

if(existing.length === 0){
    await db.insert(allocations).values({
        id: 1,
        next_available: 0
    });

    console.log("Seeding completed");
}

process.exit(0);