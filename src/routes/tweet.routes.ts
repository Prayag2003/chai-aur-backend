import { Router } from 'express'
import {
    createTweet,
    deleteTweet,
    getUserTweets,
    updateTweet
} from '../controllers'
import { verifyJWT } from '../middleware'

const router = Router()

router.post('/', verifyJWT, createTweet)
router.get('/user/:userId', verifyJWT, getUserTweets)
router.put('/:tweetId', verifyJWT, updateTweet)
router.delete('/:tweetId', verifyJWT, deleteTweet)

export { router as tweetRouter }
