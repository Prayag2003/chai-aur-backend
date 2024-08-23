import { ApiError, ApiResponse } from '../../../utils'

describe('ApiError Class', () => {
    it('should create an instance with the correct properties', () => {
        const error = new ApiError(
            400,
            'Bad Request',
            ['Invalid data'],
            'Error stack trace'
        )

        expect(error).toBeInstanceOf(ApiError)
        expect(error.statusCode).toBe(400)
        expect(error.message).toBe('Bad Request')
        expect(error.errors).toEqual(['Invalid data'])
        expect(error.stack).toBe('Error stack trace')
    })

    it('should use default message and stack trace if not provided', () => {
        const error = new ApiError(404)

        expect(error.message).toBe('Something went wrong')
        expect(error.stack).not.toBeUndefined()
    })
})

describe('ApiResponse Class', () => {
    it('should create an instance with the correct properties', () => {
        const response = new ApiResponse(
            200,
            { key: 'value' },
            'Request succeeded'
        )

        expect(response).toBeInstanceOf(ApiResponse)
        expect(response.statusCode).toBe(200)
        expect(response.data).toEqual({ key: 'value' })
        expect(response.message).toBe('Request succeeded')
        expect(response.success).toBe(true)
    })

    it('should set success to false for error status codes', () => {
        const response = new ApiResponse(500, null, 'Internal Server Error')

        expect(response.success).toBe(false)
    })
})
