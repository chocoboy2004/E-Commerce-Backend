import AsyncHandler from "../utils/AsyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import User from "../models/user.model.js";

const generateTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
    
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })
    
        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, `Error occurred while generating tokens: ${error}`)
    }
}

const registerUser = AsyncHandler(async(req, res) => {
    /*
    1. Take firstname, lastname, gender, phone, email and password from req.body object.
    2. Validate input fields by applying appropriate conditions.
    3. Check if email or phone already exists in the database.
    4. If exists, throw an error. Otherwise, follow the below steps.
    5. Create a new user.
    6. Fetch the newly created user's details from the database.
    7. If the user created successfully, return a response with status code 201 along with the user's details.
    8. Otherwise, throw an error.
    */

    const {firstname, lastname, gender, phone, email, password} = req.body

    if (!firstname ||!lastname ||!gender ||!phone ||!email ||!password) {
        throw new ApiError(400, "All fields are required")
    }
    if (firstname.trim().length < 1) {
        throw new ApiError(400, "Firstname should not be empty")
    }
    if (lastname.trim().length < 1) {
        throw new ApiError(400, "Lastname should not be empty")
    }
    if (gender.trim() !== "male" && gender.trim() !== "female" && gender.trim() !== "others") {
        throw new ApiError(400, "Invalid gender")
    }
    if (phone.toString().length !== 10) {
        throw new ApiError(400, "Invalid phone number")
    }
    if (email.trim().includes("@") !== true) {
        throw new ApiError(400, "Invalid email")
    }
    if (password.trim().length < 8) {
        throw new ApiError(400, "Password should be at least 8 characters long")
    }

    const isExistedUser = await User.findOne({
        $or: [ {email}, {phone} ]
    })

    if (isExistedUser) {
        throw new ApiError(400, "Email or phone already exists! Please go for login")
    }

    const user = await User.create({
        firstname: firstname.trim(),
        lastname: lastname.trim(),
        gender: gender.trim().toLowerCase(),
        phone: Number(phone),
        email: email.trim().toLowerCase(),
        password: password.trim()
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken")
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while creating user")
    }

    return res
    .status(201)
    .json(
        new ApiResponse(
            200,
            createdUser,
            "User registered successfully"
        )
    )
})

const loginUser = AsyncHandler(async(req, res) => {
    const { phone, email, password } = req.body

    if (!phone && !email) {
        throw new ApiError(400, "Phone or email is required")
    }
    if (phone && phone.toString().length !== 10) {
        throw new ApiError(400, "Invalid phone number")
    }
    if (email && email.trim().includes("@") !== true) {
        throw new ApiError(400, "Invalid email")
    }
    if (!password) {
        throw new ApiError(400, "Password is required")
    }
    if (password.trim().length < 8) {
        throw new ApiError(400, "Password should be at least 8 characters long")
    }

    const existedUser = await User.findOne({ $or: [ {phone}, {email} ] })
    if (!existedUser) {
        throw new ApiError(400, "Invalid email or phone")
    }

    const isPasswordCorrect = await existedUser.validatePassword(password)
    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid password")
    }

    const { accessToken, refreshToken } = await generateTokens(existedUser._id)

    const user = await User.findById(existedUser._id).select("-password -refreshToken")

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
            user,
            "User logged in successfully"
        )
    )
})


export {
    registerUser,
    loginUser
}