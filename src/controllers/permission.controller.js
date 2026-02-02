import Permission from '../models/permission.js';
import { BadRequestError, NotFoundError } from '../utills/error.utils.js';
import { Logger } from '../logs/logger.js';

// CREATE
const createPermission = async (req, res, next) => {
  try {
    const { name, desc } = req.body;

    if (!name) throw new BadRequestError(400, "Name majburiy");

    const permission = await Permission.create({ name, desc });

    res.status(201).json({
      success: true,
      message: "Permission yaratildi",
      data: permission
    });
  } catch (error) {
    Logger.error("create permission xatosi:", {
          message: error.message,
          method: req.method,
          url: req.originalUrl,
          ip: req.ip,
          userAgent: req.get("user-agent"),
        });
    next(error);
  }
};

// READ ALL
const getAllPermissions = async (req, res, next) => {
  try {
    const permissions = await Permission.find()

    res.status(200).json({
      success: true,
      count: permissions.length,
      data: permissions
    });
  } catch (error) {
    Logger.error("getAllPermissions xatosi:", {
          message: error.message,
          method: req.method,
          url: req.originalUrl,
          ip: req.ip,
          userAgent: req.get("user-agent"),
        });
    next(error);
  }
};

// UPDATE
const updatePermission = async (req, res, next) => {
  try {
    const permission = await Permission.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!permission) throw new NotFoundError(404, "Permission topilmadi");

    res.status(200).json({
      success: true,
      message: "Yangilandi",
      data: permission
    });
  } catch (error) {
    Logger.error("updatePermission xatosi:", {
          message: error.message,
          method: req.method,
          url: req.originalUrl,
          ip: req.ip,
          userAgent: req.get("user-agent"),
        });
    next(error);
  }
};

// DELETE
const deletePermission = async (req, res, next) => {
  try {
    const permission = await Permission.findByIdAndDelete(req.params.id);

    if (!permission) throw new NotFoundError(404, "Permission topilmadi");

    res.status(200).json({
      success: true,
      message: "O'chirildi"
    });
  } catch (error) {
    Logger.error("deletePermission xatosi:", {
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
  createPermission,
  getAllPermissions,
  updatePermission,
  deletePermission
};