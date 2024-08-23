import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User } from '../../../models'

describe('User Model', () => {
    afterEach(async () => {
        await User.deleteMany({})
    })

    it('should hash the password before saving', async () => {
        const user = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            fullname: 'Test User',
            avatar: 'avatar.png',
            coverImage: 'cover.png',
            password: 'plainpassword'
        })

        await user.save()

        expect(user.password).not.toBe('plainpassword')
        const isMatch = await bcrypt.compare('plainpassword', user.password)
        expect(isMatch).toBe(true)
    })

    it('should validate a correct password', async () => {
        const user = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            fullname: 'Test User',
            avatar: 'avatar.png',
            coverImage: 'cover.png',
            password: 'plainpassword'
        })

        await user.save()

        const isPasswordCorrect = await user.isPasswordCorrect('plainpassword')
        expect(isPasswordCorrect).toBe(true)
    })

    it('should invalidate an incorrect password', async () => {
        const user = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            fullname: 'Test User',
            avatar: 'avatar.png',
            coverImage: 'cover.png',
            password: 'plainpassword'
        })

        await user.save()

        const isPasswordCorrect = await user.isPasswordCorrect('wrongpassword')
        expect(isPasswordCorrect).toBe(false)
    })

    it('should generate a valid JWT access token', () => {
        const user = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            fullname: 'Test User',
            avatar: 'avatar.png',
            coverImage: 'cover.png',
            password: 'plainpassword'
        })

        const token = user.generateAccessToken()
        const decoded = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET as string
        ) as jwt.JwtPayload & { _id: string; username: string; email: string }

        expect(decoded).toHaveProperty('_id', (user._id as string).toString())
        expect(decoded).toHaveProperty('username', user.username)
        expect(decoded).toHaveProperty('email', user.email)
    })

    it('should generate a valid JWT refresh token', () => {
        const user = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            fullname: 'Test User',
            avatar: 'avatar.png',
            coverImage: 'cover.png',
            password: 'plainpassword'
        })

        const token = user.generateRefreshToken()
        const decoded = jwt.verify(
            token,
            process.env.REFRESH_TOKEN_SECRET as string
        ) as jwt.JwtPayload & { _id: string }

        expect(decoded).toHaveProperty('_id', (user._id as string).toString())
    })

    it('should enforce unique username and email', async () => {
        const user1 = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            fullname: 'Test User',
            avatar: 'avatar.png',
            coverImage: 'cover.png',
            password: 'password'
        })

        await user1.save()

        const user2 = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            fullname: 'Another User',
            avatar: 'avatar2.png',
            coverImage: 'cover2.png',
            password: 'password'
        })

        await expect(user2.save()).rejects.toThrow()
    })
})
