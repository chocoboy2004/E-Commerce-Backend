import AsyncHandler from "../utils/AsyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

const register = AsyncHandler(async(req, res) => {
    res.send("Hello World")
})

export {
    register
}