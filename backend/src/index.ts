import dotenv from "dotenv";
import { app } from "./app";
import connectDB from "./db";

dotenv.config();

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      return console.log(`Server is running at port: ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("MONGO DB connection failed !!", error);
  });
