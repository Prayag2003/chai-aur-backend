// NOTE: If the user has valid JWT Token, we will add an object named req.user to the req.body object

import jwt from 'jsonwebtoken'
import {User} from '../models'
import {ApiError, AsyncHandler} from '../utils'
import {NextFunction, Request, Response} from 'express'

// NOTE: Add a `user` property to the request object
interface customRequest extends Request {
    user?: any
}

interface DecodedToken {
    _id: string
}

export const verifyJWT = AsyncHandler(
    async (req: customRequest, res: Response, next: NextFunction) => {
        /**
         *
         * NOTE: How will you get the tokens 🤔??
         * The req object has access to the cookies, well how so? Since we added the cookie-parser middleware and it gives access of cookies to the request object
         *
         */
        try {
            const accessToken =
                req.cookies?.accessToken ||
                req.header('Authorization')?.replace('Bearer ', '')

            if (!accessToken) {
                throw new ApiError(401, 'Unauthorized request')
            }

            // if token is correct, we need to use JWT and need to ask whether it's correct and what details it contains ( like here we send in username, email, id , refer to USER Model )
            const decodedToken = jwt.verify(
                accessToken,
                process.env.ACCESS_TOKEN_SECRET!
            ) as DecodedToken

            const user = await User.findById(decodedToken._id).select(
                '-password -refreshToken'
            )

            if (!user) {
                throw new ApiError(401, 'Invalid access token')
            }

            // IMPORTANT: Add the user to the request object
            req.user = user
            next()
        } catch (error) {
            if (error instanceof ApiError) {
                next(error)
            } else {
                const errorMessage =
                    error instanceof Error
                        ? error.message
                        : 'Invalid access token'
                next(new ApiError(401, errorMessage))
            }
        }
    }
)
