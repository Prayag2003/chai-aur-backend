# Tweet-Tube Backend

## Introduction
This repository contains the backend code for the Tweet-Tube project. Tweet-Tube is a platform where users can register, upload videos, and interact with other users' content.

## Table of Contents
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Middleware](#middleware)
- [Controllers](#controllers)
- [Error Handling](#error-handling)
- [Routes](#routes)
- [Contributing](#contributing)

## Installation
To set up the project locally, follow these steps:

1. Clone the repository:
   ```bash
     git clone https://github.com/your-username/tweet-tube-backend.git
   ```
2. Install dependencies:
    ```bash
        cd tweet-tube-backend
        npm install
    ```

3. Create a .env file in the root directory and add the following environment variables:
    ```makefile
      PORT=8000
      MONGODB_URI=
      CORS_ORIGIN=*
      
      ACCESS_TOKEN_SECRET=
      ACCESS_TOKEN_EXPIRY=1d
      
      REFRESH_TOKEN_SECRET=
      REFRESH_TOKEN_EXPIRY=10d
    
      CLOUDINARY_CLOUD_NAME=
      CLOUDINARY_API_KEY=
      CLOUDINARY_API_SECRET=
    ```
4. Start the server:
    ```bash
      npm run dev
    ```
# Project Structure
The project follows a modular structure, dividing code into separate files for better organization and maintainability. Here's a brief overview of the main files and directories:

- **index.js**: Entry point of the application. Sets up environment variables, connects to the database, and starts the server.
- **app.js**: Configures Express application, sets up middleware, and defines routes.
- **db/conn.js**: Connects to MongoDB using Mongoose.
- **routes/**: Directory containing route files for different API endpoints.
- **controllers/**: Contains controller functions to handle business logic.
- **middleware/**: Directory for custom middleware functions such as authentication and file upload handling.
- **utils/**: Utility functions and custom error classes.

# Middleware
The project utilizes several middleware functions for handling various tasks such as CORS, JSON parsing, cookie parsing, authentication, and file upload handling. Notable middleware includes:

- **auth.middleware.js**: Middleware for verifying JWT tokens and authenticating users.
- **multer.middleware.js**: Middleware for handling file uploads using Multer.

# Controllers
## User Controller Functions Overview

Here's a brief overview of each function in the `user.controller.js` file along with an explanation of any standard development practices or SOLID Principles applied:

- **registerUser**: Handles user registration, input validation, image upload, and database entry.
- **loginUser**: Manages user login, credential validation, token generation, and secure cookie handling.
- **logoutUser**: Logs out the user by clearing tokens and cookies.
- **refreshAccessToken**: Refreshes user access tokens securely via cookies.
- **changeCurrentPassword**: Allows users to change passwords securely.
- **getCurrentUser**: Retrieves the current user's details.
- **updateAccountDetails**: Updates user account details securely.
- **updateAvatar**: Updates user avatar image securely.
- **updateCoverImage**: Updates user cover image securely.
- **getUserChannelProfile**: Fetches user channel profile with subscriber details.
- **getWatchHistory**: Retrieves user watch history with video details.


## Development Practices and SOLID Principles:
- **Separation of Concerns**: Functions are focused on specific user-related operations.
- **Single Responsibility Principle (SRP)**: Each function has a single responsibility.
- **Validation**: Input validation is implemented to ensure data integrity and security.
- **Error Handling**: Errors are managed using custom error classes and middleware.
- **Modular Design**: Functions are organized into a single file for modularity.
- **Asynchronous Handling**: Asynchronous operations are handled using `async/await`.

# Error Handling
Error handling is implemented using custom error classes and middleware. Notable files include:

- **ApiError.js**: Custom error class for handling API errors with customizable status codes and messages.
- **utils/asyncHandler.js**: Middleware to handle asynchronous functions and catch errors.

# Routes
API routes are defined in separate files inside the `routes/` directory. Notable routes include:

- **user.router.js**: Defines routes for user-related operations such as registration, login, profile updates, and password management.

# Contributing
Contributions to the project are welcome. To contribute, fork the repository, make your changes, and submit a pull request with a detailed description of the changes.
