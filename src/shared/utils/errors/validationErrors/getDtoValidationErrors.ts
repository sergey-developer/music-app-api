import { ValidationError } from 'class-validator'
import reduce from 'lodash/reduce'
import values from 'lodash/values'

import { IValidationErrors } from 'shared/utils/errors/validationErrors'

const getDtoValidationErrors = (
  errors: ValidationError[],
): IValidationErrors => {
  return reduce(
    errors,
    (acc: IValidationErrors, err) => {
      const errorMessages = values(err.constraints)

      acc[err.property] = errorMessages

      return acc
    },
    {},
  )
}

export default getDtoValidationErrors
