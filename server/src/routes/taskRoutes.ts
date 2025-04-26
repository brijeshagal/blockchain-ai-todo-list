import express from "express";
import { authenticate } from "../middlewares/auth";
import { createTask, deleteTask, getTasks, markTaskCompleted } from "../controllers/taskController";

const router = express.Router();

router.use(authenticate);

router.get("/", getTasks);
router.post("/", createTask);
router.delete("/:id", deleteTask);
router.put("/:id/complete", markTaskCompleted);

export default router;
