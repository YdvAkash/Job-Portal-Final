import "../config.js";
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('\x1b[1m\x1b[32m%s\x1b[0m', 'Database connected successfully! 🌱');// Green text with a success message
  } catch (error) {
    console.log('\x1b[31m%s\x1b[0m', 'Error connecting to the database: ❌', error); // Red text for error with error details
  }
};

export default connectDB;
