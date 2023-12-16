import { Router } from "express";
import { registerUser, loginUser } from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js"

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

router.route("/login").get(loginUser)

export default router