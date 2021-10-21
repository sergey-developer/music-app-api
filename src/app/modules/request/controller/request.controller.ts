import { StatusCodes } from 'http-status-codes'
import pick from 'lodash/pick'

import { IRequestController } from 'modules/request/controller'
import { IRequestService, RequestService } from 'modules/request/service'
import { ensureHttpError } from 'shared/utils/errors/httpErrors'

class RequestController implements IRequestController {
  private readonly requestService: IRequestService

  public constructor() {
    this.requestService = RequestService
  }

  public getAll: IRequestController['getAll'] = async (req, res) => {
    const filter = req.query

    try {
      const requests = await this.requestService.getAll(filter)
      res.status(StatusCodes.OK).send({ data: requests })
    } catch (exception) {
      const error = ensureHttpError(exception)
      res.status(error.status).send(error)
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
    } catch (exception) {
      const error = ensureHttpError(exception)
      res.status(error.status).send(error)
    }
  }

  public deleteOne: IRequestController['deleteOne'] = async (req, res) => {
    const { id } = req.params

    try {
      await this.requestService.deleteOneWithEntity(id)

      res
        .status(StatusCodes.OK)
        .send({ message: 'Request successfully deleted' })
    } catch (exception) {
      const error = ensureHttpError(exception)
      res.status(error.status).send(error)
    }
  }
}

export default new RequestController()
