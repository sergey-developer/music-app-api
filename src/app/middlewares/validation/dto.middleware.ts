import {
  ClassType,
  TransformValidationOptions,
  transformAndValidate,
} from 'class-transformer-validator'
import { RequestHandler } from 'express'
import merge from 'lodash/merge'
import set from 'lodash/set'
import { container as DiContainer } from 'tsyringe'

import AppErrorKindsEnum from 'app/constants/appErrorKinds'
import { VALIDATION_ERR_MSG } from 'app/constants/messages/errors'
import { BadRequestError } from 'app/utils/errors/httpErrors'
import getErrors from 'lib/class-validator/getErrors'
import { ImageService } from 'modules/image/service'

const defaultOptions: TransformValidationOptions = {
  validator: {
    forbidUnknownValues: true,
    whitelist: true,
    validationError: { target: false },
  },
}

const imageService = DiContainer.resolve(ImageService)

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
        imageService.deleteOneByName(req.file.filename)
      }

      const error = BadRequestError(VALIDATION_ERR_MSG, {
        kind: AppErrorKindsEnum.ValidationError,
        errors: getErrors(exception),
      })

      res.status(error.status).send(error)
    }
  }

export default dto
