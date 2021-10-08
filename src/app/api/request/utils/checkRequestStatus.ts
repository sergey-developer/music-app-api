import { RequestStatusEnum } from 'api/request/constants'
import { isSameString } from 'shared/utils/common'

const isApprovedRequest = isSameString(RequestStatusEnum.Approved)

export { isApprovedRequest }
