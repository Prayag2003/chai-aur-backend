
const requestHandler = (requestHandler) => {
    (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next))
            .catch((err) => next(err))
    }
}
export { requestHandler }


// NOTE: High Order functions

// const requestHandler = () => { }
// const requestHandler = (func) =>  { }
// const requestHandler = (func) => { () => { } }


// // Wrapper function which can be used everywhere
// const requestHandler = (fn) => async (req, res, next) => {
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