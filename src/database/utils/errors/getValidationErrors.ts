import keys from 'lodash/keys'
import { Error } from 'mongoose'

import { IValidationErrors } from 'app/interface/errors/validationError'

const getValidationErrors = (
  errors: Record<string, Error.ValidatorError>,
): IValidationErrors => {
  return keys(errors).reduce((acc: IValidationErrors, name) => {
    const error = errors[name]

    if (error) {
      acc[name] = [error.message]
    }

    return acc
  }, {})
}

export default getValidationErrors
