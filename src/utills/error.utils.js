export class InternalServerError extends Error{
  constructor(status, message){
    super()
    this.status = 500
    this.message = message
    this.name = 'InternalServerError'
  }
}

export class BadRequestError extends Error{
  constructor(status, message){
    super()
    this.status = 400
    this.message = message
    this.name = 'BadRequestError'
  }
}

export class NotFoundError extends Error{
  constructor(status, message){
    super()
    this.status = 404
    this.message = message
    this.name = 'NotFoundError'
  }
}

export class ConflictError extends Error{
  constructor(status, message){
    super()
    this.status = status
    this.message = 409
    this.name = 'ConflictError'
  }
}

export class ForbiddenError extends Error{
  constructor(status, message){
    super()
    this.status = 403
    this.message = message
    this.name = 'ForbiddenError'
  }
  
}

export class UnauthorizedError extends Error{
  constructor(status, message){
    super()
    this.status = 401
    this.message = message
    this.name = 'UnauthorizedError'
  }
}