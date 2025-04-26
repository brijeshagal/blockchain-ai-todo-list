import mongoose from "mongoose";

export const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);
export const UserModel = mongoose.model("User", userSchema);
