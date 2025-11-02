import mongoose from "mongoose";

export async function connectDB() {
  try {
    const mongoUri =
      process.env.MONGO_URI || "mongodb://localhost:27017/elysia_demo";
    await mongoose.connect(mongoUri);
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ Failed to connect to MongoDB:");
    process.exit(1);
  }
}

export async function connectTestDB() {
  try {
    const testMongoUri = "mongodb://localhost:27017/elysia_demo_test";
    await mongoose.connect(testMongoUri);
    console.log("✅ MongoDB Test Database connected successfully");
  } catch (err) {
    console.error("❌ Failed to connect to MongoDB Test Database:", err);
    process.exit(1);
  }
}

export async function disconnectDB() {
  try {
    await mongoose.disconnect();
    console.log("✅ MongoDB disconnected successfully");
  } catch (err) {
    console.error("❌ Failed to disconnect from MongoDB:", err);
  }
}

export default connectDB;
