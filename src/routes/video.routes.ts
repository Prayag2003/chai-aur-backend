import { Router } from 'express'
import {
    deleteVideo,
    getAllVideos,
    getVideoById,
    publishAVideo,
    togglePublishStatus,
    updateVideo
} from '../controllers'
import { verifyJWT, upload } from '../middleware'

const router = Router()

router.route('/').get(getAllVideos)

router.route('/').post(
    verifyJWT,
    upload.fields([
        { name: 'videoFile', maxCount: 1 },
        { name: 'thumbnail', maxCount: 1 }
    ]),
    publishAVideo
)

router.route('/:videoId').get(getVideoById)

router
    .route('/:videoId')
    .patch(verifyJWT, upload.single('thumbnail'), updateVideo)

router.route('/:videoId').delete(verifyJWT, deleteVideo)
router.route('/:videoId/toggle-publish').patch(verifyJWT, togglePublishStatus)

export { router as videoRouter }
