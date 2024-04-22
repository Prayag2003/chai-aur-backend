// if the user has valid JWT, we will add an object named req.user to the req.body object

import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"

export const verifyJWT = asyncHandler(async (req, _, next) => {
    // TODO: How will you get the tokens 🤔?? 
    // The req object has access to the cookies, well how so? Since we added the cookie-parser middleware and it gives access of cookies to the request object
    try {
        const accessToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

        if (!accessToken) {
            throw new ApiError(401, "Unauthorized request")
        }

        // if token is correct, we need to use JWT and need to ask whether it's correct and what details it contains ( like here we send in username, email, id , refer to USER Model )
        const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

        if (!user) {
            throw new ApiError(401, "Invalid access token")
        }

        req.user = user
        next()

    } catch (error) {
        throw new ApiError(401, error?.message, "Invalid access token")
    }
})