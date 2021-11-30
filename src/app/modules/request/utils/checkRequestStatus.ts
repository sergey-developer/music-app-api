import { RequestStatusEnum } from 'modules/request/constants'
import { checkString } from 'app/utils/common'

const isApprovedRequest = checkString(RequestStatusEnum.Approved)

export { isApprovedRequest }
