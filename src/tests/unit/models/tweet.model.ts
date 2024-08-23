import mongoose from 'mongoose'
import { Tweet, User } from '../../../models'

describe('Tweet Model', () => {
    afterEach(async () => {
        await Tweet.deleteMany({})
    })

    afterAll(async () => {
        await User.deleteMany({})
        await mongoose.connection.close()
    })

    it('should create a tweet', async () => {
        const user = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            fullname: 'Test User',
            avatar: 'avatar.png',
            coverImage: 'cover.png',
            password: 'plainpassword'
        })
        await user.save()

        const tweet = new Tweet({
            content: 'This is a test tweet',
            owner: user._id
        })

        await tweet.save()

        const foundTweet = await Tweet.findById(tweet._id).populate('owner')
        expect(foundTweet).not.toBeNull()
        expect(foundTweet?.content).toBe('This is a test tweet')
        expect(foundTweet?.owner._id.toString()).toBe(
            (user._id as string).toString()
        )
    })

    it('should enforce required content field', async () => {
        const user = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            fullname: 'Test User',
            avatar: 'avatar.png',
            coverImage: 'cover.png',
            password: 'plainpassword'
        })
        await user.save()

        const tweet = new Tweet({
            content: '',
            owner: user._id
        })

        await expect(tweet.save()).rejects.toThrow()
    })
})
