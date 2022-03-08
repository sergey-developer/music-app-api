import { stringEqual } from 'app/utils/common'
import { RequestStatusEnum } from 'modules/request/constants'

const isApprovedRequest = stringEqual(RequestStatusEnum.Approved)

export { isApprovedRequest }
