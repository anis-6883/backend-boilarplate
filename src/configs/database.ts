import logger from "../helpers/logger";
import mongoose from "mongoose";

const connectToDatabase = async (databaseURL: string) => {
  try {
    await mongoose.connect(databaseURL);
    logger.info("=> Connected to MongoDB Database!");
  } catch (error: any) {
    logger.error("Error connecting to MongoDB:", error.stack);
    throw error;
  }
};

export default connectToDatabase;
