import mongoose, { Model, Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import { IPlaylist } from "./interfaces";

const playlistSchema = new Schema<IPlaylist>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    videos: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

playlistSchema.plugin(mongooseAggregatePaginate);

export const Playlist: Model<IPlaylist> = mongoose.model<IPlaylist>(
  "Playlist",
  playlistSchema
);
