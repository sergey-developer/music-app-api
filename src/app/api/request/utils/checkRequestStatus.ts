import { RequestStatusEnum } from 'api/request/constants'

type CheckRequestStatusFn = (
  status: RequestStatusEnum,
) => (status: RequestStatusEnum) => boolean

const checkRequestStatus: CheckRequestStatusFn = (status) => {
  return (anotherStatus) => status === anotherStatus
}

const isApprovedRequest = checkRequestStatus(RequestStatusEnum.Approved)

export { isApprovedRequest }
