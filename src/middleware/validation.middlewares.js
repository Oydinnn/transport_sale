import validation from "../validations/validation.js";
import { BadRequestError } from "../utills/error.utils.js";


class UserMiddleware{
  constructor(){}

  register = (req, res, next) => {
    try {
      const {error} = validation.registerSchema.validate(req.body)
      if(error){
        throw new BadRequestError(400, error.details[0].message)
      }
      next()
    } catch (error) {
      next(error)
    }
  }

  //  login = (req, res, next) => {
  //   try {
  //     const {error} = validation.loginSchema.validate(req.body)
  //     if(error){
  //       throw next(new BadRequestError(400, error.details[0].message,))
  //     }
  //      next()
  //   } catch (error) {
  //     next(error)
  //   }
  // }

  // files = (req, res, next) => {
  //   try {
  //     const {error} = validation.fileSchema.validate(req.body)
  //     if(error){
  //       throw next(new BadRequestError(400, error.details[0].message,))
  //     }
  //      next()
  //   } catch (error) {
  //     next(error)
  //   }
  // }

  //  title = (req, res, next) => {
      
  //   try {
  //     const {error} = validation.titleSchema.validate(req.body)
  //     if(error){
  //       throw next(new BadRequestError(400, error.details[0].message))
  //     }
  //      next()
  //   } catch (error) {
  //     next(error)
  //   }
  // }

}
export default new UserMiddleware()
