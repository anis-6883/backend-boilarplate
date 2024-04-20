import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: null,
    },
    refreshToken: {
      type: String,
      default: null,
    },
    status: {
      type: Boolean,
      default: true,
    },
    userType: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    userRole: {
      type: String,
      enum: ["user", "super-admin", "admin", "manager"],
      default: "user",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
