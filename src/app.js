import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

// handle json or forms
app.use(express.json({ limit: "16kb" }))

// handle data coming from the urls
app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}))

// to serve static files such as images, CSS files
app.use(express.static("public"))

// CookieParser basically manages or performs CRUD on the user cookies.
// Secured cookies are managed only by the server
app.use(cookieParser())


// NOTE: routes import

import userRouter from "./routes/user.routes.js"

// NOTE: routes declarations
// eg: http://localhost:8000/api/v1/users/register
app.use("/api/v1/users", userRouter)

export { app }