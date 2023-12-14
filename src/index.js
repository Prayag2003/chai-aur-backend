// require("dotenv").config({ path: './env' })  // inconsistent with import
import dotenv from "dotenv"
import connectDB from "./db/conn.js";
import { app } from "./app.js";
dotenv.config(
    { path: './env' }
)

const port = process.env.PORT || 8000

// NOTE: listening to any errors from app
app.on("error", (error) => {
    console.log("ERR: ", error);
    process.exit(1)
})

// NOTE: ConnectDB returns a promise since every async call returns a promise
connectDB()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is running or app is listening to ${process.env.PORT}`);
        })
    })
    .catch((err) => {
        console.log("MongoDB failed to connect ...");
    })
