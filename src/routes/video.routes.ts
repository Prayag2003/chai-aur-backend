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

const videoRouter = Router()

videoRouter.route('/').get(getAllVideos)

videoRouter.route('/').post(
    verifyJWT,
    upload.fields([
        { name: 'videoFile', maxCount: 1 },
        { name: 'thumbnail', maxCount: 1 }
    ]),
    publishAVideo
)

videoRouter.route('/:videoId').get(getVideoById)

videoRouter
    .route('/:videoId')
    .patch(verifyJWT, upload.single('thumbnail'), updateVideo)

videoRouter.route('/:videoId').delete(verifyJWT, deleteVideo)
videoRouter
    .route('/:videoId/toggle-publish')
    .patch(verifyJWT, togglePublishStatus)

export { videoRouter }
