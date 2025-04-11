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

    if(cachedConnection){
        console.log("Using cached connection");
        return cachedConnection;
    }
    try {
        const conn = await mongoose.connect(uri, options);
        cachedConnection = conn.connection;
        console.log("New mongoDb connection established");
        return cachedConnection;
    } catch (error) {
        console.log(error);
        throw error;
    }
}
