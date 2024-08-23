import { Router } from 'express'
import {
    getLikedVideos,
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike
} from '../controllers/like.controller'
import { verifyJWT as authenticate } from '../middleware'

const likeRouter = Router()

likeRouter.post('/video/:videoId', authenticate, toggleVideoLike)
likeRouter.post('/comment/:commentId', authenticate, toggleCommentLike)
likeRouter.post('/tweet/:tweetId', authenticate, toggleTweetLike)
likeRouter.get('/videos', authenticate, getLikedVideos)

export { likeRouter }
