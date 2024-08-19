import mongoose from "mongoose";
import { DB_NAME } from "../constants";
import { Logger as logger } from "../utils";
import { ConnectionInstance } from "../models/interfaces";

const connectDB = async (): Promise<void> => {
  try {
    // Connection object in return
    const connectionInstance: ConnectionInstance = (await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    )) as unknown as ConnectionInstance;

    // NOTE: connectionInstance.connection.host is written since there can be many DBs, eg: for production, testing
    logger.info(
      `MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    // Ensure error is typed correctly
    if (error instanceof Error) {
      logger.error(`MongoDB connection failed: ${error.message}`);
    } else {
      logger.error(`MongoDB connection failed: ${error}`);
    }

    // NOTE: Process is the current application which is running
    process.exit(1);
  }
};

export default connectDB;
