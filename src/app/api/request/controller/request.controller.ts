import StatusCodes from 'http-status-codes'

import { IRequestController } from 'api/request/controller'
import { IRequestService, RequestService } from 'api/request/service'

class RequestController implements IRequestController {
  private readonly requestService: IRequestService

  constructor() {
    this.requestService = RequestService
  }

  getAll: IRequestController['getAll'] = async (req, res) => {
    // TODO: валидировать фильтр
    const filter = req.query

    try {
      const requests = await this.requestService.getAll(filter)

      res.send({ data: requests })
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ message: error.message })
    }
  }

  deleteOneById: IRequestController['deleteOneById'] = async (req, res) => {
    const requestId = req.params.id

    try {
      await this.requestService.deleteOneById(requestId)
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ message: error.message })
    }
  }
}

export default new RequestController()
