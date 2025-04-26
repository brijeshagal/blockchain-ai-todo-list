import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserModel as User } from "../models/user";

export const register = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const userExists = await User.findOne({ username });
  if (userExists) res.status(400).json({ message: "User already exists" });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ username, passwordHash });

  const token = jwt.sign({ userId: user.username }, process.env.JWT_SECRET!, {
    expiresIn: "1d",
  });
  res.status(201).json({ token });
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }

  const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET!, {
    expiresIn: "1d",
  });
  res.json({ token });
};
