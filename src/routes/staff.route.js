import { Router } from 'express'
import staffController from '../controllers/staff.controller.js'
import validationMiddleware from '../middleware/validation.middlewares.js'
import checkTokenMiddleware from '../middleware/checkToken.middleware.js'
import roleGuard from '../middleware/role.guard.js'


const router = Router()

router
  .post("/api/register", validationMiddleware.register, staffController.register)
  .post("/api/login", validationMiddleware.login, staffController.login)
  .get("/api/staff/all", checkTokenMiddleware,roleGuard(["superadmin", "admin"]), staffController.getAllStaffes)
  .put("/api/staff/:id", checkTokenMiddleware, roleGuard(["superadmin", "admin"]), staffController.updateStaff)
  .delete("/api/staff/:id", checkTokenMiddleware, roleGuard(["superadmin"]), staffController.deleteStaff)

export default router