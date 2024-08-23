import { Request, Response } from 'express'
import { Comment } from '../models/comment.model'
import { Video } from '../models/video.model'
import {
    ApiError,
    ApiResponse,
    AsyncHandler,
    deleteOldVideo,
    uploadOnCloudinary
} from '../utils'
import { AuthenticatedRequest, VideoUploadRequest } from '../models/interfaces'

interface CustomRequest extends Request {
    user?: { _id: string; watchHistory: string[] }
}

const getAllVideos = AsyncHandler(async (req: CustomRequest, res: Response) => {
    const {
        page = 1,
        limit = 10,
        query,
        sortBy,
        sortType,
        userId
    } = req.query as {
        page?: string
        limit?: string
        query?: string
        sortBy?: string
        sortType?: string
        userId?: string
    }

    const validSortFields = ['createdAt', 'title']
    const validSortTypes = ['asc', 'desc']

    if (sortBy && !validSortFields.includes(sortBy)) {
        throw new ApiError(400, 'Invalid Sort Field')
    }

    if (sortType && !validSortTypes.includes(sortType)) {
        throw new ApiError(400, 'Invalid Sort Type')
    }

    let filter: any = {}
    if (userId) {
        filter = { owner: userId }
    }

    if (query) {
        filter.title = { $regex: query, $options: 'i' }
    }

    const sort: any = {}
    if (sortBy) {
        sort[sortBy] = sortType === 'desc' ? -1 : 1
    }

    const fetchedVideos = await Video.find(filter)
        .sort(sort)
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit))

    if (!fetchedVideos || fetchedVideos.length === 0) {
        throw new ApiError(
            400,
            'Videos Not Found Or Something went wrong while Fetching the Videos from the Database'
        )
    }

    return res
        .status(200)
        .json(new ApiResponse(200, fetchedVideos, 'Videos have been fetched'))
})

const getVideoById = AsyncHandler(
    async (req: CustomRequest & AuthenticatedRequest, res: Response) => {
        const { videoId } = req.params
        const user = req.user

        if (!videoId) {
            throw new ApiError(403, 'Video not found')
        }
        const fetchedVideo = await Video.findById(videoId)
        if (!fetchedVideo) {
            throw new ApiError(400, 'Bad Request: Video not found')
        }

        if (!fetchedVideo.isPublished) {
            throw new ApiError(400, 'Video not found (is not published yet)')
        }

        fetchedVideo.views += 1
        await fetchedVideo.save({ validateBeforeSave: false })

        if (user && !user.watchHistory.includes(videoId)) {
            user.watchHistory.push(videoId)
            await user.save({ validateBeforeSave: false })
        }

        return res
            .status(200)
            .json(new ApiResponse(200, fetchedVideo, 'Video has been fetched'))
    }
)

const publishAVideo = AsyncHandler(
    async (req: VideoUploadRequest & AuthenticatedRequest, res) => {
        const { title, description, shouldPublish } = req.body

        if ([title, description].some((field) => field?.trim() === '')) {
            throw new ApiError(400, 'All fields are required')
        }

        const videoLocalPath = req.files?.videoFile?.[0]?.path
        const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path

        if (!req.user?._id) {
            throw new ApiError(401, 'User not found')
        }
        if (!videoLocalPath) {
            throw new ApiError(400, 'Video file is required')
        }
        if (!thumbnailLocalPath) {
            throw new ApiError(400, 'Thumbnail file is required')
        }

        const [videoPath, thumbnailPath] = await Promise.all([
            uploadOnCloudinary(videoLocalPath),
            uploadOnCloudinary(thumbnailLocalPath)
        ])

        if (!videoPath || !thumbnailPath) {
            let errorMessage = ''
            if (!videoPath) errorMessage += 'Failed to upload video. '
            if (!thumbnailPath) errorMessage += 'Failed to upload thumbnail.'
            throw new ApiError(500, errorMessage)
        }

        const videoDuration = videoPath.duration

        const videoCreated = await Video.create({
            videoFile: videoPath.url,
            thumbnail: thumbnailPath.url,
            title,
            description,
            duration: videoDuration,
            views: 0,
            isPublished: shouldPublish,
            owner: req.user._id
        })

        if (!videoCreated) {
            throw new ApiError(
                400,
                'Failed to upload the video to the database'
            )
        }

        return res
            .status(201)
            .json(
                new ApiResponse(
                    201,
                    videoCreated,
                    'Video published successfully'
                )
            )
    }
)

const updateVideo = AsyncHandler(async (req: CustomRequest, res: Response) => {
    const { videoId } = req.params
    const thumbnailLocalPath = req.file?.path
    const userId = req.user?._id
    const { title, description } = req.body

    if ([title, description].some((field: string) => field?.trim() === ' ')) {
        throw new ApiError(400, 'All fields are required')
    }

    if (!thumbnailLocalPath) {
        throw new ApiError(400, 'Thumbnail file is required')
    }

    const thumbnailPath = await uploadOnCloudinary(thumbnailLocalPath)

    if (!thumbnailPath) {
        throw new ApiError(
            400,
            'Error while uploading the thumbnail to Cloudinary'
        )
    }
    const video = await Video.findOne({ _id: videoId, owner: userId })
    deleteOldVideo(video?.thumbnail)

    const updatedVideo = await Video.findOneAndUpdate(
        { _id: videoId, owner: userId },
        {
            $set: {
                title,
                description,
                thumbnail: thumbnailPath.url
            }
        },
        { new: true }
    )

    if (!updatedVideo) {
        throw new ApiError(
            400,
            'Bad Request: Video not found or User cannot modify the video'
        )
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedVideo,
                'Video details have been updated'
            )
        )
})

const deleteVideo = AsyncHandler(async (req: CustomRequest, res: Response) => {
    const { videoId } = req.params
    const userId = req.user?._id

    if (!userId) {
        throw new ApiError(400, 'Unauthorized Request')
    }
    if (!videoId) {
        throw new ApiError(400, 'Bad Request')
    }

    const video = await Video.findOne({ _id: videoId, owner: userId })

    if (!video) {
        throw new ApiError(404, 'Video not found')
    }

    await Promise.all([
        deleteOldVideo(video.thumbnail),
        deleteOldVideo(video.videoFile)
    ])

    const commentsOnVideo = await Comment.deleteMany({ video: videoId })
    if (!commentsOnVideo) {
        console.log('No comments on the video')
    } else {
        console.log('Comments have been deleted')
    }

    const videoDeleted = await Video.deleteOne({ _id: videoId, owner: userId })

    if (!videoDeleted) {
        throw new ApiError(
            400,
            'Bad Request: Video not found or User cannot delete the video'
        )
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                videoDeleted,
                'Video has been successfully deleted'
            )
        )
})

const togglePublishStatus = AsyncHandler(
    async (req: CustomRequest, res: Response) => {
        const { videoId } = req.params
        const userId = req.user?._id

        const video = await Video.findOne({ _id: videoId, owner: userId })
        if (!video) {
            throw new ApiError(
                400,
                'Bad Request: Video not found or User cannot modify the video'
            )
        }

        video.isPublished = !video.isPublished
        await video.save({ validateBeforeSave: false })

        return res
            .status(200)
            .json(new ApiResponse(200, video, 'Video status has been toggled'))
    }
)

export {
    deleteVideo,
    getAllVideos,
    getVideoById,
    publishAVideo,
    togglePublishStatus,
    updateVideo
}
