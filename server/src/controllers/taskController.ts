import { Request, Response } from "express";
import { TaskModel as Task } from "../models/task";

export const getTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const username = (req as any).user?.username; // Access user from req.body
    const tasks = await Task.find({ username });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

export const createTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { title, description, deadline, priority } = await req.body;
  const username = (req as any).user?.username;

  try {
    const task = new Task({
      username,
      title,
      description,
      deadline,
      priority,
      completed: false,
    });

    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(500).json({ error: "Failed to create task" });
  }
};

export const deleteTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const username = (req as any).user?.username;

  try {
    const deleted = await Task.findOneAndDelete({ _id: id, username });

    if (!deleted) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete task" });
  }
};

export const markTaskCompleted = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const username = (req as any).user?.username;

  try {
    const task = await Task.findOneAndUpdate(
      { _id: id, username },
      { completed: true },
      { new: true }
    );

    if (!task) {
      res.status(404).json({ error: "Task not found" });
    }

    res.json(task);
  } catch (err) {
    res.status(500).json({ error: "Failed to mark task as completed" });
  }
};
