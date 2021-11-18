import AppErrorKindsEnum from 'shared/constants/appErrorKindsEnum'
import { checkString } from 'shared/utils/common'

const isValidationError = checkString(AppErrorKindsEnum.ValidationError)

export { isValidationError }
