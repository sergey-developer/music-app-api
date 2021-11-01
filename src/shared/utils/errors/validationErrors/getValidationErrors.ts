import keys from 'lodash/keys'
import { Error } from 'mongoose'

import { IValidationErrors } from 'shared/utils/errors/validationErrors'

const getValidationErrors = (
  errors: Record<string, Error.ValidatorError>,
): IValidationErrors => {
  return keys(errors).reduce((acc: IValidationErrors, name) => {
    const error = errors[name]

    acc[name] = {
      value: error.value,
      messages: [error.message],
    }

    return acc
  }, {})
}

export default getValidationErrors
