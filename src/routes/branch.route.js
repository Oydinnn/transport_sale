import { Router } from 'express'
import branchController from '../controllers/branch.controller.js'

const router = Router()

router
  .post("/api/branch", branchController.create)
  .get("/api/branch", branchController.getAllBranches)
  .put("/api/branch/:id", branchController.updateBranch)
  .delete("/api/branch/:id", branchController.deleteBranch)



export default router