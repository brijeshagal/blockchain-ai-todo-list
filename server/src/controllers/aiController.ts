import { Request, Response } from "express";
import { suggestPriority, suggestProductivityTips } from "../services/ai";

export const getTaskSuggestions = async (req: Request, res: Response) => {
  try {
    const { taskTitle, deadline } = await req.body;
    const response = await suggestPriority(taskTitle, deadline);
    res.json(response);
  } catch (e) {
    console.log({ e });
    res.status(500).json({ error: "Failed to get task suggestions" });
  }
};

export const getOverdueReminders = async (req: Request, res: Response) => {
  // TODO: Calculate based on due dates
  res.json([
    { taskId: "abc123", message: "This task is overdue!" },
    { taskId: "ghi789", message: "Pending for 3 days!" },
  ]);
};

export const getProductivityTips = async (req: Request, res: Response) => {
  try {
    const response = await suggestProductivityTips();
    res.json(response);
  } catch (e) {
    console.log({ e });
    res.status(500).json({ error: "Failed to get productivity tips" });
  }
};
