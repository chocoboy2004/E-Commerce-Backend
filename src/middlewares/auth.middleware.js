import AsyncHandler from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

const verifyJWT = AsyncHandler(async(req, res, next) => {
    const accessToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    if (!accessToken) {
        throw new ApiError(401, "Access token is required")
    }

    const response = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
    const user = await User.findById(response._id).select("-password -refreshToken")

    if (!user) {
        throw new ApiError(401, "Invalid access token")
    }

    req.user = user
    next()
})

export default verifyJWT