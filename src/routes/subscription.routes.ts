import express from 'express'
import {
    getSubscribedChannels,
    getUserChannelSubscribers,
    toggleSubscription
} from '../controllers/subscription.controller'
import { verifyJWT as authenticateUser } from '../middleware'

const subscriptionRouter = express.Router()

subscriptionRouter.post(
    '/:subscriberId/toggle',
    authenticateUser,
    toggleSubscription
)
subscriptionRouter.get(
    '/channel/:channelId/subscribers',
    authenticateUser,
    getUserChannelSubscribers
)
subscriptionRouter.get(
    '/:subscriberId/channels',
    authenticateUser,
    getSubscribedChannels
)

export { subscriptionRouter }
