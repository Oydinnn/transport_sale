import { Router } from 'express'
import staffController from '../controllers/staff.controller.js'
import validationMiddleware from '../middleware/validation.middlewares.js'

const router = Router()

router
  .post("/api/register", validationMiddleware.register, staffController.register)
  .post("/api/login",  staffController.login)
  // .get("/api/user/all", checkToken,roleGuard(["admin"]), userController.getAllUser)
  // .post("/api/user", roleGuard(["admin"]), userController.create)

export default router