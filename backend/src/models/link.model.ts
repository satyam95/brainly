import mongoose, { Schema } from "mongoose";

const LinkSchema = new Schema(
  {
    hash: String,
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Link = mongoose.model("Link", LinkSchema);
