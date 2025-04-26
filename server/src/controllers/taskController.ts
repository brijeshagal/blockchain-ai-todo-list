import { Request, Response } from "express";
import { TaskModel as Task } from "../models/task";

export const getTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.body.user?.id; // Access user from req.body
    const tasks = await Task.find({ userId });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

export const createTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { title, description, deadline, priority } = req.body;
  const userId = req.body.user?.id;

  try {
    const task = new Task({
      userId,
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
  const userId = req.body.user?.id;

  try {
    const deleted = await Task.findOneAndDelete({ _id: id, userId });

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
  const userId = req.body.user?.id;

  try {
    const task = await Task.findOneAndUpdate(
      { _id: id, userId },
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
