import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader?.startsWith("Bearer ")) {
    res.status(401).send("Unauthorized");
    return;
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    req.user = { id: decoded.userId };
    next();
  } catch (err) {
    res.status(403).send("Forbidden");
  }
};
