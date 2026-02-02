import { Router } from "express";
import validationMiddleware from "../middleware/validation.middlewares.js";
import permissionController from "../controllers/permission.controller.js";
import checkTokenMiddleware from "../middleware/checkToken.middleware.js";
import roleGuard from "../middleware/role.guard.js";
const router = Router()

router
  .post("/permission",checkTokenMiddleware, roleGuard(["superadmin"]), validationMiddleware.permission, permissionController.createPermission)
  .get("/permission", permissionController.getAllPermissions)
  .put("/permission/:id",checkTokenMiddleware, roleGuard(["superadmin"]), permissionController.updatePermission)
  .delete("/permission/:id", checkTokenMiddleware, roleGuard(["superadmin"]), permissionController.deletePermission)


export default router