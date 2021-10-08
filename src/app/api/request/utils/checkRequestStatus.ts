import { RequestStatusEnum } from 'api/request/constants'
import { checkString } from 'shared/utils/common'

const isApprovedRequest = checkString(RequestStatusEnum.Approved)

export { isApprovedRequest }
