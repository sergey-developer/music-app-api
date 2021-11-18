import { Error } from 'mongoose'

import AppErrorKindsEnum from 'shared/constants/appErrorKindsEnum'
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
    kind: AppErrorKindsEnum.ValidationError,
    errors: getValidationErrors(
      error.errors as Record<string, Error.ValidatorError>,
    ),
  })
}

export default ValidationError
