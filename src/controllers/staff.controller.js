import JWT from "jsonwebtoken";
import staffModel from "../models/staff.js";
import { hashPassword, comparePassword } from "../utills/bcrypt.utils.js";

const register = async (req, res) => {
  try {
    const { username, password, role, branch, ...otherFields } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username va parol majburiy",
      });
    }

    const hashedPassword = await hashPassword(password);

    const newStaff = await staffModel.create({
      username,
      password: hashedPassword,
      role,
      branch,
      ...otherFields,
    });

    console.log("Yangi staff yaratildi:", newStaff.username);

    const token = JWT.sign(
      {
        id: newStaff._id,
        role: newStaff.role,
        branch: newStaff.branch,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      success: true,
      data: {
        id: newStaff._id,
        username: newStaff.username,
        role: newStaff.role || "staff",
        branch: newStaff.branch,
      },
      token,
      message: "Ro'yxatdan o'tildi",
    });
  } catch (error) {
    console.error("Register xatosi:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Bu username allaqachon band",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Serverda xatolik yuz berdi",
    });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username va parol kiritilishi shart",
      });
    }

    const staff = await staffModel
      .findOne({ username })
      .select("+password"); 

    if (!staff) {
      return res.status(401).json({
        success: false,
        message: "Username yoki parol noto'g'ri",
      });
    }

    const isMatch = await comparePassword(password, staff.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Username yoki parol noto'g'ri",
      });
    }

    const token = JWT.sign(
      {
        id: staff._id,
        role: staff.role,
        branch: staff.branch,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      data: {
        id: staff._id,
        username: staff.username,
        role: staff.role,
        branch: staff.branch,
      },
      token,
      message: "Muvaffaqiyatli kirish amalga oshirildi",
    });
  } catch (error) {
    console.error("Login xatosi:", error);
    return res.status(500).json({
      success: false,
      message: "Serverda xatolik yuz berdi",
    });
  }
};

export default {
  register,
  login,
};