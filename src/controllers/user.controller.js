import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary_service.js"
import { ApiResponse } from "../utils/ApiResponse.js"

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

    // NOTE: fetching user data
    const { username, email, fullname, password } = req.body
    console.log(fullname, email);

    // NOTE: Validation
    // if (username === "") {
    //     throw new ApiError(400, "Username is required field")
    // }

    if (
        [username, fullname, email, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are compulsory.")
    }

    // NOTE: Checking if the user already exists
    // User.findOne(username)
    const existingUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existingUser) {
        throw new ApiError(409, "User with email or username already exists")
    }

    // NOTE: Checking the images  { Optional Chaining is used here }
    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverImageLocalPath = req.files?.coverImage[0]?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    // NOTE: Uploading on Cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }

    // NOTE: Create object and make entry to the DB
    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "", // Safety check of corner case
        email,
        password,
        username: username.toLowerCase()
    })

    // Select removes those fields written in the string, just add a hyphen
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Error while registering the user")
    }

    // NOTE: Response
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully!")
    )

})

const loginUser = asyncHandler(async (req, res) => {

})

export { registerUser, loginUser }