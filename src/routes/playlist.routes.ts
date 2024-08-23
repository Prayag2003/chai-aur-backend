import express from 'express'
import {
    addVideoToPlaylist,
    createPlaylist,
    deletePlaylist,
    getPlaylistById,
    getUserPlaylists,
    removeVideoFromPlaylist,
    updatePlaylist
} from '../controllers/playlist.controller'
import { verifyJWT as authenticateUser } from '../middleware'

const playlistRouter = express.Router()

playlistRouter.post('/', authenticateUser, createPlaylist)
playlistRouter.get('/user/:userId', authenticateUser, getUserPlaylists)
playlistRouter.get('/:playlistId', authenticateUser, getPlaylistById)
playlistRouter.post(
    '/:playlistId/video/:videoId',
    authenticateUser,
    addVideoToPlaylist
)
playlistRouter.delete(
    '/:playlistId/video/:videoId',
    authenticateUser,
    removeVideoFromPlaylist
)

playlistRouter.delete('/:playlistId', authenticateUser, deletePlaylist)
playlistRouter.put('/:playlistId', authenticateUser, updatePlaylist)

export { playlistRouter }
