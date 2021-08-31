import {
  ClassType,
  TransformValidationOptions,
} from 'class-transformer-validator'

import dto from 'shared/middlewares/validation/dto.middleware'

const params = <D extends object>(
  params: ClassType<D>,
  options?: TransformValidationOptions,
): ReturnType<typeof dto> => dto(params, 'params', options)

export default params
