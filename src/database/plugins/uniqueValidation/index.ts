import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import keys from 'lodash/keys'
import reduce from 'lodash/reduce'
import set from 'lodash/set'
import { Schema } from 'mongoose'

import { CustomDocument } from 'database/interface/document'
import ValidationError, {
  IValidationErrors,
} from 'shared/utils/errors/ValidationError'

const duplicateErrorNames = ['MongoError', 'MongoServerError']

export default function uniqueValidation<T extends CustomDocument>(
  schema: Schema<T>,
) {
  schema.post('save', function (error: any, doc: any, next: any) {
    const modelSchema = schema.obj

    const objWithUniqueFields = reduce(
      keys(modelSchema),
      (acc: Record<string, string>, fieldName) => {
        const fieldValue = modelSchema[fieldName]
        const uniqueValue = fieldValue.unique

        if (uniqueValue) {
          acc[fieldName] = uniqueValue
        }

        return acc
      },
      {},
    )

    if (duplicateErrorNames.includes(error.name) && error.code === 11000) {
      const objWithDuplicates = error.keyValue

      const errors = reduce(
        keys(objWithDuplicates),
        (acc: IValidationErrors, duplicateField) => {
          const uniqueMsg = get(objWithUniqueFields, duplicateField)

          if (uniqueMsg) {
            const duplicateValue = get(objWithDuplicates, duplicateField)
            const formattedUniqueMsg = uniqueMsg.replace(
              '{value}',
              `"${duplicateValue}"`,
            )

            set(acc, duplicateField, {
              name: duplicateField,
              value: duplicateValue,
              message: formattedUniqueMsg,
            })
          }

          return acc
        },
        {},
      )

      if (!isEmpty(errors)) {
        next(new ValidationError('Model validation failed', errors))
      }

      next(new ValidationError('There was a duplicate key error'))
    } else {
      next()
    }
  })
}
