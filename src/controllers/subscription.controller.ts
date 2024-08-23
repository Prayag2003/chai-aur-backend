import { Response } from 'express'
import { isValidObjectId } from 'mongoose'
import { AuthenticatedRequest, Subscription } from '../models'
import { ApiError, ApiResponse, AsyncHandler } from '../utils'

const toggleSubscription = AsyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
        const { subscriberId } = req.params
        const userId = req.user?._id

        if (!isValidObjectId(userId)) {
            throw new ApiError(400, 'Unauthorized Request')
        }

        if (!isValidObjectId(subscriberId)) {
            throw new ApiError(400, 'Invalid Channel ID')
        }

        const existingSubscription = await Subscription.findOne({
            subscriber: userId,
            channel: subscriberId
        })

        let message
        let subscription

        if (existingSubscription) {
            subscription = await Subscription.deleteOne({
                _id: existingSubscription._id
            })
            message = 'Subscription has been removed'
        } else {
            subscription = await Subscription.create({
                subscriber: userId,
                channel: subscriberId
            })
            message = 'Subscription has been added'
        }

        return res.status(200).json(new ApiResponse(200, subscription, message))
    }
)

const getUserChannelSubscribers = AsyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
        const { channelId } = req.params
        const userId = req.user?._id

        if (!isValidObjectId(userId)) {
            throw new ApiError(400, 'User must be logged in')
        }

        if (!isValidObjectId(channelId)) {
            throw new ApiError(400, 'Invalid Channel ID')
        }

        const subscribers = await Subscription.find({ channel: channelId })

        if (!subscribers || subscribers.length === 0) {
            throw new ApiError(404, 'No subscribers found for this channel')
        }

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    subscribers,
                    'Subscribers fetched successfully'
                )
            )
    }
)

const getSubscribedChannels = AsyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
        const { subscriberId } = req.params

        if (!isValidObjectId(subscriberId)) {
            throw new ApiError(400, 'Invalid Subscriber ID')
        }

        const channels = await Subscription.find({ subscriber: subscriberId })

        if (!channels || channels.length === 0) {
            throw new ApiError(404, 'User has not subscribed to any channels')
        }

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    channels,
                    'Subscribed channels fetched successfully'
                )
            )
    }
)

export { getSubscribedChannels, getUserChannelSubscribers, toggleSubscription }
