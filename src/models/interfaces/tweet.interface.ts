import mongoose, { Document } from "mongoose";

export interface ITweet extends Document {
  content: string;
  owner: mongoose.Types.ObjectId;
}
