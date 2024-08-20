import dotenv from 'dotenv'
import { app } from './app'
import { connectDB } from './db'
const port = process.env.PORT || 8000

dotenv.config({ path: './.env' })

// NOTE: ConnectDB returns a promise since every async call returns a promise
connectDB()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`)
        })
    })
    .catch((err: Error) => {
        console.error('MongoDB failed to connect ...', err.message)
    })
