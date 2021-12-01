import { ValidationError } from 'class-validator'
import values from 'lodash/values'

import { IValidationErrors } from 'app/interface/errors/validationError'

const getErrors = (errors: ValidationError[]): IValidationErrors => {
  return errors.reduce((acc: IValidationErrors, err) => {
    const errorMessages = values(err.constraints)

    acc[err.property] = errorMessages

    return acc
  }, {})
}

export default getErrors
