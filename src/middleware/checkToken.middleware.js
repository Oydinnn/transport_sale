import jwt from "jsonwebtoken";
import { NotFoundError, UnauthorizedError } from "../utills/error.utils.js";
import staffModel from "../models/staff.js";

export default async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      throw new UnauthorizedError(401, "Token yuborilmagan");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // .select("-password")  parolni qaytarmaslik uchun (xavfsizlik)
    const staff = await staffModel.findById(decoded.id).select("-password");

    if (!staff) {
      throw new NotFoundError(404, "Staff topilmadi");
    }
    req.user = staff;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(new UnauthorizedError(401, "Token muddati tugagan"));
    }

    if (error.name === "JsonWebTokenError") {
      return next(new UnauthorizedError(401, "Noto'g'ri token"));
    }
    console.error("Auth middleware xatosi:", error);
    next(error);
  }
};