import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cors());
app.use(cookieParser());

import userRouter from "./routes/user.routes";
import contentRouter from "./routes/content.routes";

app.use("/api/v1/user", userRouter); // http://localhost:8000/api/v1/user
app.use("/api/v1/content", contentRouter); // http://localhost:8000/api/v1/content

export { app };
