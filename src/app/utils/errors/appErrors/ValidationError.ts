import { CustomError } from 'ts-custom-error'

import { IValidationErrors } from 'app/interface/errors/validationError'

class ValidationError extends CustomError {
  public constructor(msg: string, public readonly errors?: IValidationErrors) {
    super(msg)
  }
}

export default ValidationError
