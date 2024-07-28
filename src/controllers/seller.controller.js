import AsyncHandler from "../utils/AsyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import Seller from "../models/seller.model.js";

const generateTokens = async (sellerId) => {
    try {
        const seller = await Seller.findById(sellerId).select("-password")
        const accessToken = seller.generateAccessToken()
        const refreshToken = seller.generateRefreshToken()
    
        seller.refreshToken = refreshToken
        await seller.save({ validateBeforeSave: false })
    
        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, `Error occurred while generating tokens: ${error}`)
    }
}

const register = AsyncHandler(async(req, res) => {
    const { fullname, email, phone, displayName, gstn, password, pickupLocation, pincode } = req.body

    if (!fullname || !email ||!phone ||!displayName ||!gstn ||!password ||!pickupLocation || !pincode) {
        throw new ApiError(400, "All fields are required")
    }

    if (fullname.trim() === "") {
        throw new ApiError(400, "Fullname cannot be empty")
    }
    if (email.trim() === "") {
        throw new ApiError(400, "Email cannot be empty")
    }
    if (!email.includes("@")) {
        throw new ApiError(400, "Invalid email format")
    }
    if (phone.toString().length !== 10) {
        throw new ApiError(400, "Invalid phone number")
    }
    if (displayName.trim() === "") {
        throw new ApiError(400, "Display name cannot be empty")
    }
    if (gstn.trim() === "") {
        throw new ApiError(400, "GSTN cannot be empty")
    }
    if (gstn.length !== 15) {
        throw new ApiError(400, "Invalid GSTN format")
    }
    if (password.trim() === "") {
        throw new ApiError(400, "Password cannot be empty")
    }
    if (password.length < 8) {
        throw new ApiError(400, "Password should be at least 8 characters long")
    }
    if (pickupLocation.trim() === "") {
        throw new ApiError(400, "Pickup location cannot be empty")
    }
    if (pickupLocation.length < 10) {
        throw new ApiError(400, "Pickup location should be at least 10 characters long")
    }
    if (pincode.toString().length !== 6) {
        throw new ApiError(400, "Invalid pincode")
    }

    const isRegisteredSeller = await Seller.findOne({
        $or: [{email}, {phone}, {gstn}]
    })
    if (isRegisteredSeller) {
        throw new ApiError(400, "Seller already registered")
    }

    const seller = await Seller.create({
        fullname: fullname.trim(),
        email: email.trim(),
        phone: Number(phone),
        displayName: displayName.trim(),
        gstn: gstn.trim(),
        password: password.trim(),
        pickupLocation: pickupLocation.trim(),
        pincode: Number(pincode)
    })

    const response = await Seller.findById(seller._id).select("-password")
    if (!response) {
        throw new ApiError(500, "Internal server error")
    }

    return res
    .status(201)
    .json(
        new ApiResponse(
            200,
            response,
            "Seller registered successfully",
        )
    )
})

const login = AsyncHandler(async(req, res) => {
    const { phone, password } = req.body

    if (!phone ||!password) {
        throw new ApiError(400, "Phone and password are required")
    }
    if (phone.toString().length !== 10) {
        throw new ApiError(400, "Invalid phone number")
    }
    if (password.trim() === "") {
        throw new ApiError(400, "Password cannot be empty")
    }
    if (password.length < 8) {
        throw new ApiError(400, "Password should be at least 8 characters long")
    }

    const isRegisterdSeller = await Seller.findOne({ phone: Number(phone) })
    if (!isRegisterdSeller) {
        throw new ApiError(400, "Seller is not registered")
    }
    const isPasswordCorrect = await isRegisterdSeller.validatePassword(password)
    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid password")
    }

    const { accessToken, refreshToken } = await generateTokens(isRegisterdSeller._id)
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {},
            "Seller logged in successfully"
        )
    )
})

const logout = AsyncHandler(async(req, res) => {
    await Seller.findByIdAndUpdate(
        req.seller._id,
        {
            $set: {
                refreshToken: null
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(201)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
        new ApiResponse(
            200,
            {},
            "Seller logged out successfully"
        )
    )
})

export {
    register,
    login,
    logout
}