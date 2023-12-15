
const asyncHandler = (requestHandler) => {
    (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next))
            .catch((err) => next(err))
    }
}
export { asyncHandler }


// NOTE: High Order functions

// const asyncHandler = () => { }
// const asyncHandler = (func) =>  { }
// const asyncHandler = (func) => { () => { } }


// // Wrapper function which can be used everywhere
// const asyncHandler = (fn) => async (req, res, next) => {
//     try {
//         await fn(req, res, next)
//     } catch (error) {
//         console.log("Error");
//         res.status(err.code || 500).json(
//             {
//                 success: false,
//                 message: err.message
//             }
//         )
//     }
// }

// METHOD-2