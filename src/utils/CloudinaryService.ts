import { v2 as cloudinary, UploadApiResponse } from 'cloudinary'
import fs from 'fs'
import dotenv from 'dotenv'
dotenv.config({ path: './.env' })

// Cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

// Type definition for the upload function
const uploadOnCloudinary = async (
    localFilePath: string
): Promise<UploadApiResponse | null> => {
    try {
        if (!localFilePath) return null

        // Upload the file to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto'
        })

        // File uploaded successfully, delete it locally
        fs.unlinkSync(localFilePath)
        return response
    } catch (error) {
        // If the upload failed, delete the local file
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath)
        }
        console.error('Upload failed:', error)
        return null
    }
}

// Type definition for the delete function
const deleteOldImage = async (
    oldAvatarURL: string | undefined
): Promise<boolean | null> => {
    try {
        if (!oldAvatarURL) return null

        // Remove the file extension from the URL
        const imageUrlWithoutExtension = oldAvatarURL.slice(
            0,
            oldAvatarURL.lastIndexOf('.')
        )

        // Extract the public ID from the URL
        const publicId = imageUrlWithoutExtension.split('/').pop()

        if (!publicId) {
            console.error('Invalid URL, unable to extract public ID.')
            return null
        }

        // Delete the image from Cloudinary
        const response = await cloudinary.uploader.destroy(publicId, {
            invalidate: true,
            resource_type: 'image'
        })

        if (response.result !== 'ok') {
            console.log("Couldn't delete the older image")
            return false
        }

        return true
    } catch (error) {
        console.error('Deletion failed:', error)
        return null
    }
}

export { deleteOldImage, uploadOnCloudinary }
