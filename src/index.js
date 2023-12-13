// require("dotenv").config({ path: './env' })  // inconsistent with import
import dotenv from "dotenv"
import connectDB from "./db/conn.js";
dotenv.config(
    { path: './env' }
)

connectDB()
