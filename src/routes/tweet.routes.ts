import { Router } from 'express'
import {
    createTweet,
    deleteTweet,
    getUserTweets,
    updateTweet
} from '../controllers'
import { verifyJWT } from '../middleware'

const tweetRouter = Router()

tweetRouter.post('/', verifyJWT, createTweet)
tweetRouter.get('/user/:userId', verifyJWT, getUserTweets)
tweetRouter.put('/:tweetId', verifyJWT, updateTweet)
tweetRouter.delete('/:tweetId', verifyJWT, deleteTweet)

export { tweetRouter }
