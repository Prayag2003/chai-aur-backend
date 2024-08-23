import express from 'express'
import {
    addComment,
    deleteComment,
    getVideoComments,
    updateComment
} from '../controllers/comment.controller'
import { verifyJWT as authenticateUser } from '../middleware'

const commentRouter = express.Router()

commentRouter.get('/video/:videoId', authenticateUser, getVideoComments)
commentRouter.post('/video/:videoId', authenticateUser, addComment)
commentRouter.put('/:commentId', authenticateUser, updateComment)
commentRouter.delete('/:commentId', authenticateUser, deleteComment)

export { commentRouter }
