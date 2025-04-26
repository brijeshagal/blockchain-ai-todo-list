// types/express.d.ts (or any .d.ts file)
import "express";
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
      };
    }
  }
}
