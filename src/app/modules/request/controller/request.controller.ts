import { StatusCodes } from 'http-status-codes'
import pick from 'lodash/pick'
import { singleton } from 'tsyringe'

import { IRequestController } from 'modules/request/controller'
import { RequestService } from 'modules/request/service'
import { getHttpErrorByAppError } from 'shared/utils/errors/httpErrors'

@singleton()
class RequestController implements IRequestController {
  public constructor(private readonly requestService: RequestService) {}

  public getAll: IRequestController['getAll'] = async (req, res) => {
    const filter = req.query

    try {
      const requests = await this.requestService.getAll(filter)
      res.status(StatusCodes.OK).send({ data: requests })
    } catch (error) {
      const httpError = getHttpErrorByAppError(error)
      res.status(httpError.status).send(httpError)
    }
  }

  public updateOne: IRequestController['updateOne'] = async (req, res) => {
    try {
      const { id } = req.params
      const payload = pick(req.body, 'status', 'reason')

      await this.requestService.updateOneById(id, payload)

      res
        .status(StatusCodes.OK)
        .send({ message: 'Request successfully updated' })
    } catch (error) {
      const httpError = getHttpErrorByAppError(error)
      res.status(httpError.status).send(httpError)
    }
  }

  public deleteOne: IRequestController['deleteOne'] = async (req, res) => {
    const { id } = req.params

    try {
      await this.requestService.deleteOneWithEntity(id)

      res
        .status(StatusCodes.OK)
        .send({ message: 'Request successfully deleted' })
    } catch (error) {
      const httpError = getHttpErrorByAppError(error)
      res.status(httpError.status).send(httpError)
    }
  }
}

export default RequestController
