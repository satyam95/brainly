import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { Content } from "../models/content.model";

// Add new content
const addContent = asyncHandler(async (req: Request, res: Response) => {
  const { link, type, description, title, tags } = req.body;
  try {
    const newContent = await Content.create({
      title,
      description,
      link,
      type,
      tags,
      userId: req.id,
    });
    res.json({
      message: "Content added successfully",
      content: newContent,
    });
  } catch (error) {
    console.error(error);
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

// Get Content by Type
const getContentByType = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.id;
  const { type } = req.params;
  try {
    const data = await Content.find({
      userId: userId,
      type: type,
    });
    res.json({
      data,
    });
  } catch (error) {
    console.error("Get content by type error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get single Content
const getSingleContent = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const content = await Content.findById(id);
    if (!content) {
      return res.status(404).json({ message: "Content not found" });
    }
    res.json(content);
  } catch (error) {
    console.error("Get single content error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update Content
const updateContent = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, link, type, tags } = req.body;
  try {
    const content = await Content.findByIdAndUpdate(
      id,
      { title, description, link, type, tags },
      { new: true }
    );
    if (!content) {
      return res.status(404).json({ message: "Content not found" });
    }
    res.json({
      message: "Content updated",
      content,
    });
  } catch (error) {
    console.error("Update content error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete Content
const deleteContent = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const content = await Content.findByIdAndDelete(id);
    if (!content) {
      return res.status(404).json({ message: "Content not found" });
    }
    res.json({ message: "Content deleted" });
  } catch (error) {
    console.error("Delete content error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Search Content
const searchContent = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.id;
  const { query } = req.query;
  try {
    const data = await Content.find({
      userId: userId,
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { tags: { $regex: query, $options: "i" } },
      ],
    });
    res.json({
      data,
    });
  } catch (error) {
    console.error("Search content error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export {
  addContent,
  getContent,
  getContentByType,
  getSingleContent,
  deleteContent,
  updateContent,
  searchContent,
};
