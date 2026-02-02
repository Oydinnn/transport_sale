import { Router } from 'express'
import transportController from '../controllers/transport.controller.js'
import checkTokenMiddleware from '../middleware/checkToken.middleware.js'
import roleGuard from '../middleware/role.guard.js'


const router = Router()

router
  .post("/api/transport", checkTokenMiddleware,roleGuard(["superadmin", "admin"]), transportController.addTransport)
  .get("/api/transport", checkTokenMiddleware,roleGuard(["superadmin", "admin", "staff"]), transportController.getAllTransportes)
  .put("/api/transport/:id", checkTokenMiddleware, roleGuard(["superadmin", "admin"]), transportController.changeTransport)
  .delete("/api/transport/:id", checkTokenMiddleware, roleGuard(["superadmin"]), transportController.deleteTransport)

export default router