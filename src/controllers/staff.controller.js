import JWT from "jsonwebtoken";
import staffModel from "../models/staff.js";
import { hashPassword, comparePassword } from "../utills/bcrypt.utils.js";
import {ConflictError, InternalServerError, NotFoundError, BadRequestError, UnauthorizedError,} from "../utills/error.utils.js";

const register = async (req, res) => {
  try {
    const { username, password, role, branch, ...otherFields } = req.body;

    if (!username || !password) {
      throw new BadRequestError(400, "Username va parol majburiy");
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
    // duplicate username uchun maxsus holat
    if (err.code === 11000) {
      throw next (new ConflictError(409, "Bu username allaqachon band"));
    }
    next(err);
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      throw new BadRequestError(400, "Username va parol kiritilishi shart");
    }

    const staff = await staffModel
      .findOne({ username })
      .select("+password"); 

    if (!staff) {
      throw new UnauthorizedError(401, "Username yoki parol noto'g'ri");
    }

    const isMatch = await comparePassword(password, staff.password);

    if (!isMatch) {
      throw new UnauthorizedError(401, "Username yoki parol noto'g'ri");

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
    next(error)
  }
};

const getAllStaffes = async(req, res)=>{
  try {
    const data = await staffModel.find()
    if(!data.length){
        return res.status(200).json({
          status: 200,
          message:"users empty"
        })
      }

      return res.status(200).json({
        status: 200,
        data
      })
  } catch (error) {
    console.error("getAllStaffes xatosi:", error);
    next(error)
  }
}

const updateStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedStaff = await staffModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
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
    console.error("Update xatosi:", error);
    next(error)
  }
};


const deleteStaff = async (req, res) => {
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
    console.error("Delete xatosi:", error);
    next(error)
  }
};


export default {
  register,
  login,
  getAllStaffes,
  updateStaff,
  deleteStaff
};