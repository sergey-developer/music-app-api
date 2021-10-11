import { RequestStatusEnum } from 'modules/request/constants'
import { checkString } from 'shared/utils/common'

const isApprovedRequest = checkString(RequestStatusEnum.Approved)

export { isApprovedRequest }
