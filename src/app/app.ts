import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { Express } from 'express'

const app: Express = express()

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true
    })
)

// Handle JSON or forms
app.use(express.json({ limit: '16kb' }))

// Handle data coming from URLs
app.use(
    express.urlencoded({
        extended: true,
        limit: '16kb'
    })
)

// Serve static files such as images, CSS files
app.use(express.static('public'))

// CookieParser basically manages or performs CRUD on the user cookies.
// Secured cookies are managed only by the server
app.use(cookieParser())

// NOTE: Routes import
import {
    commentRouter,
    likeRouter,
    playlistRouter,
    tweetRouter,
    userRouter,
    videoRouter
} from '../routes'
import { subscriptionRouter } from '../routes/subscription.routes'

app.use('/api/v1/users', userRouter)
app.use('/api/v1/videos', videoRouter)
app.use('/api/v1/likes', likeRouter)
app.use('/api/v1/tweets', tweetRouter)
app.use('/api/v1/playlists', playlistRouter)
app.use('/api/v1/comments', commentRouter)
app.use('/api/v1/subscriptions', subscriptionRouter)

export { app }
