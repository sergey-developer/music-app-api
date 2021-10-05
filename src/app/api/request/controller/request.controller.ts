import StatusCodes from 'http-status-codes'

import { IRequestController } from 'api/request/controller'
import { IRequestService, RequestService } from 'api/request/service'

class RequestController implements IRequestController {
  private readonly requestService: IRequestService

  public constructor() {
    this.requestService = RequestService
  }

  public getAll: IRequestController['getAll'] = async (req, res) => {
    const filter = req.query

    try {
      const requests = await this.requestService.getAll(filter)

      res.status(StatusCodes.OK).send(requests)
    } catch (error: any) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ message: error.message })
    }
  }

  public deleteOneById: IRequestController['deleteOneById'] = async (
    req,
    res,
  ) => {
    const requestId = req.params.id

    try {
      await this.requestService.deleteOneById(requestId)

      res
        .status(StatusCodes.OK)
        .send({ message: 'Request was successfully deleted' })
    } catch (error) {
      res.status(error.status).send(error)
    }
  }
}

export default new RequestController()
