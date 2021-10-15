import ErrorKindsEnum from 'shared/constants/errorKinds'
import { checkString } from 'shared/utils/common'

const isValidationError = checkString(ErrorKindsEnum.ValidationError)

export { isValidationError }
