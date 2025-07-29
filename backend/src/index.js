import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT;
const __dirname = path.resolve();

const allowedOrigins = [
  "http://13.60.180.235",
  "http://13.60.180.235:80",
  "https://chat-app-frontend.vercel.app",
  "https://chat-app-frontend-git-main-lokesh-36s-projects.vercel.app",
  "https://chat-app-frontend-three-liard.vercel.app",
  "https://chat-app-frontend-8s6saenjz-lokesh-36s-projects.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));
app.use(cookieParser());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// No need to serve frontend — it's deployed separately

server.listen(PORT, () => {
  console.log("server is running on PORT:" + PORT);
  connectDB();
});
