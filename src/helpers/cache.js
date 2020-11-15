import { createClient } from "redis";
import env from "../env";

const getRedisConnection = () => {
    const client = createClient({host: env.REDIS_HOST, port: env.REDIS_PORT, password: env.REDIS_PASSWORD})

    client.on("error", (error) => {
        console.error("Redis error : " + error);
    });

    return client
}

export {
    getRedisConnection
}
