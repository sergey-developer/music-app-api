import ErrorKindsEnum from 'shared/constants/errorKinds'
import { checkString } from 'shared/utils/common'

const isEmptyFilterError = checkString(ErrorKindsEnum.EmptyFilter)
const isValidationError = checkString(ErrorKindsEnum.ValidationError)

export { isEmptyFilterError, isValidationError }
