import mongoose from 'mongoose'
import { Playlist, User, Video } from '../../../models'

describe('Playlist Model', () => {
    let user: any, video: any

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
    })

    afterEach(async () => {
        await Playlist.deleteMany({})
    })

    afterAll(async () => {
        await User.deleteMany({})
        await Video.deleteMany({})
        await mongoose.connection.close()
    })

    it('should create a playlist', async () => {
        const playlist = new Playlist({
            name: 'Test Playlist',
            description: 'Test Playlist Description',
            videos: [video._id],
            owner: user._id
        })

        await playlist.save()

        const foundPlaylist = await Playlist.findById(playlist._id)
            .populate('videos')
            .populate('owner')
        expect(foundPlaylist).not.toBeNull()
        expect(foundPlaylist?.name).toBe('Test Playlist')
        expect(foundPlaylist?.videos[0]._id.toString()).toBe(
            video._id.toString()
        )
        expect(foundPlaylist?.owner._id.toString()).toBe(user._id.toString())
    })

    it('should enforce required fields', async () => {
        const playlist = new Playlist({
            name: 'Test Playlist',
            description: 'Test Playlist Description',
            owner: user._id
        })

        await expect(playlist.save()).rejects.toThrow()
    })
})
