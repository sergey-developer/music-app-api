import StatusCodes from 'http-status-codes'

import ErrorKindsEnum from 'shared/constants/errorKinds'
import { ErrorResponse, IDetailsError } from 'shared/utils/response'

class ServerErrorResponse extends ErrorResponse {
  constructor(kind: ErrorKindsEnum, message: string, details?: IDetailsError) {
    super(
      StatusCodes.INTERNAL_SERVER_ERROR,
      StatusCodes.getStatusText(StatusCodes.INTERNAL_SERVER_ERROR),
      kind,
      message,
      details,
    )
  }
}

export default ServerErrorResponse
