import mongoose from "mongoose";

export const foodLoggedSchema = new mongoose.Schema({
    mealName: {
        type: String,
        required: true,
    },
    mealType: {
        type: String,
        enum: ["breakfast", "lunch", "dinner", "snack"],
        default: "breakfast",
        required: true,
    },
    description: {
        type: String,
    },
    calories: {
        type: String,
        required: true,
    },
    protein: {
        type: String,
        required: true,
    },
    carbohydrates: {
        type: String,
        required: true,
    },
    fiber: {
        type: String,
        required: true,
    },
    fat: {
        type: String,
        required: true,
    },
    tags: {
        type: [String]
    }
});