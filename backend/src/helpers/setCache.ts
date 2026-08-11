import client from "../redis/client.js";

export default async function setUrlCache(shortId: string, originalUrl: string, expiredAt?: Date){
    if(client.isReady){
        try{
            await client.set(`urls:${shortId}`, originalUrl, {
                expiration: {
                    type: "EX",
                    //1 hr
                    value: expiredAt 
                    ? Math.min(60*60, Math.floor(expiredAt.getTime() - new Date().getTime()/1000))
                    : 60*60
                }
            });
        }catch(err){
            //a durable worker queue that takes shortId and originalUrl, retries set cache in background
        }
    }
    else{
        //a durable worker queue that takes shortId and originalUrl, retries set cache in background
    }
}