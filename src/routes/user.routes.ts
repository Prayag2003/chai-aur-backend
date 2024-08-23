import { Router } from 'express'
import {
    changeCurrentPassword,
    getCurrentUser,
    getUserChannelProfile,
    getWatchHistory,
    loginUser,
    logoutUser,
    refreshAccessToken,
    registerUser,
    updateAccountDetails,
    updateAvatar,
    updateCoverImage
} from '../controllers'

import { upload, verifyJWT } from '../middleware'

const userRouter = Router()

userRouter.route('/register').post(
    // NOTE: Multer middleware injection
    upload.fields([
        {
            name: 'avatar',
            maxCount: 1
        },
        {
            name: 'coverImage',
            maxCount: 1
        }
    ]),
    registerUser
)

userRouter.route('/login').post(loginUser)

// secured routes
userRouter.route('/logout').post(verifyJWT, logoutUser)
userRouter.route('/refresh-token').post(refreshAccessToken)

userRouter.route('/current-user').get(verifyJWT, getCurrentUser)
userRouter.route('/c/:username').get(verifyJWT, getUserChannelProfile)
userRouter.route('/history').get(verifyJWT, getWatchHistory)

userRouter.route('/update-password').post(verifyJWT, changeCurrentPassword)

userRouter.route('/update-account').patch(verifyJWT, updateAccountDetails)
userRouter
    .route('/update-avatar')
    .patch(verifyJWT, upload.single('avatar'), updateAvatar)
userRouter
    .route('/cover-image')
    .patch(verifyJWT, upload.single('coverImage'), updateCoverImage)

export { userRouter }
