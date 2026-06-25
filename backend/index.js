import "./config.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./utils/db.js";

import userRouter from "./routes/user.routes.js";
import companyRouter from "./routes/company.routes.js";
import jobRouter from "./routes/job.routes.js";
import applicationRouter from "./routes/application.routes.js";

import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import crypto from "crypto";

const app = express();

// __dirname fix (ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ FIXED CORS (works for dev + production)
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    process.env.FRONTEND_URL || "*"
  ],
  credentials: true,
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions));

// API routes
app.use("/application", applicationRouter);
app.use("/job", jobRouter);
app.use("/user", userRouter);
app.use("/company", companyRouter);

const PORT = process.env.PORT || 8000;

// -----------------------------
// 🚀 SERVE FRONTEND (PRODUCTION)
// -----------------------------
const frontendPath = path.resolve(__dirname, "..", "frontend", "dist");

if (fs.existsSync(frontendPath)) {
  app.use(express.static(frontendPath));

  app.use((req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });

  console.log("✅ Frontend found and being served:", frontendPath);
} else {
  console.log("⚠️ Frontend not built yet. Run npm run build in frontend.");
}

// -----------------------------
// DB + SERVER START
// -----------------------------
(async () => {
  try {
    await connectDB();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(
        `🚀 Server running on port ${PORT}`
      );
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
  }
})();
