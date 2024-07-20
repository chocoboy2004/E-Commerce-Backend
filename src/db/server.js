import mongoose from "mongoose";
import dotenv from "dotenv";
import DBName from "../constants.js";

dotenv.config({
    path: "./.env"
});

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DBName}`);
        console.log(`Success: ${connectionInstance.connection.host}/${DBName}`);
    } catch(error) {
        console.error(`ERROR: ${error}`);
    }
};

export default connectDB;