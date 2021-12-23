import { RequestHandler } from 'express'
import { container as DiContainer } from 'tsyringe'

import AppErrorKindsEnum from 'app/constants/appErrorKinds'
import { IdParam } from 'app/dto'
import { IValidationErrors } from 'app/interface/errors/validationError'
import { BadRequestError, ServerError } from 'app/utils/errors/httpErrors'
import { RequestStatusEnum } from 'modules/request/constants'
import {
  IFindOneRequestFilter,
  RequestRepository,
} from 'modules/request/repository'

const allowedStatusTransition: Record<
  RequestStatusEnum,
  Array<RequestStatusEnum>
> = {
  [RequestStatusEnum.Approved]: [],
  [RequestStatusEnum.Rejected]: [RequestStatusEnum.Pending],
  [RequestStatusEnum.Pending]: [
    RequestStatusEnum.Approved,
    RequestStatusEnum.Rejected,
  ],
}

const requestRepository = DiContainer.resolve(RequestRepository)

const validateStatus =
  (settings?: { byEntity: boolean }) =>
  (): RequestHandler<Pick<IdParam, 'id'>, any, { status: RequestStatusEnum }> =>
  async (req, res, next) => {
    try {
      const id = req.params.id

      const filter: IFindOneRequestFilter = settings?.byEntity
        ? { entity: id }
        : { id }
      const request = await requestRepository.findOne(filter)

      const newStatus = req.body.status
      const currentStatus = request.status
      const allowedStatuses = allowedStatusTransition[currentStatus]
      const statusIsAllowed = allowedStatuses.includes(newStatus)

      if (!statusIsAllowed) {
        const errors: IValidationErrors = {
          status: [
            `Status can not be transitioned to: "${newStatus}". Allowed transitions: ${allowedStatuses.join(
              ' ,',
            )}`,
          ],
        }

        const httpError = BadRequestError(null, {
          kind: AppErrorKindsEnum.ValidationError,
          errors,
        })

        res.status(httpError.status).send(httpError)
      }

      next()
    } catch {
      const httpError = ServerError()
      res.status(httpError.status).send(httpError)
    }
  }

export default validateStatus
