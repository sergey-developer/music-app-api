import { CustomError } from 'ts-custom-error'

import { IValidationErrors } from 'app/utils/errors/validationErrors'

class ValidationError extends CustomError {
  public constructor(msg: string, public readonly errors: IValidationErrors) {
    super(msg)
  }
}

export default ValidationError
