import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null

        // upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })

        // file uploaded successfully
        // console.log(`File uploaded successfully at: ${response.url}`)
        fs.unlinkSync(localFilePath)
        return response
    } catch (error) {
        // remove the file from the local server as upload operation got failed
        fs.unlinkSync(localFilePath)
        return null
    }
}

const deleteOldImage = async (oldAvatarURL) => {
    try {
        if (!oldAvatarURL) return null
        await cloudinary.uploader.destroy(oldAvatarURL,
            {
                invalidate: true,
                resource_type: "image"
            },
        )
        if (!response) {
            console.log("Couldn't delete the older image");
        }
        return response
    } catch (error) {
        console.log(error);
        return null
    }
}

export { uploadOnCloudinary, deleteOldImage }