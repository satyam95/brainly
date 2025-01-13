import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { Link } from "../models/link.model";
import { generateHash } from "../utils/generateHash";
import { Content } from "../models/content.model";
import { User } from "../models/user.model";

const shareBrain = asyncHandler(async (req: Request, res: Response) => {
  const share = req.body.share;
  const userId = req.id;
  try {
    if (share) {
      const existingLink = await Link.findOneAndUpdate({
        userId: userId,
      });
      if (existingLink) {
        res.json({
          hash: existingLink.hash,
        });
        return;
      }
      const hash = generateHash(10);
      await Link.create({
        userId: userId,
        hash: hash,
      });
      res.json({
        hash,
      });
    } else {
      await Link.findOneAndDelete({ userId });
      res.json({ messsage: "Link Removed" });
    }
  } catch (error) {
    console.error("Sharing error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const getShareLink = asyncHandler(async (req: Request, res: Response) => {
  const hash = req.params.shareLink;
  try {
    const link = await Link.findOne({
      hash,
    });
    if (!link) {
      res.status(411).json({
        message: "Sorry incorrect input",
      });
      return;
    }

    const content = await Content.find({
      userId: link.userId,
    });

    const user = await User.findOne({
      _id: link.userId,
    });

    if (!user) {
      res.status(411).json({
        message: "user not found, error should ideally not happen",
      });
      return;
    }

    res.json({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      content: content,
    });
  } catch (error) {
    console.error("Share link error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export { shareBrain, getShareLink };
