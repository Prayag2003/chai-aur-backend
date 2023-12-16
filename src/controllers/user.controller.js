import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"

const registerUser = asyncHandler(async (req, res) => {
    // NOTE: Steps 
    // 1. get the user details from frontend
    // 2. apply validation, if not empty 
    // 3. check if the user already exists(via uname or email)
    // 4. check if we have files uploaded(avator and image)
    // 5. upload them to cloudinary
    // 6. create user object - create entry in DB 
    // 7. remove pw and refresh token field from response 
    // 8. check for user creation 
    // 9. return the response 

    // fetching user data
    const { username, email, fullname, password } = req.body
    console.log(fullname, email);

    // Validation
    // if (username === "") {
    //     throw new ApiError(400, "Username is required field")
    // }

    if (
        [username, fullname, email, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are compulsory.")
    }
})

const loginUser = asyncHandler(async (req, res) => {

})

export { registerUser, loginUser }