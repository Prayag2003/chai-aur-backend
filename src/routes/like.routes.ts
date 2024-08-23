import { Router } from 'express'
import {
    getLikedVideos,
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike
} from '../controllers/like.controller'
import { verifyJWT as authenticate } from '../middleware'

const router = Router()

router.post('/video/:videoId', authenticate, toggleVideoLike)
router.post('/comment/:commentId', authenticate, toggleCommentLike)
router.post('/tweet/:tweetId', authenticate, toggleTweetLike)
router.get('/videos', authenticate, getLikedVideos)

export { router as likeRouter }
