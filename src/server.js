import express from "express";
import { config } from "dotenv";
import { connectDB } from "./database/config.js";
import staffRoute from "./routes/staff.route.js";
import branchRoute from "./routes/branch.route.js";
import transportRoute from "./routes/transport.route.js"
import { Logger } from "./logs/logger.js";

config();

const app = express();
app.use(express.json());
app.use(staffRoute);
app.use(branchRoute);
app.use(transportRoute);


// Logger winston
app.use((error, req, res, next) => {
  const status = error.status || 500;
  const message = error.message || "Server xatosi yuz berdi";

  if (status < 500) {
    return res.status(status).json({
      status,
      message,
      name: error.name,
      ip: req.ip,
      userAgent: req.get("user-agent"),
    });
  }

  // 500+ xatolar uchun
  Logger.error(message, {
    method: req.method,
    url: req.originalUrl || req.url,
    ip: req.ip,
    userAgent: req.get("user-agent"),
  });

  res.status(status).json({
    success: false,
    status,
    message
  });
});

connectDB();
app.listen(process.env.PORT, () =>
  console.log("server is running on port:", process.env.PORT),
);
