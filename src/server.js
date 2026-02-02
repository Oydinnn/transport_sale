import express from "express";
import { config } from "dotenv";
import { connectDB } from "./database/config.js";
import staffRoute from "./routes/staff.route.js";
import branchRoute from "./routes/branch.route.js";
import transportRoute from "./routes/transport.route.js"
import { Logger } from "./logs/logger.js";
import nodemailer from 'nodemailer'
import fs from 'fs'
import { join } from 'path'
import { BadRequestError } from "./utills/error.utils.js";
import { error } from "console";


config();

const app = express();
app.use(express.json());
app.use(staffRoute);
app.use(branchRoute);
app.use(transportRoute);


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth:{
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

app.post("/send", async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      throw new BadRequestError(400, "Email kiritilmadi");
    }

    const otp = Math.floor(Math.random() * 1000000);

    await transporter.sendMail({
      from: `"Tasdiqlash" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Tasdiqlash kodi",
      html: `<h2>${otp}</h2><p>Bu kodni hech kimga bermang!</p>`
    });

    const filePath = join(process.cwd(), "src", "database", "otp.json");
    let otps = [];

    try {
      const data = fs.readFileSync(filePath, 'utf-8');
      otps = JSON.parse(data);
    } catch {
      next(error)
    }

    otps = otps.filter(o => o.email !== email);

    otps.push({
      otp,
      email,
      expire: Date.now() + 15 * 60 * 1000
    });

    fs.writeFileSync(filePath, JSON.stringify(otps, null, 2));

    res.status(200).json({
      status: 200,
      message: "Tasdiqlash kodi yuborildi"
    });
  } catch (error) {
    next(error);
  }
});

// app.post("/send",async(req, res, next)=>{
//   try {
//     const {email} = req.body
//     if (!email) {
//       throw new BadRequestError(400, "Email kiritilmadi");
//     }
//     const otp = Math.floor(100000 + Math.random() * 900000)

//     await transporter.sendMail({
//       from:`Tasdiqlash <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: 'Tasdiqlash kodi',
//       html: `<h2>${otp}</h2> <p>bu kodni hech kimga bermang!</p>`
//     })

//     let otps = fs.readFileSync(join(process.cwd(),"src",'database', "otp.json"), 'utf-8')
//     otps = JSON.parse(otps)
//     otps = otps.filter(o => o.email !== email);

//     let newOtp = {
//       otp,
//       email,
//       expire: Date.now() + 15 * 60 * 1000 // 15 daqiqa
//     }
  
//     otps.push(newOtp)
//     fs.writeFileSync(join(process.cwd(), "src", "database", "otp.json"), JSON.stringify(otps, null, 2))
//     return res.status(200).json({
//       status: 200,
//       message: "tasdiqlash kodi yuborildi"
//     })
//   } catch (error) {
//     next(error)
//   }

// })


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
