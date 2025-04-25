import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

// Set mongoose connection options
mongoose.set('strictQuery', false);

// MongoDB connection string with proper environment variable
const mongoURL = process.env.MONGODB_URI || process.env.MONGOURL || "mongodb://127.0.0.1:27017/d-compost";

// Enhanced connection function
const connectToDatabase = async () => {
  try {
    await mongoose.connect(mongoURL, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10
    });
    console.log("Successfully connected to MongoDB database");
    return mongoose.connection;
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    // Retry connection if initial attempt fails
    if (mongoose.connection.readyState === 0) {
      console.log("Retrying connection in 5 seconds...");
      setTimeout(connectToDatabase, 5000);
    }
  }
};

// Initialize connection
const db = connectToDatabase();

// Connection events
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to DB');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed due to app termination');
  process.exit(0);
});

export default db;
