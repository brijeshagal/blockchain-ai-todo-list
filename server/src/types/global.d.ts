declare global {
  namespace Express {
    interface Request {
      body: {
        user?: {
          id: string;
        };
      };
    }
  }
}
