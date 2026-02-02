import { Router } from 'express'
import branchController from '../controllers/branch.controller.js'
import roleGuard from '../middleware/role.guard.js'
import checkTokenMiddleware from '../middleware/checkToken.middleware.js'

const router = Router()
router.use(checkTokenMiddleware, roleGuard(["superadmin"]))
router
  .post("/api/branch", branchController.create)
  .get("/api/branch",roleGuard(["admin"]), branchController.getAllBranches)
  .put("/api/branch/:id", branchController.updateBranch)
  .delete("/api/branch/:id", branchController.deleteBranch)

export default router