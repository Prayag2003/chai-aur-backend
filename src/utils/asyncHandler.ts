import { NextFunction, Request, RequestHandler, Response } from "express";

/**
 * @description: @HighOrderFunction
 * The asyncHandler function is a utility that wraps asynchronous request handlers (middleware functions) in Express.js. It ensures that any errors thrown during the execution of an asynchronous function are properly caught and passed to the next middleware in the chain, typically an error-handling middleware.
 */

/**
 * @description
 * In Express.js, when an asynchronous operation (e.g., a database query) inside a route handler fails (throws an error), it should be caught and passed to the next middleware (usually an error handler). However, if you forget to handle the error or use try-catch, the error won't be caught, leading to unhandled promise rejections or other issues.
 *
 * The asyncHandler utility simplifies this by automatically catching any errors that occur inside the asynchronous handler and passing them to the next function.
 */

type AsyncHandler<T extends Request> = (
  req: T,
  res: Response,
  next: NextFunction
) => Promise<Response | void>;

export const AsyncHandler =
  <T extends Request>(fn: AsyncHandler<T>): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req as T, res, next)).catch(next);
  };

/** 
 * 
 * @documentation @WithoutAsyncHandler
 * app.get('/data', async (req, res, next) => {
  try {
    const data = await getDataFromDatabase();
    res.json(data);
  } catch (error) {
    next(error); // You have to remember to catch errors and pass them to next()
  }
}); 

  * @documentation @WithAsyncHandler
  * app.get('/data', asyncHandler(async (req, res) => {
  *     const data = await getDataFromDatabase();
  *     res.json(data);
  * }));

*/
