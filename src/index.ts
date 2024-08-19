import dotenv from "dotenv";
import connectDB from "./db/conn";
import { app } from "./app";

dotenv.config({ path: "./.env" });

const port = process.env.PORT || 8000;

// NOTE: listening to any errors from app
// app.on("error", (error: Error) => {
//   console.error("ERR: ", error.message);
//   process.exit(1);
// });

// NOTE: ConnectDB returns a promise since every async call returns a promise
connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err: Error) => {
    console.error("MongoDB failed to connect ...", err.message);
  });
