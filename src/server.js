import express from 'express'
import { config } from 'dotenv'
import { connectDB } from './database/config.js'
import staffRoute from './routes/staff.route.js'
import branchRoute from './routes/branch.route.js'

config()

const app = express()
app.use(express.json())
app.use(staffRoute)
app.use(branchRoute)



connectDB()
app.listen(process.env.PORT, ()=> console.log('server is running on port:', process.env.PORT))