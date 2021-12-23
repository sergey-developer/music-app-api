import { container as DiContainer } from 'tsyringe'

import { CreateRouter } from 'api/interface'
import { IdParam } from 'app/dto'
import { body, params, query } from 'app/middlewares/validation'
import { auth } from 'modules/auth/middlewares'
import { RequestController } from 'modules/request/controller'
import { GetAllRequestsQuery, UpdateRequestDto } from 'modules/request/dto'
import { validateStatus } from 'modules/request/middleware'

const requestController = DiContainer.resolve(RequestController)

const createRouter: CreateRouter = (router) => {
  router.get('/', [auth, query(GetAllRequestsQuery)], requestController.getAll)

  router.put(
    '/:id',
    [auth, params(IdParam), body(UpdateRequestDto), validateStatus()],
    requestController.updateOne,
  )

  router.delete('/:id', [auth, params(IdParam)], requestController.deleteOne)

  return router
}

export default createRouter
