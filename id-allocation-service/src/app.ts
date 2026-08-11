import dotenv from "dotenv";
dotenv.config({
  path: "../.env",
  quiet: true,
});

import express from "express";
import { eq } from "drizzle-orm";
import type { Request, Response } from "express";
import db from "./db/dbConnection.js";
import allocations from "./db/schema.js";

const app = express();
const PORT = process.env.PORT || 8000;
const RANGE_SIZE = 5n;

app.use(express.json());

app.get("/health", function (req: Request, res: Response) {
  res.status(200).json("Server is healthy");
});

async function allocateRange(req: Request, res: Response) {
  const ranges = await db.transaction(async (tx) => {
    //Fetch the counter and lock that row
    const [row] = await tx
      .select()
      .from(allocations)
      .where(eq(allocations.id, 1))
      .for("update");

    if (!row) {
      throw new Error("Row doesn't exist");
    }

    const start = BigInt(row.next_available);
    const end = start + RANGE_SIZE - 1n;

    //update the row to point to next_available range
    await tx
      .update(allocations)
      .set({
        next_available: start + RANGE_SIZE,
      })
      .where(eq(allocations.id, 1));

    return { start, end };
  });

  return res.json({
    start: ranges.start.toString(),
    end: ranges.end.toString()
  });
}

//use post request when u are creating/allocating resources not get or put
app.post("/api/v1/ranges/allocate", allocateRange);

async function bootstrap() {
  try {
    app.listen(PORT, () => {
      console.log("Server is running on PORT:", PORT);
    });
  } catch (err: unknown) {
    if (err instanceof Error) console.log(err.message);
    else console.log("Unknown Error: ", err);

    process.exit(1);
  }
}

bootstrap();
