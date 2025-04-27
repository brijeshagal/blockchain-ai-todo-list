import mongoose from "mongoose";

export const taskSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, optional: true },
    deadline: { type: Date, optional: true },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    completed: { type: Boolean, default: false },
    blockchainHash: { type: String, optional: true },
  },
  { timestamps: true }
);

export const TaskModel = mongoose.model("Task", taskSchema);
