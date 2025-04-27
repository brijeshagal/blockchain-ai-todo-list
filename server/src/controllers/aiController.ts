import { Request, Response } from "express";
import { suggestPriority } from "../services/ai";

export const getTaskSuggestions = async (req: Request, res: Response) => {
  const {taskTitle, deadline} = await req.body;
  const response = await suggestPriority(taskTitle, deadline);
  res.json(response);
};

export const getOverdueReminders = async (req: Request, res: Response) => {
  // TODO: Calculate based on due dates
  res.json([
    { taskId: "abc123", message: "This task is overdue!" },
    { taskId: "ghi789", message: "Pending for 3 days!" },
  ]);
};

export const getProductivityTips = async (req: Request, res: Response) => {
  // TODO: Could use AI-generated tips here
  res.json([
    "Break your tasks into smaller chunks.",
    "Use the Pomodoro technique.",
    "Focus on one task at a time.",
  ]);
};
