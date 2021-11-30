import {
  ClassType,
  TransformValidationOptions,
} from 'class-transformer-validator'

import dto from 'app/middlewares/validation/dto.middleware'

const body = <D extends object>(
  body: ClassType<D>,
  options?: TransformValidationOptions,
): ReturnType<typeof dto> => dto(body, 'body', options)

export default body
