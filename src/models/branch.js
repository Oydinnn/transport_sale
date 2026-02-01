import mongoose from "mongoose";

const branchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  time: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});
export default mongoose.model('branches', branchSchema)
