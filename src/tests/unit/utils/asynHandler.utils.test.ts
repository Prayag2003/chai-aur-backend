import { NextFunction, Request, Response } from 'express'
import { AsyncHandler } from '../../../utils'

describe('AsyncHandler Utility', () => {
    it('should handle async routes and pass errors to next', async () => {
        const req = {} as Request
        const res = {} as Response
        const next: NextFunction = jest.fn()

        const handler = AsyncHandler(
            async (req: Request, res: Response, next: NextFunction) => {
                throw new Error('Test error')
            }
        )

        handler(req, res, next)
        expect(next).toHaveBeenCalledWith(new Error('Test error'))
    })

    it('should handle successful async routes', async () => {
        const req = {} as Request
        const res = {} as Response
        const next: NextFunction = jest.fn()

        const handler = AsyncHandler(
            async (req: Request, res: Response, next: NextFunction) => {
                res.send('Success')
            }
        )

        await handler(req, res, next)
        expect(res.send).toHaveBeenCalledWith('Success')
    })
})
