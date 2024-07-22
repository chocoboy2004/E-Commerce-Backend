import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema({
    firstname: {
        type: String,
        required: [true, "Firstname is required"],
        trim: true
    },
    lastname: {
        type: String,
        required: [true, "Lastname is required"],
        trim: true
    },
    gender: {
        type: String,
        enum: ["male", "female", "others"],
        required: [true, "Gender is required"],
        trim: true
    },
    phone: {
        type: String,
        required: [true, "Phone number is required"],
        minLength: [10, "Phone number should be 10 digits long"],
        maxLength: [10, "Phone number should be 10 digits long"],
        trim: true,
        index: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        unique: true,
        index: true,
        lowercase: true
    },
    refreshToken: {
        type: String
    }
}, { timestamps: true })

userSchema.pre("save", async function() {
    this.password = await bcrypt.hash(this.password, 8)
})

userSchema.methods.validatePassword = async function(password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function() {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

const User = mongoose.model("User", userSchema)

export default User
