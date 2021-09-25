import { ValidationError } from 'class-validator'
import _reduce from 'lodash/reduce'
import _values from 'lodash/values'

import { IValidationErrors } from 'shared/utils/errors/ValidationError'

const getDtoValidationErrors = (
  errors: ValidationError[],
): IValidationErrors => {
  return _reduce(
    errors,
    (acc: IValidationErrors, err) => {
      const errorMessages = _values(err.constraints)

      acc[err.property] = {
        name: err.property,
        value: err.value,
        message: errorMessages,
      }

      return acc
    },
    {},
  )
}

export default getDtoValidationErrors
