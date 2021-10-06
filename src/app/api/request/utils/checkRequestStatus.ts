import { RequestStatusEnum } from 'api/request/constants'

type CheckRequestStatusFn = (
  checkingStatus: RequestStatusEnum,
) => (status: RequestStatusEnum) => boolean

const checkRequestStatus: CheckRequestStatusFn = (checkingStatus) => {
  return (status) => status === checkingStatus
}

const isApprovedRequest = checkRequestStatus(RequestStatusEnum.Approved)

export { isApprovedRequest }
