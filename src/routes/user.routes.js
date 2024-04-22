import { Router } from "express";
import {
    registerUser, loginUser,
    logoutUser, refreshAccessToken,
    updateAccountDetails, updateAvatar,
    changeCurrentPassword, getCurrentUser,
    updateCoverImage, getUserChannelProfile,
    getWatchHistory
}
    from "../controllers/user.controller.js";

import { upload } from "../middleware/multer.middleware.js"
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router()

router.route("/register").post(
    // NOTE: Multer middleware injection
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ])
    ,
    registerUser)

router.route("/login").post(loginUser)

// secured routes   
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)

router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/c/:username").get(verifyJWT, getUserChannelProfile)
router.route("/history").get(verifyJWT, getWatchHistory)

router.route("/update-password").post(verifyJWT, changeCurrentPassword)

router.route("/update-account").patch(verifyJWT, updateAccountDetails)
router.route("/update-avatar").patch(
    verifyJWT,
    upload.single("avatar"),
    updateAvatar)
router.route("/cover-image").patch(verifyJWT, upload.single("coverImage"), updateCoverImage)

export default router