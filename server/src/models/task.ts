import mongoose from "mongoose";

export const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    description: String,
    dueDate: Date,
    completed: { type: Boolean, default: false },
    blockchainHash: { type: String }, // optional
  },
  { timestamps: true }
);

export const TaskModel = mongoose.model("Task", taskSchema);
