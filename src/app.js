import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express()

app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))
app.use(express.static("public"))

app.use(cors({ origin: process.env.CORS }))
app.use(cookieParser())


// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

import userRoute from "./routes/user.route.js"
import sellerRoute from "./routes/seller.route.js"


app.use("/api/v1/user", userRoute)
app.use("/api/v1/seller", sellerRoute)

export default app