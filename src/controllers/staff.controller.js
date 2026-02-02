import JWT from "jsonwebtoken";
import staffModel from "../models/staff.js";
import { hashPassword, comparePassword } from "../utills/bcrypt.utils.js";
import {
  ConflictError,
  InternalServerError,
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} from "../utills/error.utils.js";
import { Logger } from "../logs/logger.js";
import fs from 'fs'
import {join} from 'path'

const register = async (req, res, next) => {
  try {
    const { username, password, role, branch, ...otherFields } = req.body;

    if (!username || !password) {
      throw new BadRequestError(400, "Username va parol majburiy");
    }
    // let otps = fs.readFileSync(join(process.cwd(), "src", "database", "otp.json"), 'utf-8')
    // otps = JSON.parse(otps)

    // const ExistOtp = otps.find(o => o.otp === +otp && o.email === email)
    // if(!ExistOtp){
    //   throw new BadRequestError(400, "email or otp wrong")
    // }

    const hashedPassword = await hashPassword(password);

    const newStaff = await staffModel.create({
      username,
      password: hashedPassword,
      role,
      branch,
      ...otherFields,
    });

    console.log("Yangi staff yaratildi:", newStaff.username);

    const accessToken = JWT.sign(
      {
        id: newStaff._id,
        role: newStaff.role,
        ip: req.ip,
        userAgent: req.get("user-agent"),
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    const refreshToken = JWT.sign(
      {
        id: newStaff._id,
        role: newStaff.role,
        ip: req.ip,
        userAgent: req.get("user-agent"),
      },
      process.env.JWT_SECRET,
      { expiresIn: "30d" },
    );

    return res.status(201).json({
      success: true,
      data: {
        id: newStaff._id,
        username: newStaff.username,
        role: newStaff.role || "staff",
        branch: newStaff.branch,
      },
      accessToken,
      refreshToken,
      message: "Ro'yxatdan o'tildi",
    });
  } catch (error) {
    Logger.error("Register xatosi:", {
      message: error.message,
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userAgent: req.get("user-agent"),
    });
    // duplicate username uchun maxsus holat
    if (error.code === 11000) {
      throw next(new ConflictError(409, "Bu username allaqachon band"));
    }
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      throw new BadRequestError(400, "Username va parol kiritilishi shart");
    }

    const staff = await staffModel.findOne({ username }).select("+password");

    if (!staff) {
      throw new UnauthorizedError(401, "Username yoki parol noto'g'ri");
    }

    const isMatch = await comparePassword(password, staff.password);

    if (!isMatch) {
      throw new UnauthorizedError(401, "Username yoki parol noto'g'ri");
    }

    const accessToken = JWT.sign(
      {
        id: staff._id,
        role: staff.role,
        ip: req.ip,
        userAgent: req.get("user-agent"),
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    const refreshToken = JWT.sign(
      {
        id: staff._id,
        role: staff.role,
        ip: req.ip,
        userAgent: req.get("user-agent"),
      },
      process.env.JWT_SECRET,
      { expiresIn: "30d" },
    );

    return res.status(200).json({
      success: true,
      data: {
        id: staff._id,
        username: staff.username,
        role: staff.role,
        branch: staff.branch,
      },
      accessToken,
      refreshToken,
      message: "Muvaffaqiyatli kirish amalga oshirildi",
    });
  } catch (error) {
    Logger.error("Login xatosi:", {
      message: error.message,
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userAgent: req.get("user-agent"),
    });
    next(error);
  }
};

const getAllStaffes = async (req, res, next) => {
  try {
    const data = await staffModel.find();
    if (!data.length) {
      return res.status(200).json({
        status: 200,
        message: "users empty",
      });
    }

    return res.status(200).json({
      status: 200,
      data,
    });
  } catch (error) {
    Logger.error("getAllStaffes xatosi:", {
      message: error.message,
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userAgent: req.get("user-agent"),
    });
    next(error);
  }
};

const updateStaff = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedStaff = await staffModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true },
    );

    if (!updatedStaff) {
      throw new NotFoundError(404, "Xodim topilmadi");
    }

    return res.status(200).json({
      success: true,
      message: "Xodim ma'lumotlari yangilandi",
      data: updatedStaff,
    });
  } catch (error) {
    Logger.error("UpdateStaff xatosi:", {
      message: error.message,
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userAgent: req.get("user-agent"),
    });
    next(error);
  }
};

const deleteStaff = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedStaff = await staffModel.findByIdAndDelete(id);

    if (!deletedStaff) {
      throw new NotFoundError(404, "O'chiriladigan xodim topilmadi");
    }

    return res.status(200).json({
      success: true,
      message: "Xodim muvaffaqiyatli o'chirildi",
      deletedId: id,
    });
  } catch (error) {
    Logger.error("DeleteStaff xatosi:", {
      message: error.message,
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userAgent: req.get("user-agent"),
    });
    next(error);
  }
};

export default {
  register,
  login,
  getAllStaffes,
  updateStaff,
  deleteStaff,
};
