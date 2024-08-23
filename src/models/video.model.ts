import mongoose, { Model, Schema } from 'mongoose'
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2'
import { IVideo } from './interfaces'

const videoSchema = new Schema<IVideo>(
    {
        videoFile: {
            type: String,
            required: [true, 'Video is compulsory']
        },
        thumbnail: {
            type: String,
            required: [true, 'Thumbnail is compulsory']
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        duration: {
            type: Number, // from cloudinary as well
            required: true
        },
        views: {
            type: Number,
            default: 0
        },
        isPublished: {
            type: Boolean,
            default: true
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    { timestamps: true }
)

// NOTE: allows us to aggregate queries/ pagination
// Add pagination plugin to the schema
videoSchema.plugin(mongooseAggregatePaginate)

// Define the Video model with the schema and interface
export const Video: Model<IVideo> = mongoose.model<IVideo>('Video', videoSchema)
