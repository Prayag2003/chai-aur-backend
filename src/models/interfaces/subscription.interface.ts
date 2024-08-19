import mongoose, { Document } from "mongoose";

export interface ISubscription extends Document {
  subscriber: mongoose.Types.ObjectId;
  channel: mongoose.Types.ObjectId;
}
