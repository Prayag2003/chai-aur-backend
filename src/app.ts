import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Express } from "express";

const app: Express = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// Handle JSON or forms
app.use(express.json({ limit: "16kb" }));

// Handle data coming from URLs
app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
);

// Serve static files such as images, CSS files
app.use(express.static("public"));

// CookieParser basically manages or performs CRUD on the user cookies.
// Secured cookies are managed only by the server
app.use(cookieParser());

// NOTE: Routes import
import { userRouter } from "./routes";

// NOTE: Routes declarations
// eg: http://localhost:8000/api/v1/users/register
app.use("/api/v1/users", userRouter);

export { app };
