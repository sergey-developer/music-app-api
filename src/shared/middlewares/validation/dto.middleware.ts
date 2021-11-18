import {
  ClassType,
  TransformValidationOptions,
  transformAndValidate,
} from 'class-transformer-validator'
import { RequestHandler } from 'express'
import merge from 'lodash/merge'
import set from 'lodash/set'

import AppErrorKindsEnum from 'shared/constants/appErrorKindsEnum'
import { VALIDATION_ERR_MSG } from 'shared/constants/errorMessages'
import { BadRequestError } from 'shared/utils/errors/httpErrors'
import { getDtoValidationErrors } from 'shared/utils/errors/validationErrors'
import { deleteImageFromFs } from 'shared/utils/file'

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
    } catch (exception: any) {
      if (req.file) {
        deleteImageFromFs(req.file.filename)
      }

      const error = BadRequestError(VALIDATION_ERR_MSG, {
        kind: AppErrorKindsEnum.ValidationError,
        errors: getDtoValidationErrors(exception),
      })

      res.status(error.status).send(error)
    }
  }

export default dto
