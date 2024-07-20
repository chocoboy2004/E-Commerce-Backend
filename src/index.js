import dotenv from "dotenv";
import connectDB from "./db/server.js";

dotenv.config();

connectDB();