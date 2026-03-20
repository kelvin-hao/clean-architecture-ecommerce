import { ErrorResponseBase } from '.'
import { StatusCodes } from './statusCode'
import { StatusReasons } from './statusReason'

export class BadRequestError extends ErrorResponseBase {
  constructor(message: unknown = StatusReasons.BAD_REQUEST, status = StatusCodes.BAD_REQUEST) {
    super(message as string, status)
  }
}

export class ConflictError extends ErrorResponseBase {
  constructor(message = StatusReasons.CONFLICT, status = StatusCodes.CONFLICT) {
    super(message, status)
  }
}

export class InternalServerError extends ErrorResponseBase {
  constructor(message = StatusReasons.INTERNAL_SERVER_ERROR, status = StatusCodes.INTERNAL_SERVER_ERROR) {
    super(message, status)
  }
}

export class ForbiddenError extends ErrorResponseBase {
  constructor(message = StatusReasons.FORBIDDEN, status = StatusCodes.FORBIDDEN) {
    super(message, status)
  }
}

export class UnauthorizedError extends ErrorResponseBase {
  constructor(message = StatusReasons.UNAUTHORIZED, status = StatusCodes.UNAUTHORIZED) {
    super(message, status)
  }
}

export class TooManyRequest extends ErrorResponseBase {
  constructor(message = StatusReasons.TOO_MANY_REQUESTS, status = StatusCodes.TOO_MANY_REQUESTS) {
    super(message, status)
  }
}

export class NotFoundError extends ErrorResponseBase {
  constructor(message = StatusReasons.NOT_FOUND, status = StatusCodes.NOT_FOUND) {
    super(message, status)
  }
}

export class UnprocessableError extends ErrorResponseBase {
  constructor(message = StatusReasons.UNPROCESSABLE_ENTITY, status = StatusCodes.UNPROCESSABLE_ENTITY) {
    super(message, status)
  }
}

export class NotAcceptable extends ErrorResponseBase {
  constructor(message = StatusReasons.NOT_ACCEPTABLE, status = StatusCodes.NOT_ACCEPTABLE) {
    super(message, status)
  }
}

export class GoneError extends ErrorResponseBase {
  constructor(message = StatusReasons.GONE, status = StatusCodes.GONE) {
    super(message, status)
  }
}
