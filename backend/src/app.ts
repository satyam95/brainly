import express from "express";
import cors from "cors";

const app = express();
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cors());

import userRouter from "./routes/user.routes";

app.use("/api/v1/user", userRouter); // http://localhost:8000/api/v1/user

export { app };
