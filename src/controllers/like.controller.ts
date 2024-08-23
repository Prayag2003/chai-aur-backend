import { Response } from 'express'
import { Document, mongo } from 'mongoose'
import { AuthenticatedRequest, Like } from '../models'
import { ApiError, ApiResponse, AsyncHandler } from '../utils'

const toggleVideoLike = AsyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
        const { videoId } = req.params

        if (!videoId) {
            throw new ApiError(400, 'Bad Request: Video ID is required')
        }

        const userId = req.user?._id
        if (!userId) {
            throw new ApiError(400, 'Unauthorized Request')
        }

        const existingVideoLike = await Like.findOne({
            video: videoId,
            likedBy: userId
        })

        let message: string
        let actionTaken: Document | mongo.DeleteResult | null

        if (!existingVideoLike) {
            actionTaken = await Like.create({
                video: videoId,
                likedBy: userId
            })
            message = 'Video has been liked by the user'
        } else {
            actionTaken = await Like.deleteOne({ _id: existingVideoLike._id })
            message = 'Video has been unliked by the user'
        }

        return res.status(200).json(new ApiResponse(200, actionTaken, message))
    }
)

const toggleCommentLike = AsyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
        const { commentId } = req.params

        if (!commentId) {
            throw new ApiError(400, 'Bad Request: Comment ID is required')
        }

        const userId = req.user?._id
        if (!userId) {
            throw new ApiError(400, 'Unauthorized Request')
        }

        const existingCommentLike = await Like.findOne({
            comment: commentId,
            likedBy: userId
        })

        let message: string
        let actionTaken: Document | mongo.DeleteResult | null

        if (!existingCommentLike) {
            actionTaken = await Like.create({
                comment: commentId,
                likedBy: userId
            })
            message = 'Comment has been liked by the user'
        } else {
            actionTaken = await Like.deleteOne({ _id: existingCommentLike._id })
            message = 'Comment has been unliked by the user'
        }

        return res.status(200).json(new ApiResponse(200, actionTaken, message))
    }
)

const toggleTweetLike = AsyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
        const { tweetId } = req.params

        if (!tweetId) {
            throw new ApiError(400, 'Bad Request: Tweet ID is required')
        }

        const userId = req.user?._id
        if (!userId) {
            throw new ApiError(400, 'Unauthorized Request')
        }

        const existingTweetLike = await Like.findOne({
            tweet: tweetId,
            likedBy: userId
        })

        let message: string
        let actionTaken: Document | mongo.DeleteResult | null

        if (!existingTweetLike) {
            actionTaken = await Like.create({
                tweet: tweetId,
                likedBy: userId
            })
            message = 'Tweet has been liked by the user'
        } else {
            actionTaken = await Like.deleteOne({ _id: existingTweetLike._id })
            message = 'Tweet has been unliked by the user'
        }

        return res.status(200).json(new ApiResponse(200, actionTaken, message))
    }
)

const getLikedVideos = AsyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
        const userId = req.user?._id

        if (!userId) {
            throw new ApiError(400, 'Bad Request: User is required to Log In')
        }

        const likedVideos = await Like.find({
            likedBy: userId,
            video: { $exists: true }
        }).select('-createdAt -updatedAt -__v')

        if (!likedVideos) {
            throw new ApiError(
                400,
                'Something went wrong or User has not liked any videos'
            )
        }

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    likedVideos,
                    'Videos liked by user have been fetched'
                )
            )
    }
)

export { getLikedVideos, toggleCommentLike, toggleTweetLike, toggleVideoLike }
