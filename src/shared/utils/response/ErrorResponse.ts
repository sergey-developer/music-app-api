import ErrorKindsEnum from 'shared/constants/errorKinds'

export interface IDetailsError<Error = any>
  extends Readonly<{
    errors?: Record<string, Error>
  }> {}

class ErrorResponse<Error = any> {
  constructor(
    readonly statusCode: number,
    readonly statusText: string,
    readonly kind: ErrorKindsEnum,
    readonly message: string,
    readonly details?: IDetailsError<Error>,
  ) {}
}

export default ErrorResponse
