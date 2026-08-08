import "dotenv/config";
import {createClient} from "redis";

const client = createClient({
    url: process.env.REDIS_URL!
})

client.on("error", (err) => {
    console.error("Redis Error:", err);
});

export async function createRedisClient() {
    await client.connect();    
    console.log("Redis connected");
}

export default client;


