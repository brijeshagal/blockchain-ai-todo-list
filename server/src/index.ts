import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import { connectDB } from "./config/db";
import authRoutes from "./routes/authRoutes";
import taskRoutes from "./routes/taskRoutes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use("/", (req: Request, res: Response) => {
  res.json(200);
});
app.use("/api/tasks", taskRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
