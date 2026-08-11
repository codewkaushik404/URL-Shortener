import type { Request, Response } from "express";
import { getNextId } from "./services/rangeManager.js";
import BASE62 from "./base62.js";
import {writeDB} from "./database/dbConnection.js";
import urls from "./database/schema/urlSchema.js";
import ApiError from "./utils/ApiError.js";
import ApiResponse from "./utils/ApiResponse.js";
import client from "./redis/client.js";
import { and, eq, gte } from "drizzle-orm";
import setUrlCache from "./helpers/setCache.js";

export async function createShortUrl(req: Request, res: Response){

    const {original_url, expiry_days} = req.body;
    const expiry = new Date();
    const days = Number(expiry_days) ?? 365;
    if(days < 1 || days > 365){
        throw new ApiError(400, "Days must be between 1 and 365");
    }

    expiry.setDate(expiry.getDate() + days);

    const id = await getNextId();
    const shortId = BASE62.encode(BigInt(id));
    
    await writeDB.insert(urls).values({
        shortId,
        originalUrl: original_url,
        userId: req.user?.id ?? null,
        expiredAt: expiry
    });

    //url structure -> req.protocol://req.hostname(only domain name no port)/req.path
    //Use req.get("host") when you need the full host with port (example.com:5000); 
    // use req.hostname when you only need the domain (example.com).
    const data = {
        short_id: shortId,
        short_url: `${req.protocol}://${req.get("host")}/${shortId}`,
        original_url
    }

    await setUrlCache(shortId, original_url);
    return res.status(201).json(
        new ApiResponse(201, "Short Url created successfully", data)
    );

}

export async function getUrl(req: Request, res:Response){
    const shortId = req.params.shortId;
    if(typeof shortId !== "string") throw new ApiError(400, "Invalid shortId received");

    let original_url: string | null = null;
    if(client.isReady) original_url = await client.get(`urls:${shortId}`);
    if(!original_url){
        const [result] = await writeDB.select().from(urls)
        .where(
            and(
                eq(urls.shortId, shortId),
                gte(urls.expiredAt, new Date())
            )
        );
        //here result returns either object or undefined 
        if(!result) throw new ApiError(404, "ShortId not found");

        original_url = result.originalUrl!;     
        await setUrlCache(shortId, original_url, result.expiredAt!);   
    }

    return res.redirect(302, original_url);
}