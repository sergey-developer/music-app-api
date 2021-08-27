import {
  ClassType,
  TransformValidationOptions,
  transformAndValidate,
} from 'class-transformer-validator'
import { RequestHandler } from 'express'
import _merge from 'lodash/merge'
import _set from 'lodash/set'

import ErrorKindsEnum from 'shared/constants/errorKinds'
import { BadRequestResponse } from 'shared/utils/response'
import { getDtoValidationErrors } from 'shared/utils/validation'

const defaultOptions: TransformValidationOptions = {
  transformer: {
    excludeExtraneousValues: true,
  },
  validator: {
    forbidUnknownValues: true,
    whitelist: true,
    validationError: { target: false },
  },
}

const validateDto =
  <D extends object>(
    dto: ClassType<D>,
    options?: TransformValidationOptions,
  ): RequestHandler =>
  async (req, res, next) => {
    try {
      const validatedDto = await transformAndValidate<D>(
        dto,
        req.body,
        _merge(defaultOptions, options),
      )

      _set(req, 'body', validatedDto)
      next()
    } catch (errors) {
      const errorResponse = new BadRequestResponse(
        ErrorKindsEnum.ValidationError,
        'Payload validation failed',
        {
          errors: getDtoValidationErrors(errors),
        },
      )

      res.status(errorResponse.statusCode).send(errorResponse)

      // TODO: отправлять ответ с ошибками в другом мидлваре,
      //  в этом только передавать объект ошибки в следующий мидлвар
      // next(
      //   new ValidationError('Payload validation failed', getDtoValidationErrors(errors))
      // )
    }
  }

export default validateDto
