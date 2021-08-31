import {
  ClassType,
  TransformValidationOptions,
} from 'class-transformer-validator'

import dto from 'shared/middlewares/validation/dto.middleware'

const query = <D extends object>(
  query: ClassType<D>,
  options?: TransformValidationOptions,
): ReturnType<typeof dto> => dto(query, 'query', options)

export default query
