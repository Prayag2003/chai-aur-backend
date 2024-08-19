import mongoose from "mongoose";

export interface IPlaylist extends Document {
  name: string;
  description: string;
  videos: mongoose.Types.ObjectId[];
  owner: mongoose.Types.ObjectId;
}
