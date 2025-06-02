import mongoose from "mongoose";
import { foodLoggedSchema } from "./FoodLoggedSchema";

export const userDetailsSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    coverBgUrl: {
        type: String,
        required: false,
    },
    profilePicUrl:{
        type: String,
        required: false,
    },
    foodsLogged:{
        type: [foodLoggedSchema],
        default: []
    },
});