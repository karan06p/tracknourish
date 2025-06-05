import mongoose from "mongoose";
import { foodLoggedSchema } from "./FoodLoggedSchema";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    hashedPassword: {
      type: String,
      required: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
    },
    userDetails: {
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
      coverBgId: {
        type: String,
        required: false,
      },
      profilePicUrl: {
        type: String,
        required: false,
      },
      profilePicId: {
        type: String,
        required: false,
      },
      foodsLogged: {
        type: [foodLoggedSchema],
        default: [],
      },
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.models.User || mongoose.model("User", userSchema);
