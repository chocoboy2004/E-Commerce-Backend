import AsyncHandler from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import Seller from "../models/seller.model.js";
import jwt from "jsonwebtoken"

const verifySeller = AsyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        if (!token) {
            throw new ApiError(401, "Login session has expired")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const seller = await Seller.findById(decodedToken._id).select("-password -refreshToken")
    
        if (!seller) {
            throw new ApiError(401, "Invalid access token")
        }
    
        req.seller = seller
        next()
    } catch (error) {
        throw new ApiError(401, `sellerAuth :: ERROR: ${error?.message}`)
    }
})

export default verifySeller