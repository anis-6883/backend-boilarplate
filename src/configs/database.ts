import mongoose from "mongoose";
import config from "./config";

const connectToDatabase = async (env: string) => {
  const databaseURL = config[env].databaseURI;

  try {
    await mongoose.connect(databaseURL);
    console.log("Connected to MongoDB Database!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export default connectToDatabase;
