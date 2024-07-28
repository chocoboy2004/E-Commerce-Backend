import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

const sellerSchema = new Schema({
    fullname: {
        type: String,
        required: [true, "Fullname is required"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        unique: true,
        index: true
    },
    phone: {
        type: Number,
        required: [true, "Phone number is required"],
        minLength: [10, "Phone number should be 10 digits long"],
        maxLength: [10, "Phone number should be 10 digits long"],   
        unique: true,
        index: true
    },
    displayName: {
        type: String,
        required: [true, "Display name is required"],
        trim: true
    },
    gstn: {
        type: String,
        required: [true, "GSTN is required"],
        trim: true,
        unique: true,
        index: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        trim: true,
        minLength: [8, "Password should be at least 8 characters long"]
    },
    pickupLocation: {
        type: String,
        required: [true, "Pickup location is required"],
        trim: true
    },
    pincode: {
        type: Number,
        required: [true, "Pincode is required"],
        minLength: [6, "Pincode should be 6 digits long"],
        maxLength: [6, "Pincode should be 6 digits long"],
        trim: true,
        index: true
    },
    refreshToken: {
        type: String,
    }
}, { timestamps: true })

sellerSchema.pre("save", async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 10)
    } else {
        next()
    }
})

sellerSchema.methods.validatePassword = async function(password) {
    return await bcrypt.compare(password, this.password)
}

sellerSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            phone: this.phone
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

sellerSchema.methods.generateRefreshToken = function() {
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

const Seller = mongoose.model("Seller", sellerSchema)

export default Seller