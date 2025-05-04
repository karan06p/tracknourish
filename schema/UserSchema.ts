import mongoose from "mongoose";
import { foodLoggedSchema } from "./FoodLoggedSchema";

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
        unique: true,
    },
    hashedPassword: {
        type: String,
        required: true,
    },
    isEmailVerified:{
        type: Boolean,
        default: false
    },
    refreshToken: {
        type: String,
    },
    foodsLogged:{
        type: [foodLoggedSchema],
        default: []
    }
}, {
    timestamps: true
})

export const User = mongoose.models.User || mongoose.model("User", userSchema);