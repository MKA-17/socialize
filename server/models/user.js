import mongoose, { Schema, model } from "mongoose";

export const userModel = new model(
  "user",
  Schema(
    {
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      password: {
        type: String,
        required: true,
        min: 6,
      },
      image: {
        data: {
          type: Buffer,
        },
        contentType: {
          type: String,
        },
      },

      occupation: { type: String },
      location: { type: String },
      following: [{ type: mongoose.ObjectId, ref: "user" }],
      followers: [{ type: mongoose.ObjectId, ref: "user" }],
      likedPosts: [{type: mongoose.ObjectId, ref: "post",}],
      savedPosts: [{type: mongoose.ObjectId, ref: "post",}],

    },
    { timestamps: true }
  )
);
