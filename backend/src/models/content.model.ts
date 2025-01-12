import mongoose, { Schema } from "mongoose";

const ContentSchema = new Schema(
  {
    title: String,
    description: String,
    link: String,
    tags: [{type: String}],
    type: String,
    userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
);

export const Content = mongoose.model("Content", ContentSchema);
