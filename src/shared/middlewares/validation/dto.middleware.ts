import {
  ClassType,
  TransformValidationOptions,
  transformAndValidate,
} from 'class-transformer-validator'
import { RequestHandler } from 'express'
import createError from 'http-errors'
import StatusCodes from 'http-status-codes'
import merge from 'lodash/merge'
import set from 'lodash/set'

import ErrorKindsEnum from 'shared/constants/errorKinds'
import { getDtoValidationErrors } from 'shared/utils/validation'

const defaultOptions: TransformValidationOptions = {
  validator: {
    forbidUnknownValues: true,
    whitelist: true,
    validationError: { target: false },
  },
}

const dto =
  <D extends object>(
    dto: ClassType<D>,
    target: 'body' | 'query' | 'params',
    options?: TransformValidationOptions,
  ): RequestHandler =>
  async (req, res, next) => {
    try {
      const validatedDto = await transformAndValidate<D>(
        dto,
        req[target],
        merge(defaultOptions, options),
      )

      set(req, target, validatedDto)
      next()
    } catch (errors: any) {
      const error = createError(StatusCodes.BAD_REQUEST, 'Validation failed', {
        kind: ErrorKindsEnum.ValidationError,
        errors: getDtoValidationErrors(errors),
      })

      res.status(error.status).send(error)
    }
  }

export default dto
