import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'
import {
    deleteOldImage,
    deleteOldVideo,
    uploadOnCloudinary,
    uploadVideoOnCloudinary
} from '../../../utils'

jest.mock('cloudinary', () => ({
    v2: {
        uploader: {
            upload: jest.fn(),
            destroy: jest.fn()
        }
    }
}))

describe('Cloudinary Utilities', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('should upload an image and return the response', async () => {
        ;(cloudinary.uploader.upload as jest.Mock).mockResolvedValueOnce({
            secure_url: 'http://example.com/image.jpg'
        })

        const response = await uploadOnCloudinary('path/to/local/file.jpg')

        expect(cloudinary.uploader.upload).toHaveBeenCalledWith(
            'path/to/local/file.jpg',
            { resource_type: 'auto' }
        )
        expect(response).toEqual({ secure_url: 'http://example.com/image.jpg' })
    })

    it('should handle upload failure and delete local file', async () => {
        ;(cloudinary.uploader.upload as jest.Mock).mockRejectedValueOnce(
            new Error('Upload error')
        )

        const unlinkSyncSpy = jest
            .spyOn(fs, 'unlinkSync')
            .mockImplementation(() => {})

        const response = await uploadOnCloudinary('path/to/local/file.jpg')

        expect(cloudinary.uploader.upload).toHaveBeenCalledWith(
            'path/to/local/file.jpg',
            { resource_type: 'auto' }
        )
        expect(unlinkSyncSpy).toHaveBeenCalledWith('path/to/local/file.jpg')
        expect(response).toBeNull()
    })

    it('should delete an old image', async () => {
        ;(cloudinary.uploader.destroy as jest.Mock).mockResolvedValueOnce({
            result: 'ok'
        })

        const result = await deleteOldImage('http://example.com/image.jpg')

        expect(cloudinary.uploader.destroy).toHaveBeenCalledWith('image', {
            invalidate: true,
            resource_type: 'image'
        })
        expect(result).toBe(true)
    })

    it('should handle image deletion failure', async () => {
        ;(cloudinary.uploader.destroy as jest.Mock).mockResolvedValueOnce({
            result: 'fail'
        })

        const result = await deleteOldImage('http://example.com/image.jpg')

        expect(cloudinary.uploader.destroy).toHaveBeenCalledWith('image', {
            invalidate: true,
            resource_type: 'image'
        })
        expect(result).toBe(false)
    })

    it('should upload a video and return the response', async () => {
        ;(cloudinary.uploader.upload as jest.Mock).mockResolvedValueOnce({
            secure_url: 'http://example.com/video.mp4'
        })

        const response = await uploadVideoOnCloudinary(
            'path/to/local/video.mp4'
        )

        expect(cloudinary.uploader.upload).toHaveBeenCalledWith(
            'path/to/local/video.mp4',
            { resource_type: 'video' }
        )
        expect(response).toEqual({ secure_url: 'http://example.com/video.mp4' })
    })

    it('should handle video upload failure and delete local file', async () => {
        ;(cloudinary.uploader.upload as jest.Mock).mockRejectedValueOnce(
            new Error('Video upload error')
        )

        const unlinkSyncSpy = jest
            .spyOn(fs, 'unlinkSync')
            .mockImplementation(() => {})

        const response = await uploadVideoOnCloudinary(
            'path/to/local/video.mp4'
        )

        expect(cloudinary.uploader.upload).toHaveBeenCalledWith(
            'path/to/local/video.mp4',
            { resource_type: 'video' }
        )
        expect(unlinkSyncSpy).toHaveBeenCalledWith('path/to/local/video.mp4')
        expect(response).toBeNull()
    })

    it('should delete an old video', async () => {
        ;(cloudinary.uploader.destroy as jest.Mock).mockResolvedValueOnce({
            result: 'ok'
        })

        const result = await deleteOldVideo('http://example.com/video.mp4')

        expect(cloudinary.uploader.destroy).toHaveBeenCalledWith('video', {
            invalidate: true,
            resource_type: 'video'
        })
        expect(result).toBe(true)
    })

    it('should handle video deletion failure', async () => {
        ;(cloudinary.uploader.destroy as jest.Mock).mockResolvedValueOnce({
            result: 'fail'
        })

        const result = await deleteOldVideo('http://example.com/video.mp4')

        expect(cloudinary.uploader.destroy).toHaveBeenCalledWith('video', {
            invalidate: true,
            resource_type: 'video'
        })
        expect(result).toBe(false)
    })
})
