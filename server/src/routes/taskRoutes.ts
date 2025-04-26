import express from "express";
import {
  createTask,
  deleteTask,
  getTasks,
  markTaskCompleted,
} from "../controllers/taskController";
import { authenticate } from "../middlewares/auth";

const router = express.Router();

router.use(authenticate);

router.get("/", getTasks);
router.post("/", createTask);
router.delete("/:id", deleteTask);
router.put("/:id/complete", markTaskCompleted);

export default router;
