import { rolePermissions } from "../utills/permission.js";

const roleGuard= (roles) =>{
  return (req, res, next) =>{
    try {
      if(!rolePermissions[req.user.role].includes(req.method) || !roles.includes(req.user.role)){
        return res.status(403).json({
          status: 403,
          message: "Permission berilmagan"
        })
      }
      next()
    } catch (error) {
      console.log(error);
    }
  }
}

export default roleGuard