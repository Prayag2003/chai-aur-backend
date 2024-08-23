import { v2 as cloudinary, UploadApiResponse } from 'cloudinary'
import dotenv from 'dotenv'
import fs from 'fs'

dotenv.config({ path: './.env' })

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const uploadVideoOnCloudinary = async (
    localFilePath: string
): Promise<UploadApiResponse | null> => {
    try {
        if (!localFilePath) return null

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'video'
        })

        fs.unlinkSync(localFilePath)
        return response
    } catch (error) {
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath)
        }
        console.error('Video upload failed:', error)
        return null
    }
}

const deleteOldVideo = async (
    oldVideoURL: string | undefined
): Promise<boolean | null> => {
    try {
        if (!oldVideoURL) return null

        const videoUrlWithoutExtension = oldVideoURL.slice(
            0,
            oldVideoURL.lastIndexOf('.')
        )

        const publicId = videoUrlWithoutExtension.split('/').pop()

        if (!publicId) {
            console.error('Invalid URL, unable to extract public ID.')
            return null
        }

        const response = await cloudinary.uploader.destroy(publicId, {
            invalidate: true,
            resource_type: 'video'
        })

        if (response.result !== 'ok') {
            console.log("Couldn't delete the older video")
            return false
        }

        return true
    } catch (error) {
        console.error('Video deletion failed:', error)
        return null
    }
}

export { deleteOldVideo, uploadVideoOnCloudinary }
