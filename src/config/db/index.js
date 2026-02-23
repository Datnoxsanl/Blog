import mongoose from "mongoose";

async function connectDB() {
  try {
    await mongoose.connect("mongodb://localhost:27017/blog_edu");
    console.log("Connect successfully!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

export { connectDB };
