import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.options("*", cors());
app.use(cookieParser());

import userRouter from "./routes/user.routes";
import contentRouter from "./routes/content.routes";
import linkRouter from "./routes/link.routes";

app.use("/api/v1/user", userRouter); // http://localhost:8000/api/v1/user
app.use("/api/v1/content", contentRouter); // http://localhost:8000/api/v1/content
app.use("/api/v1/brain", linkRouter); // http://localhost:8000/api/v1/brain

export { app };
