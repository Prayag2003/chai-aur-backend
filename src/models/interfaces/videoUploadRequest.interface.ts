import { Request } from 'express'

export interface VideoUploadRequest extends Request {
    files: {
        videoFile?: Express.Multer.File[]
        thumbnail?: Express.Multer.File[]
    }
}
