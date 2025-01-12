import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler";

// Extend Request interface to include custom property
declare global {
  namespace Express {
    interface Request {
      id?: string;
    }
  }
}

export const isAuthenticated = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies?.token;
      if (!token) {
        return res.status(401).json({ message: "User not authenticated." });
      }

      const secretKey = process.env.JWT_SECRET_KEY;
      if (!secretKey) {
        console.error("JWT_SECRET_KEY is not defined");
        return res.status(500).json({ message: "Internal server error" });
      }

      const decode = jwt.verify(token, secretKey);
      if (typeof decode !== "object" || !("userId" in decode)) {
        return res.status(401).json({ message: "Invalid token" });
      }

      req.id = decode.userId as string;
      next(); // Call the next middleware
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);
