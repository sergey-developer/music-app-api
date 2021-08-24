import _get from 'lodash/get'
import _isEmpty from 'lodash/isEmpty'
import _keys from 'lodash/keys'
import _reduce from 'lodash/reduce'
import _set from 'lodash/set'
import { Schema } from 'mongoose'

import { CustomDocument } from 'database/interface/document'
import { IValidationErrors, ValidationError } from 'shared/utils/errors'

export default function uniqueValidation<T extends CustomDocument>(
  schema: Schema<T>,
) {
  schema.post('save', function (error: any, doc: any, next: any) {
    const modelSchema = schema.obj

    const objWithUniqueFields = _reduce(
      _keys(modelSchema),
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

    if (error.name === 'MongoError' && error.code === 11000) {
      const objWithDuplicates = error.keyValue

      const errors = _reduce(
        _keys(objWithDuplicates),
        (acc: IValidationErrors, duplicateField) => {
          const uniqueMsg = _get(objWithUniqueFields, duplicateField)

          if (uniqueMsg) {
            const duplicateValue = _get(objWithDuplicates, duplicateField)
            const formattedUniqueMsg = uniqueMsg.replace(
              '{value}',
              `"${duplicateValue}"`,
            )

            _set(acc, duplicateField, {
              name: duplicateField,
              value: duplicateValue,
              message: formattedUniqueMsg,
            })
          }

          return acc
        },
        {},
      )

      if (!_isEmpty(errors)) {
        next(new ValidationError('Model validation failed', errors))
      }

      next(new ValidationError('There was a duplicate key error'))
    } else {
      next()
    }
  })
}
