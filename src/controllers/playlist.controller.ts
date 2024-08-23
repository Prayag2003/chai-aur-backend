import { Request, Response } from 'express'
import { isValidObjectId } from 'mongoose'
import { AuthenticatedRequest, Playlist } from '../models'
import { ApiError, ApiResponse, AsyncHandler } from '../utils'

const createPlaylist = AsyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
        const { name, description } = req.body
        const userId = req.user?._id

        if (
            !name ||
            !description ||
            name.trim() === '' ||
            description.trim() === ''
        ) {
            throw new ApiError(400, 'Name and Description are required')
        }

        const createdPlaylist = await Playlist.create({
            name,
            description,
            owner: userId
        })

        if (!createdPlaylist) {
            throw new ApiError(
                400,
                'Something went wrong while creating the playlist'
            )
        }

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    createdPlaylist,
                    'Playlist has been created'
                )
            )
    }
)

const getUserPlaylists = AsyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params

    if (!isValidObjectId(userId)) {
        throw new ApiError(404, 'Invalid User ID')
    }

    const userPlaylists = await Playlist.find({ owner: userId })

    if (!userPlaylists || userPlaylists.length === 0) {
        throw new ApiError(404, 'No playlists found for this user')
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                userPlaylists,
                "User's Playlists have been fetched"
            )
        )
})

const getPlaylistById = AsyncHandler(async (req: Request, res: Response) => {
    const { playlistId } = req.params

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, 'Invalid Playlist ID')
    }

    const fetchedPlaylist = await Playlist.findById(playlistId)

    if (!fetchedPlaylist) {
        throw new ApiError(404, 'Playlist not found')
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, fetchedPlaylist, 'Playlist has been fetched')
        )
})

const addVideoToPlaylist = AsyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
        const { playlistId, videoId } = req.params
        const userId = req.user?._id

        if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
            throw new ApiError(404, 'Invalid Playlist ID or Video ID')
        }

        const updatedPlaylist = await Playlist.findOneAndUpdate(
            { _id: playlistId, owner: userId },
            { $addToSet: { videos: videoId } },
            { new: true }
        )

        if (!updatedPlaylist) {
            throw new ApiError(404, 'Playlist not found or unauthorized action')
        }

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    updatedPlaylist,
                    'Video has been added to the playlist'
                )
            )
    }
)

const removeVideoFromPlaylist = AsyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
        const { playlistId, videoId } = req.params
        const userId = req.user?._id

        if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
            throw new ApiError(404, 'Invalid Playlist ID or Video ID')
        }

        const playlist = await Playlist.findOneAndUpdate(
            { _id: playlistId, owner: userId },
            { $pull: { videos: videoId } },
            { new: true }
        )

        if (!playlist) {
            throw new ApiError(404, 'Video not found or unauthorized action')
        }

        return res
            .status(200)
            .json(new ApiResponse(200, playlist, 'Video removed from playlist'))
    }
)

const deletePlaylist = AsyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
        const { playlistId } = req.params
        const userId = req.user?._id

        if (!isValidObjectId(playlistId)) {
            throw new ApiError(400, 'Invalid Playlist ID')
        }

        const deletedPlaylist = await Playlist.findOneAndDelete({
            _id: playlistId,
            owner: userId
        })

        if (!deletedPlaylist) {
            throw new ApiError(404, 'Playlist not found or unauthorized action')
        }

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    deletedPlaylist,
                    'Playlist has been deleted'
                )
            )
    }
)

const updatePlaylist = AsyncHandler(async (req: Request, res: Response) => {
    const { playlistId } = req.params
    const { name, description } = req.body

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, 'Invalid Playlist ID')
    }

    if (
        !name ||
        name.trim() === '' ||
        !description ||
        description.trim() === ''
    ) {
        throw new ApiError(400, 'Name and Description are required')
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        { name, description },
        { new: true }
    )

    if (!updatedPlaylist) {
        throw new ApiError(
            400,
            'Something went wrong while updating the playlist'
        )
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, updatedPlaylist, 'Playlist has been updated')
        )
})

export {
    addVideoToPlaylist,
    createPlaylist,
    deletePlaylist,
    getPlaylistById,
    getUserPlaylists,
    removeVideoFromPlaylist,
    updatePlaylist
}
