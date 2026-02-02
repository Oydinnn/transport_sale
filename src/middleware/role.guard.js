import { rolePermissions } from "../utills/permission.js";
import { ForbiddenError } from '../utills/error.utils.js' 

const roleGuard= (roles) =>{
  return (req, res, next) =>{
    try {
      if(!rolePermissions[req.user.role].includes(req.method) || !roles.includes(req.user.role)){
        throw new ForbiddenError(403, "Permission berilmagan");
      }
      next()
    } catch (error) {
      next(error);
    }
  }
}
export default roleGuard