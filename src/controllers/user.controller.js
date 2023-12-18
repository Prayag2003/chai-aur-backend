import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary_service.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt, { decode } from "jsonwebtoken"

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()

        // adding refreshToken
        user.refreshToken = refreshToken

        // saving the user w/o password and other fields
        await user.save({ validateBeforeSave: false })

        return {
            accessToken,
            refreshToken
        }

    } catch (error) {
        throw new ApiError(500, "something went wrong while generating while refresh and access tokens")
    }
}

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
        [username, fullname, email, password].some((field) => field?.trim() === "" || field === undefined)
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
    // const coverImageLocalPath = req.files?.coverImage[0]?.path

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }

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
    // TODO:
    //  fetch the user login details from req.body
    //  validate email or username and find the user 
    //  if no entry found, return unauthorised
    //  if entry found, check password 
    //  if password true, generate access and refresh tokens
    //  send the tokens in secure cookies

    const { username, email, password } = req.body

    if (!username && !email) {
        throw new ApiError(400, "username or email is required")
    }

    // either fetch by username or email
    const user = await User.findOne({
        // using mongoDB operators
        $or: [{ username }, { email }]
    })

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

    const isValidPass = await user.isPasswordCorrect(password)

    if (!isValidPass) {
        throw new ApiError(401, "Invalid user credentials")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    // TODO: To send cookies
    const options = {
        // NOTE: By default, anyone can modify the cookies in the frontend, but setting httpOnly gurantees only server can modify it
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, {
            user: loggedInUser,
            accessToken,
            refreshToken
        }, "user logged in successfully"));

})

const logoutUser = asyncHandler(async (req, res) => {
    // TODO: clear it's cookies
    // User.findById() not possible here
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                "refreshToken": undefined
            }
        },
        {
            new: true //  we need to updated response
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out"))

})

const refreshAccessToken = asyncHandler(async (req, res) => {

    // in case the request is coming from mobile application, use req.body.refreshToken
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request")
    }

    try {
        // payload is optional
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET,
        )

        // The decoded token will have _id 
        const user = await User.findById(decodedToken?._id)
        if (!user) {
            throw new ApiError(401, "Unauthorized request")
        }

        // verify the incoming token and the token that user has from the DB
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired ")
        }

        const options = {
            httpOnly: true,
            secure: true
        }

        // generating new tokens
        const { accessToken, newRefreshToken } = await generateAccessAndRefreshToken(user._id)

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Access Token refreshed"
                )
            )

    } catch (error) {
        throw new ApiError(401, error?.message, "Invalid refresh token")
    }
})

export { registerUser, loginUser, logoutUser, refreshAccessToken }