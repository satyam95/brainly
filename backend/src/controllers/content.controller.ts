import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { Content } from "../models/content.model";

// Add new content
const addContent = asyncHandler(async (req: Request, res: Response) => {
  const { link, type, description, title, tags } = req.body;
  try {
    await Content.create({
      title,
      description,
      link,
      type,
      tags,
      userId: req.id,
    });
    res.json({ message: "Content added" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
});

// Get all content
const getContent = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.id;
  try {
    const data = await Content.find({
      userId: userId,
    });
    res.json({
      data,
    });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


export { addContent, getContent };
