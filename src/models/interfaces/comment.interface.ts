import mongoose, { Document } from "mongoose";

export interface IComment extends Document {
  content: string;
  video: mongoose.Types.ObjectId;
  owner: mongoose.Types.ObjectId;
}
