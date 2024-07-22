import AsyncHandler from "../utils/AsyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import User from "../models/user.model.js";

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

export {
    registerUser
}