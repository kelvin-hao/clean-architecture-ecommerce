import { SuccessResponseBase } from '../../helper/response'
import { StatusCodes } from '../../helper/response/statusCode'
import { StatusReasons } from '../../helper/response/statusReason'

export class CreatedResponse<T> extends SuccessResponseBase<T> {
  constructor(data: T, message = StatusReasons.CREATED, status = StatusCodes.CREATED) {
    super(message, status, data)
  }
}

export class OKResponse<T> extends SuccessResponseBase<T> {
  constructor(data: T, message = StatusReasons.OK, status = StatusCodes.OK) {
    super(message, status, data)
  }
}

export class NoContentResponse extends SuccessResponseBase<null> {
  constructor(message = StatusReasons.NO_CONTENT, status = StatusCodes.NO_CONTENT) {
    super(message, status, null)
  }
}
