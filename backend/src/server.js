import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import logger from "./libs/logger.js";
import connectDB from "./config/db.js";

import authRoute from "./routes/auth.route.js";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors({ origin: "http://localhost:5000", credentials: true }));
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(helmet());
app.use(morgan("dev"));

app.use("/api/v1/auth", authRoute);

app.use((error, _req, res, _next) => {
  res.status(500).json({ error: process.env.NODE_ENV === "production" ? error.message : "Internal server error" });
});

await connectDB().then(() => {
  app.listen(port, () => {
    logger.info(`Server running at http://localhost:${port}`);
  });
});
