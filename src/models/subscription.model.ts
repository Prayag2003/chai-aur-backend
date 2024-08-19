import mongoose, { Model, Schema } from "mongoose";
import { ISubscription } from "./interfaces";

const subscriptionSchema = new Schema<ISubscription>(
  {
    subscriber: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    channel: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export const Subscription: Model<ISubscription> = mongoose.model<ISubscription>(
  "Subscription",
  subscriptionSchema
);
