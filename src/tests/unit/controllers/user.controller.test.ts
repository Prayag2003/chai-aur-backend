import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../../app'
import { User } from '../../../models'

const sampleUser = {
    username: 'testuser',
    email: 'testuser@example.com',
    fullname: 'Test User',
    password: 'password123'
}

const invalidUser = {
    username: '',
    email: 'invalidemail',
    fullname: '',
    password: ''
}

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URL!, {})
})

afterAll(async () => {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
})

describe('User Controller', () => {
    describe('POST /register', () => {
        it('should register a new user successfully', async () => {
            const res = await request(app)
                .post('/register')
                .attach('avatar', 'path/to/avatar.jpg')
                .attach('coverImage', 'path/to/coverImage.jpg')
                .field('username', sampleUser.username)
                .field('email', sampleUser.email)
                .field('fullname', sampleUser.fullname)
                .field('password', sampleUser.password)

            expect(res.status).toBe(201)
            expect(res.body.message).toBe('User registered successfully!')
            expect(res.body.data).toHaveProperty(
                'username',
                sampleUser.username
            )
            expect(res.body.data).toHaveProperty('email', sampleUser.email)
        })

        it('should return error if required fields are missing', async () => {
            const res = await request(app).post('/register').send(invalidUser)

            expect(res.status).toBe(400)
            expect(res.body.message).toBe('All fields are compulsory.')
        })

        it('should return error if user already exists', async () => {
            await User.create(sampleUser)
            const res = await request(app).post('/register').send(sampleUser)

            expect(res.status).toBe(409)
            expect(res.body.message).toBe(
                'User with email or username already exists'
            )
        })
    })

    describe('POST /login', () => {
        it('should log in a user and return tokens', async () => {
            await User.create(sampleUser)
            const res = await request(app).post('/login').send({
                username: sampleUser.username,
                password: sampleUser.password
            })

            expect(res.status).toBe(200)
            expect(res.body.message).toBe('user logged in successfully')

            const cookiesHeader = res.headers[
                'set-cookie'
            ] as unknown as string[]
            expect(cookiesHeader).toBeDefined()

            const accessTokenCookie = cookiesHeader.find((cookie) =>
                cookie.startsWith('accessToken=')
            )
            const refreshTokenCookie = cookiesHeader.find((cookie) =>
                cookie.startsWith('refreshToken=')
            )

            expect(accessTokenCookie).toBeDefined()
            expect(refreshTokenCookie).toBeDefined()
        })

        it('should return error for invalid credentials', async () => {
            const res = await request(app).post('/login').send({
                username: sampleUser.username,
                password: 'wrongpassword'
            })

            expect(res.status).toBe(401)
            expect(res.body.message).toBe('Invalid user credentials')
        })

        it('should return error if username or email is missing', async () => {
            const res = await request(app)
                .post('/login')
                .send({ password: sampleUser.password })

            expect(res.status).toBe(400)
            expect(res.body.message).toBe('username or email is required')
        })
    })

    describe('POST /logout', () => {
        it('should log out a user', async () => {
            const loginRes = await request(app).post('/login').send({
                username: sampleUser.username,
                password: sampleUser.password
            })

            const cookiesHeader = loginRes.headers[
                'set-cookie'
            ] as unknown as string[]
            const accessTokenCookie = cookiesHeader.find((cookie) =>
                cookie.startsWith('accessToken=')
            )

            const res = await request(app)
                .post('/logout')
                .set('Cookie', accessTokenCookie ? [accessTokenCookie] : [])

            expect(res.status).toBe(200)
            expect(res.body.message).toBe('User logged out')
        })
    })

    describe('POST /refresh-token', () => {
        it('should refresh the access token', async () => {
            const loginRes = await request(app).post('/login').send({
                username: sampleUser.username,
                password: sampleUser.password
            })

            const cookiesHeader = loginRes.headers[
                'set-cookie'
            ] as unknown as string[]
            const refreshTokenCookie = cookiesHeader.find((cookie) =>
                cookie.startsWith('refreshToken=')
            )

            const res = await request(app)
                .post('/refresh-token')
                .set('Cookie', refreshTokenCookie ? [refreshTokenCookie] : [])

            expect(res.status).toBe(200)
            expect(res.body.message).toBe('Access Token refreshed')

            const newCookiesHeader = res.headers[
                'set-cookie'
            ] as unknown as string[]
            const newAccessTokenCookie = newCookiesHeader.find((cookie) =>
                cookie.startsWith('accessToken=')
            )
            const newRefreshTokenCookie = newCookiesHeader.find((cookie) =>
                cookie.startsWith('refreshToken=')
            )

            expect(newAccessTokenCookie).toBeDefined()
            expect(newRefreshTokenCookie).toBeDefined()
        })
    })

    describe('PUT /change-password', () => {
        it('should change the user password successfully', async () => {
            await User.create(sampleUser)
            const loginRes = await request(app).post('/login').send({
                username: sampleUser.username,
                password: sampleUser.password
            })

            const cookiesHeader = loginRes.headers[
                'set-cookie'
            ] as unknown as string[]
            const accessTokenCookie = cookiesHeader.find((cookie) =>
                cookie.startsWith('accessToken=')
            )

            const res = await request(app)
                .put('/change-password')
                .set('Cookie', accessTokenCookie ? [accessTokenCookie] : [])
                .send({
                    oldPassword: sampleUser.password,
                    newPassword: 'newpassword123',
                    confPassword: 'newpassword123'
                })

            expect(res.status).toBe(200)
            expect(res.body.message).toBe('Password changed successfully.')
        })

        it('should return error if passwords do not match', async () => {
            await User.create(sampleUser)
            const loginRes = await request(app).post('/login').send({
                username: sampleUser.username,
                password: sampleUser.password
            })

            const cookiesHeader = loginRes.headers[
                'set-cookie'
            ] as unknown as string[]
            const accessTokenCookie = cookiesHeader.find((cookie) =>
                cookie.startsWith('accessToken=')
            )

            const res = await request(app)
                .put('/change-password')
                .set('Cookie', accessTokenCookie ? [accessTokenCookie] : [])
                .send({
                    oldPassword: sampleUser.password,
                    newPassword: 'newpassword123',
                    confPassword: 'differentpassword'
                })

            expect(res.status).toBe(400)
            expect(res.body.message).toBe('passwords do not match...')
        })
    })

    describe('GET /current-user', () => {
        it('should return the current logged-in user', async () => {
            await User.create(sampleUser)
            const loginRes = await request(app).post('/login').send({
                username: sampleUser.username,
                password: sampleUser.password
            })

            const cookiesHeader = loginRes.headers[
                'set-cookie'
            ] as unknown as string[]
            const accessTokenCookie = cookiesHeader.find((cookie) =>
                cookie.startsWith('accessToken=')
            )

            const res = await request(app)
                .get('/current-user')
                .set('Cookie', accessTokenCookie ? [accessTokenCookie] : [])

            expect(res.status).toBe(200)
            expect(res.body.message).toBe('user fetched successfully.')
            expect(res.body.data).toHaveProperty(
                'username',
                sampleUser.username
            )
        })
    })

    describe('PUT /update-account-details', () => {
        it('should update account details successfully', async () => {
            await User.create(sampleUser)
            const loginRes = await request(app).post('/login').send({
                username: sampleUser.username,
                password: sampleUser.password
            })

            const cookiesHeader = loginRes.headers[
                'set-cookie'
            ] as unknown as string[]
            const accessTokenCookie = cookiesHeader.find((cookie) =>
                cookie.startsWith('accessToken=')
            )

            const res = await request(app)
                .put('/update-account-details')
                .set('Cookie', accessTokenCookie ? [accessTokenCookie] : [])
                .send({
                    fullname: 'Updated User',
                    email: 'updateduser@example.com'
                })

            expect(res.status).toBe(200)
            expect(res.body.message).toBe(
                'Account details updated successfully.'
            )
            expect(res.body.data).toHaveProperty('fullname', 'Updated User')
        })
    })

    describe('PUT /update-avatar', () => {
        it('should update avatar successfully', async () => {
            await User.create(sampleUser)
            const loginRes = await request(app).post('/login').send({
                username: sampleUser.username,
                password: sampleUser.password
            })

            const cookiesHeader = loginRes.headers[
                'set-cookie'
            ] as unknown as string[]
            const accessTokenCookie = cookiesHeader.find((cookie) =>
                cookie.startsWith('accessToken=')
            )

            const res = await request(app)
                .put('/update-avatar')
                .set('Cookie', accessTokenCookie ? [accessTokenCookie] : [])
                .attach('file', 'path/to/newAvatar.jpg')

            expect(res.status).toBe(200)
            expect(res.body.message).toBe('avatar updated successfully')
        })

        it('should return error if avatar file is missing', async () => {
            await User.create(sampleUser)
            const loginRes = await request(app).post('/login').send({
                username: sampleUser.username,
                password: sampleUser.password
            })

            const cookiesHeader = loginRes.headers[
                'set-cookie'
            ] as unknown as string[]
            const accessTokenCookie = cookiesHeader.find((cookie) =>
                cookie.startsWith('accessToken=')
            )

            const res = await request(app)
                .put('/update-avatar')
                .set('Cookie', accessTokenCookie ? [accessTokenCookie] : [])

            expect(res.status).toBe(400)
            expect(res.body.message).toBe('No file uploaded')
        })
    })

    describe('PUT /update-cover-image', () => {
        it('should update cover image successfully', async () => {
            await User.create(sampleUser)
            const loginRes = await request(app).post('/login').send({
                username: sampleUser.username,
                password: sampleUser.password
            })

            const cookiesHeader = loginRes.headers[
                'set-cookie'
            ] as unknown as string[]
            const accessTokenCookie = cookiesHeader.find((cookie) =>
                cookie.startsWith('accessToken=')
            )

            const res = await request(app)
                .put('/update-cover-image')
                .set('Cookie', accessTokenCookie ? [accessTokenCookie] : [])
                .attach('file', 'path/to/newCoverImage.jpg')

            expect(res.status).toBe(200)
            expect(res.body.message).toBe('cover image updated successfully')
        })

        it('should return error if cover image file is missing', async () => {
            await User.create(sampleUser)
            const loginRes = await request(app).post('/login').send({
                username: sampleUser.username,
                password: sampleUser.password
            })

            const cookiesHeader = loginRes.headers[
                'set-cookie'
            ] as unknown as string[]
            const accessTokenCookie = cookiesHeader.find((cookie) =>
                cookie.startsWith('accessToken=')
            )

            const res = await request(app)
                .put('/update-cover-image')
                .set('Cookie', accessTokenCookie ? [accessTokenCookie] : [])

            expect(res.status).toBe(400)
            expect(res.body.message).toBe('No file uploaded')
        })
    })
})
