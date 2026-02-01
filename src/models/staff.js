import mongoose from 'mongoose'

const staffSchema = new mongoose.Schema({
	branch:{
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Branch', 
      required: true
    }, 
    username:{
      type: String,
      required: true,
      unique: true,
    }, 
    password:{
      type: String,
      required: true,
      select: false
    }, 
    birth_date:{
      type: Date,
      required: true,
    }, 
    gender:{
      type:String,
      enum:['male', 'female'],
      required: true
    },
    role: { 
      type: String, 
      enum: ['staff', 'admin', "superadmin"], 
      default: 'staff' 
    },
    createdAt: { 
      type: Date, 
      default: Date.now 
    }
})
export default mongoose.model('staffs', staffSchema);