import express from "express";
import {
  getTaskSuggestions,
  getOverdueReminders,
  getProductivityTips,
} from "../controllers/aiController";

const aiRouter = express.Router();

aiRouter.post("/suggestions", getTaskSuggestions);
aiRouter.post("/reminders", getOverdueReminders);
aiRouter.get("/tips", getProductivityTips);

export default aiRouter;
