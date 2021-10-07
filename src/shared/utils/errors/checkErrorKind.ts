import ErrorKindsEnum from 'shared/constants/errorKinds'

type CheckErrorKindFn = (
  kind: ErrorKindsEnum,
) => (kind: ErrorKindsEnum) => boolean

const checkErrorKind: CheckErrorKindFn = (kind) => {
  return (anotherKind) => kind === anotherKind
}

const isEmptyFilterError = checkErrorKind(ErrorKindsEnum.EmptyFilter)
const isValidationError = checkErrorKind(ErrorKindsEnum.ValidationError)

export { isEmptyFilterError, isValidationError }
