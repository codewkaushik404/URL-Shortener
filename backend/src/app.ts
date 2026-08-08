import dotenv from "dotenv";
dotenv.config({
    quiet: true
})
import express from "express";
import cors from "cors";

import { createShortUrl } from "./controller.js";
import asyncHandler from "./utils/asyncHandler.js";
import globalErrorHandler from "./utils/errorHandler.js";
import { createRedisClient } from "./redis/client.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    maxAge: 24*60*60
}));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/", (req, res)=>{
    res.send("Server is healthy");
})

//Receives long urls and converts them into short urls and returns it
app.post("/api/v1/urls", asyncHandler(createShortUrl));

//upon clicking the short url the user is redirected to the original long url
app.get("/:shortId", () => {

})

app.use(globalErrorHandler);

app.listen(PORT, async ()=>{
    await createRedisClient();
    console.log(`Server is running on PORT: ${process.env.PORT}`);
})
