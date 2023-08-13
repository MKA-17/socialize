import mongoose, { Schema, model } from "mongoose";

export const postModel = new model(
  "post",
  Schema(
    {
      userId: { type: mongoose.ObjectId, ref: "user", required: true },
      content: { type: String },
      comments: [
        {
          content: { type: String },
          user: { type: mongoose.ObjectId, ref: "user", required: true },
          time: { type: Date, default: Date() },
        },
      ],
      image: {
        data: {
          type: Buffer,
        },
        contentType: {
          type: String,
        },
      },
      likes: [
        {
          type: mongoose.ObjectId,
          ref: "user",
          required: true,
        },
      ],
      time: { type: Date, default: Date() },
      isImage: { type: Boolean, default: false },
      edited: {
        isEdit: { type: Boolean, default: false },
        editedAt: { type: Date, default: Date() },
      },
      shared: {
        isShare: { type: Boolean, default: false },
        sharedFrom: {
          name: { type: String },
          id: { type: mongoose.ObjectId, ref: "user" },
        },
      },
    },
    { timestamps: true }
  )
);
