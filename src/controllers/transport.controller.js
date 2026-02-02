import transportModel from "../models/transport.js";
import { Logger } from "../logs/logger.js";

const addTransport = async (req, res, next) => {
  try {
    const newTransport = await transportModel.create(req.body);
    console.log("Yangi transport:", newTransport);
  
    return res.status(201).json({
      success: true,
      data: newTransport,
      message: "transport yaratildi"
    });
    
  } catch (error) {
    Logger.error("Transport yaratishda xatolik:", {
          message: error.message,
          method: req.method,
          url: req.originalUrl,
          ip: req.ip,
          userAgent: req.get("user-agent"),
        });
        // duplicate branch uchun maxsus holat
        if (error.code === 11000) {
          throw next(new ConflictError(409, "Bu transport allaqachon band"));
        }
    next(error)
  }
};

const getAllTransportes = async (req, res, next) => {
  try {
    const transportes = await transportModel.find();
  
    return res.status(200).json({
      success: true,
      data: transportes,
      message: "All transportes"
    });
    
  } catch (error) {
    Logger.error("transportlarni ko'rishda xatolik:", {
          message: error.message,
          method: req.method,
          url: req.originalUrl,
          ip: req.ip,
          userAgent: req.get("user-agent"),
        });
    next(error)
  }
};

const changeTransport = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
 
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID talab qilinadi"
      });
    }
    const transport = await transportModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!transport) {
      return res.status(404).json({
        success: false,
        message: "transport topilmadi"
      });
    }
    
    return res.status(200).json({
      success: true,
      data: transport,
      message: "transport yangilandi"
    });
    
  } catch (error) {
    Logger.error("Bunday transport mavjud emas:", {
          message: error.message,
          method: req.method,
          url: req.originalUrl,
          ip: req.ip,
          userAgent: req.get("user-agent"),
        });
    next(error)
  }
};


const deleteTransport = async (req, res, next) => {
  try {
    const { id } = req.params;
 
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID talab qilinadi"
      });
    }
    const transport = await transportModel.findByIdAndDelete(id);
    
    if (!transport) {
      return res.status(404).json({
        success: false,
        message: "transport topilmadi"
      });
    }
    
    return res.status(200).json({
      success: true,
      data: transport,
      message: "transport o'chirildi"
    });
    
  } catch (error) {
    Logger.error("Bunday transport mavjud emas:", {
          message: error.message,
          method: req.method,
          url: req.originalUrl,
          ip: req.ip,
          userAgent: req.get("user-agent"),
        });
    next(error)
  }
};

export default {
  addTransport,
  getAllTransportes,
  changeTransport,
  deleteTransport
};