import StatusCodes from 'http-status-codes'

import ErrorKindsEnum from 'shared/constants/errorKinds'
import { ErrorResponse, IDetailsError } from 'shared/utils/response'

class BadRequestResponse extends ErrorResponse {
  constructor(kind: ErrorKindsEnum, message: string, details?: IDetailsError) {
    super(
      StatusCodes.BAD_REQUEST,
      StatusCodes.getStatusText(StatusCodes.BAD_REQUEST),
      kind,
      message,
      details,
    )
  }
}

export default BadRequestResponse
