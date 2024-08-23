import mongoose from 'mongoose'
import { Video, User } from '../../../models'

describe('Video Model', () => {
    afterEach(async () => {
        await Video.deleteMany({})
    })

    afterAll(async () => {
        await User.deleteMany({})
        await mongoose.connection.close()
    })

    it('should create a video', async () => {
        const user = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            fullname: 'Test User',
            avatar: 'avatar.png',
            coverImage: 'cover.png',
            password: 'plainpassword'
        })
        await user.save()

        const video = new Video({
            videoFile: 'video.mp4',
            thumbnail: 'thumbnail.png',
            title: 'Test Video',
            description: 'Test Description',
            duration: 120,
            owner: user._id
        })

        await video.save()

        const foundVideo = await Video.findById(video._id).populate('owner')
        expect(foundVideo).not.toBeNull()
        expect(foundVideo?.title).toBe('Test Video')
        expect(foundVideo?.owner._id.toString()).toBe(
            (user._id as string).toString()
        )
    })

    it('should enforce required fields', async () => {
        const video = new Video({
            videoFile: 'video.mp4',
            thumbnail: 'thumbnail.png',
            title: 'Test Video',
            description: 'Test Description',
            duration: 120
        })

        await expect(video.save()).rejects.toThrow()
    })
})
