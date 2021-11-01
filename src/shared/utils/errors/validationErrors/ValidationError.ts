import { Error } from 'mongoose'

import ErrorKindsEnum from 'shared/constants/errorKinds'
import { VALIDATION_ERR_MSG } from 'shared/constants/errorMessages'
import { MaybeNull } from 'shared/interface/utils'
import { BadRequestError } from 'shared/utils/errors/httpErrors'
import { getValidationErrors } from 'shared/utils/errors/validationErrors'

const ValidationError = (
  msg: MaybeNull<string>,
  error: Error.ValidationError,
) => {
  const message = msg || VALIDATION_ERR_MSG

  return BadRequestError(message, {
    kind: ErrorKindsEnum.ValidationError,
    errors: getValidationErrors(
      error.errors as Record<string, Error.ValidatorError>,
    ),
  })
}

export default ValidationError
