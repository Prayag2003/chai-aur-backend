import mongoose from 'mongoose'
import { Comment, Like, Tweet, User, Video } from '../../../models'

describe('Like Model', () => {
    let user: any, video: any, comment: any, tweet: any

    beforeAll(async () => {
        user = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            fullname: 'Test User',
            avatar: 'avatar.png',
            coverImage: 'cover.png',
            password: 'plainpassword'
        })
        await user.save()

        video = new Video({
            videoFile: 'video.mp4',
            thumbnail: 'thumbnail.png',
            title: 'Test Video',
            description: 'Test Description',
            duration: 120,
            owner: user._id
        })
        await video.save()

        comment = new Comment({
            content: 'Test Comment',
            owner: user._id,
            video: video._id
        })
        await comment.save()

        tweet = new Tweet({
            content: 'Test Tweet',
            owner: user._id
        })
        await tweet.save()
    })

    afterEach(async () => {
        await Like.deleteMany({})
    })

    afterAll(async () => {
        await User.deleteMany({})
        await Video.deleteMany({})
        await Comment.deleteMany({})
        await Tweet.deleteMany({})
        await mongoose.connection.close()
    })

    it('should create a like for a video', async () => {
        const like = new Like({
            video: video._id,
            likedBy: user._id
        })
        await like.save()

        const foundLike = await Like.findById(like._id)
            .populate('video')
            .populate('likedBy')
        expect(foundLike).not.toBeNull()
        expect(foundLike?.video._id.toString()).toBe(video._id.toString())
        expect(foundLike?.likedBy._id.toString()).toBe(user._id.toString())
    })

    it('should create a like for a comment', async () => {
        const like = new Like({
            comment: comment._id,
            likedBy: user._id
        })
        await like.save()

        const foundLike = await Like.findById(like._id)
            .populate('comment')
            .populate('likedBy')
        expect(foundLike).not.toBeNull()
        expect(foundLike?.comment._id.toString()).toBe(comment._id.toString())
        expect(foundLike?.likedBy._id.toString()).toBe(user._id.toString())
    })

    it('should create a like for a tweet', async () => {
        const like = new Like({
            tweet: tweet._id,
            likedBy: user._id
        })
        await like.save()

        const foundLike = await Like.findById(like._id)
            .populate('tweet')
            .populate('likedBy')
        expect(foundLike).not.toBeNull()
        expect(foundLike?.tweet._id.toString()).toBe(tweet._id.toString())
        expect(foundLike?.likedBy._id.toString()).toBe(user._id.toString())
    })
})
