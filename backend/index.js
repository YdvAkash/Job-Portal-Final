import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./utils/db.js";
import dotenv from "dotenv";
import userRouter from "./routes/user.routes.js";
import companyRouter from "./routes/company.routes.js";
import jobRouter from "./routes/job.routes.js";
import applicationRouter from "./routes/application.routes.js";
import path from "path";
import { fileURLToPath } from "url";

// Properly set up __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();

const corsOptions = {
  origin: "http://localhost:5173", // frontend dev server
  credentials: true,
};

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions));

// Routes
app.use("/application", applicationRouter);
app.use("/job", jobRouter);
app.use("/user", userRouter);
app.use("/company", companyRouter);

const PORT = process.env.PORT || 8000;

// Serve frontend static files
const frontendPath = path.resolve(__dirname, "..", "frontend", "dist");
console.log("Looking for frontend at:", frontendPath);

try {
  const fs = await import("fs");
  if (fs.existsSync(frontendPath)) {
    app.use(express.static(frontendPath));

    // Handle all routes by serving index.html
    app.get("*", (req, res) => {
      res.sendFile(path.join(frontendPath, "index.html"));
    });
  } else {
    console.warn(`⚠️ Frontend build directory not found at ${frontendPath}`);
  }
} catch (err) {
  console.error("❌ Error setting up static file serving:", err);
}

// Connect to database and start server
(async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log('\x1b[1m\x1b[32m%s\x1b[0m', `Server running on http://localhost:${PORT} 🚀`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
  }
})();
