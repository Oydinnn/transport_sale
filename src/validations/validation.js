import Joi from 'joi'
import mongoose from 'mongoose';

// MongoDB ObjectId ni tekshirish uchun oddiy usul (qo‘shimcha paket kerak emas)
const objectIdSchema = Joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error('any.invalid', { message: "branch ID noto'g'ri formatda"});
  }
  return value;
}, 'ObjectId validation');


class Validations{

  registerSchema = Joi.object({
    branch: objectIdSchema.required().messages({'any.required': 'Branch tanlanishi shart','any.invalid': "Branch ID noto'g'ri"}),
    username:Joi.string().alphanum().min(3).max(20).required(),
    password:Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,255}$')),
    birth_date: Joi.date().max('now').required(),
    gender: Joi.string().valid('male', 'female').required(),
    role: Joi.string().valid('staff', 'admin', 'superadmin').default('staff')
  });
  

  loginSchema = Joi.object({
    username:Joi.string().alphanum().min(3).max(20).required(),
    password:Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,20}$')).required()
  })

  // fileSchema = Joi.object({
  //   title:Joi.string().min(3).max(20).required(),
  //   // user_id:Joi.number().required()
  // })

  // titleSchema = Joi.object({
  //   title:Joi.string().min(3).max(20).required(),
  // })
}

export default new Validations()