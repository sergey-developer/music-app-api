import ErrorKindsEnum from 'shared/constants/errorKinds'
import { MaybeArray } from 'shared/interface/utils/common'

export interface IValidationError {
  name: string
  value: string
  message: MaybeArray<string>
}

export interface IValidationErrors extends Record<string, IValidationError> {}

class ValidationError {
  readonly name: ErrorKindsEnum.ValidationError = ErrorKindsEnum.ValidationError

  constructor(readonly message: string, readonly errors?: IValidationErrors) {}
}

export default ValidationError
