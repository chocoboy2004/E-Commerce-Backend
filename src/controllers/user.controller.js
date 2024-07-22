import AsyncHandler from "../utils/AsyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import User from "../models/user.model.js";

const registerUser = AsyncHandler(async(req, res) => {
    return res.send("Hello World")
})

export {
    registerUser
}