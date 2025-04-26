import express from "express";
import {
  getTaskSuggestions,
  getOverdueReminders,
  getProductivityTips,
} from "../controllers/aiController";

const router = express.Router();

router.get("/suggestions", getTaskSuggestions);
router.get("/reminders", getOverdueReminders);
router.get("/tips", getProductivityTips);

export default router;
