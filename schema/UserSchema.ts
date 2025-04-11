import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    isEmailVerified:{
        type: Boolean,
        default: false
    },
    otp:{
        type: String,
    }
})

export const User = mongoose.models.User || mongoose.model("User", userSchema);