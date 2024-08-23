import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../../app'
import { Comment, User, Video } from '../../../models'

// Sample user and video data
const sampleUser = {
    username: 'testuser',
    password: 'password123',
    email: 'testuser@example.com'
}

const sampleVideo = {
    title: 'Sample Video',
    description: 'This is a sample video description',
    videoFile: 'path/to/sampleVideo.mp4',
    thumbnail: 'path/to/sampleThumbnail.jpg'
}

let accessToken: string
let videoId: string

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI!, {})

    await User.create(sampleUser)
    const loginRes = await request(app)
        .post('/login')
        .send({ username: sampleUser.username, password: sampleUser.password })

    accessToken = loginRes.body.accessToken

    const publishRes = await request(app)
        .post('/publish-video')
        .set('Cookie', [`accessToken=${accessToken}`])
        .attach('videoFile', 'path/to/sampleVideo.mp4')
        .attach('thumbnail', 'path/to/sampleThumbnail.jpg')
        .send({
            title: sampleVideo.title,
            description: sampleVideo.description,
            shouldPublish: true
        })

    videoId = publishRes.body.data._id
})

afterAll(async () => {
    await User.deleteMany({})
    await Video.deleteMany({})
    await Comment.deleteMany({})
    await mongoose.disconnect()
})

describe('Video Management API', () => {
    describe('GET /videos', () => {
        it('should fetch all videos', async () => {
            const res = await request(app)
                .get('/videos')
                .set('Cookie', [`accessToken=${accessToken}`])

            expect(res.status).toBe(200)
            expect(res.body.message).toBe('Videos have been fetched')
            expect(res.body.data).toBeInstanceOf(Array)
        })
    })

    describe('GET /videos/:videoId', () => {
        it('should fetch a video by ID', async () => {
            const res = await request(app)
                .get(`/videos/${videoId}`)
                .set('Cookie', [`accessToken=${accessToken}`])

            expect(res.status).toBe(200)
            expect(res.body.message).toBe('Video has been fetched')
            expect(res.body.data).toHaveProperty('title', sampleVideo.title)
        })
    })

    describe('PUT /videos/:videoId', () => {
        it('should update video details', async () => {
            const res = await request(app)
                .put(`/videos/${videoId}`)
                .set('Cookie', [`accessToken=${accessToken}`])
                .attach('thumbnail', 'path/to/updatedThumbnail.jpg')
                .send({
                    title: 'Updated Title',
                    description: 'Updated description'
                })

            expect(res.status).toBe(200)
            expect(res.body.message).toBe('Video details have been updated')
            expect(res.body.data).toHaveProperty('title', 'Updated Title')
        })
    })

    describe('DELETE /videos/:videoId', () => {
        it('should delete a video', async () => {
            const res = await request(app)
                .delete(`/videos/${videoId}`)
                .set('Cookie', [`accessToken=${accessToken}`])

            expect(res.status).toBe(200)
            expect(res.body.message).toBe('Video has been successfully deleted')
        })
    })

    describe('PUT /videos/:videoId/publish', () => {
        it('should toggle video publish status', async () => {
            const res = await request(app)
                .put(`/videos/${videoId}/publish`)
                .set('Cookie', [`accessToken=${accessToken}`])

            expect(res.status).toBe(200)
            expect(res.body.message).toBe('Video status has been toggled')
            expect(res.body.data).toHaveProperty('isPublished')
        })
    })
})
