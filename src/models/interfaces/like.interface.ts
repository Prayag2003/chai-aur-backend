import mongoose, { Document } from "mongoose";

export interface ILike extends Document {
  video: mongoose.Types.ObjectId;
  comment: mongoose.Types.ObjectId;
  tweet: mongoose.Types.ObjectId;
  likedBy: mongoose.Types.ObjectId;
}
