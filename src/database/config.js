import { connect } from "mongoose"

export async function connectDB(){
  try {
    const connection = await connect(process.env.MONGODB_URI)
    console.log('✅database connected');
  } catch (error) {
    console.log(error);
    throw error
    
  }
}