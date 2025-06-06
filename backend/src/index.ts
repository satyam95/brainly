import dotenv from "dotenv";
dotenv.config();

import connectDB from "./db";
import { app } from "./app";

if (process.env.NODE_ENV !== "production") {
  connectDB()
    .then(() => {
      app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running at port: ${process.env.PORT || 8000}`);
      });
    })
    .catch((error) => {
      console.log("MONGO DB connection failed !!", error);
    });
}

// Export for Vercel
export default app;
