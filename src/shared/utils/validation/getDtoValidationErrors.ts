import { ValidationError } from 'class-validator'
import reduce from 'lodash/reduce'
import values from 'lodash/values'

import { IValidationErrors } from 'shared/utils/errors/ValidationError'

const getDtoValidationErrors = (
  errors: ValidationError[],
): IValidationErrors => {
  return reduce(
    errors,
    (acc: IValidationErrors, err) => {
      const errorMessages = values(err.constraints)

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
