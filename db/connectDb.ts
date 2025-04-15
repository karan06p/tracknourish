import mongoose, { Connection } from "mongoose"
import dotenv from "dotenv"

dotenv.config()
const uri = process.env.MONGODB_URI!;
let cachedConnection: Connection | null = null;

export const connectToDB = async () => {
    const options = {
        maxPoolSize: 10,
        bufferCommands: true
    }

    if(cachedConnection) return cachedConnection;

    try {
        const conn = await mongoose.connect(uri, options);
        cachedConnection = conn.connection;
        return cachedConnection;
    } catch (error) {
        throw error;
    }
}
