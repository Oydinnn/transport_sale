import mongoose from 'mongoose'

const transportSchema = new mongoose.Schema({
  branch:{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Branch', 
    required: true
  }, 
  model:{
    type:String,
    required:true
  }, 
  color:{
    type:String,
    required:true
  }, 
  img:{
    type:String,
    required:true
  }, 
  price:{
    type:Number,
    required:true
  }, 
  time:{
    type: Date, 
    default: Date.now
  },
  status: { 
    type: String, 
    enum: ['available', 'sold'], 
    default: 'available' 
  }

})