import { AuthenticatedRequest } from '../models'
import { Comment } from '../models/comment.model'
import { ApiError, ApiResponse, AsyncHandler } from '../utils'

const getVideoComments = AsyncHandler(
    async (req: AuthenticatedRequest, res) => {
        const { videoId } = req.params

        if (!videoId) {
            throw new ApiError(400, 'Bad Request: Video not found')
        }

        // Add limit to get all comments for a video
        const { page = 1, limit = 10 } = req.query
        const skip = (Number(page) - 1) * Number(limit)
        const comments = await Comment.find({ video: videoId })
            .skip(skip)
            .limit(Number(limit))
            .exec()

        if (!comments) {
            throw new ApiError(
                400,
                'Something went wrong. Comments could not be fetched!'
            )
        }

        return res
            .status(200)
            .json(
                new ApiResponse(200, comments, 'Comments fetched successfully!')
            )
    }
)

const addComment = AsyncHandler(async (req: AuthenticatedRequest, res) => {
    const { videoId } = req.params
    const { content } = req.body
    const userId = req.user?._id

    if (!userId) {
        throw new ApiError(400, 'Unauthorized Request')
    }
    if (!videoId) {
        throw new ApiError(400, 'Bad Request: Video ID is required')
    }
    if (!content || content.trim() === '') {
        throw new ApiError(400, 'Invalid data: Comment content cannot be empty')
    }

    const newComment = await Comment.create({
        content,
        video: videoId,
        owner: userId
    })

    if (!newComment) {
        throw new ApiError(
            400,
            'Something went wrong. Comment could not be added!'
        )
    }

    return res
        .status(200)
        .json(new ApiResponse(200, newComment, 'Comment added successfully!'))
})

const updateComment = AsyncHandler(async (req: AuthenticatedRequest, res) => {
    const { commentId } = req.params
    const { content } = req.body
    const userId = req.user?._id

    if (!userId) {
        throw new ApiError(400, 'Unauthorized Request')
    }
    if (!commentId) {
        throw new ApiError(400, 'Bad Request: Comment ID is required')
    }
    if (!content || content.trim() === '') {
        throw new ApiError(400, 'Invalid data: Comment content cannot be empty')
    }

    const updatedComment = await Comment.findOneAndUpdate(
        { _id: commentId, owner: userId },
        { $set: { content } },
        { new: true }
    )

    if (!updatedComment) {
        throw new ApiError(
            400,
            'You are unauthorized or Something went wrong. Comment not updated!'
        )
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedComment,
                'Comment updated successfully!'
            )
        )
})

const deleteComment = AsyncHandler(async (req: AuthenticatedRequest, res) => {
    const { commentId } = req.params
    const userId = req.user?._id

    if (!userId) {
        throw new ApiError(400, 'Unauthorized Request')
    }
    if (!commentId) {
        throw new ApiError(400, 'Bad Request: Comment ID is required')
    }

    const result = await Comment.deleteOne({ _id: commentId, owner: userId })

    if (result.deletedCount === 0) {
        throw new ApiError(
            400,
            'You are not the owner or error while deleting the comment'
        )
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, null, 'Comment has been deleted successfully!')
        )
})

export { addComment, deleteComment, getVideoComments, updateComment }
