import mongoose from "mongoose"
import { DB_NAME } from "./constants"

import express from "express"
const app = express()

    ; (
        async () => {
            try {
                await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
                // NOTE: Listeners of the event, express app unable to talk
                app.on("error", (error) => {
                    console.log("Cannot talk to the express app", error);
                    throw error
                })

                app.listen(process.env.PORT, () => {
                    console.log(`App is listening on http://localhost:/${process.env.PORT}`);
                })
            }
            catch (error) {
                console.log("ERROR: ", err);
            }

        })()