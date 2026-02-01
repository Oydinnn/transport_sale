import branchModel from "../models/branch.js";

const create = async (req, res) => {
  try {
    const newBranch = await branchModel.create(req.body);
    console.log("Yangi filial:", newBranch);
  
    return res.status(201).json({
      success: true,
      data: newBranch,
      message: "Filial yaratildi"
    });
    
  } catch (error) {
    console.error("Xato:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Filial yaratishda xato"
    });
  }
};

const getAllBranches = async (req, res) => {
  try {
    const branches = await branchModel.find();
  
    return res.status(200).json({
      success: true,
      data: branches,
      message: "All branches"
    });
    
  } catch (error) {
    console.error("Xato:", error);
    return res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

const updateBranch = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
 
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID talab qilinadi"
      });
    }
    const branch = await branchModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!branch) {
      return res.status(404).json({
        success: false,
        message: "Filial topilmadi"
      });
    }
    
    return res.status(200).json({
      success: true,
      data: branch,
      message: "Filial yangilandi"
    });
    
  } catch (error) {
    console.error("Xato:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


const deleteBranch = async (req, res) => {
  try {
    const { id } = req.params;
 
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID talab qilinadi"
      });
    }
    const branch = await branchModel.findByIdAndDelete(id);
    
    if (!branch) {
      return res.status(404).json({
        success: false,
        message: "Filial topilmadi"
      });
    }
    
    return res.status(200).json({
      success: true,
      data: branch,
      message: "Filial o'chirildi"
    });
    
  } catch (error) {
    console.error("Xato:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export default {
  create,
  getAllBranches,
  updateBranch,
  deleteBranch
};