import type { Request, Response } from "express";
import { getNextId } from "./services/rangeManager.js";
import BASE62 from "./base62.js";
import db from "./database/dbConnection.js";
import urls from "./database/schema/urlSchema.js";
import ApiError from "./utils/ApiError.js";
import ApiResponse from "./utils/ApiResponse.js";
import client from "./redis/client.js";

export async function createShortUrl(req: Request, res: Response){

    const {original_url, expiry_days} = req.body;
    const expiry = new Date();
    const days = Number(expiry_days) ?? 365;
    if(days < 1 || days > 365){
        throw new ApiError(400, "Days must be between 1 and 365");
    }

    expiry.setDate(expiry.getDate() + days);

    const id = await getNextId();
    const short_code = BASE62.encode(BigInt(id));

    await db.insert(urls).values({
        shortId: short_code,
        originalUrl: original_url,
        userId: req.user?.id ?? null,
        expiredAt: expiry
    });

    //url structure -> req.protocol://req.hostname(only domain name no port)/req.path
    //Use req.get("host") when you need the full host with port (example.com:5000); 
    // use req.hostname when you only need the domain (example.com).
    const data = {
        short_code,
        short_url: `${req.protocol}://${req.get("host")}/${short_code}`,
        original_url
    }

    if(!client.isReady){
        throw new ApiError(503, "Redis client unavailable");
    }
    await client.set(`urls:${short_code}`, original_url);

    return res.status(201).json(
        new ApiResponse(201, "Short Url created successfully", data)
    );

}

export async function getUrl(req: Request, res:Response){
    
}