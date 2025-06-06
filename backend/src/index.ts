import dotenv from "dotenv";
dotenv.config();

import connectDB from "./db";
import { app } from "./app";

// Connect to MongoDB for all environments
connectDB()
  .then(() => {
    // Only start server locally (for development)
    if (process.env.NODE_ENV !== "production") {
      app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running at port: ${process.env.PORT || 8000}`);
      });
    }
  })
  .catch((error) => {
    console.log("MONGO DB connection failed !!", error);
    process.exit(1); // Exit on failure to prevent app from running without DB
  });

// Export for Vercel
export default app;
