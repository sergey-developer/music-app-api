import ErrorKindsEnum from 'shared/constants/errorKinds'
import { isSameString } from 'shared/utils/common'

const isEmptyFilterError = isSameString(ErrorKindsEnum.EmptyFilter)
const isValidationError = isSameString(ErrorKindsEnum.ValidationError)

export { isEmptyFilterError, isValidationError }
