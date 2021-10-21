import { CreateRouter } from 'api/interface'
import { auth } from 'modules/auth/middlewares'
import { RequestController } from 'modules/request/controller'
import { GetAllRequestsQuery, UpdateRequestDto } from 'modules/request/dto'
import { IdParam } from 'shared/dto'
import { body, params, query } from 'shared/middlewares/validation'

const createRouter: CreateRouter = (router) => {
  router.get('/', [auth, query(GetAllRequestsQuery)], RequestController.getAll)

  router.put(
    '/:id',
    [auth, params(IdParam), body(UpdateRequestDto)],
    RequestController.updateOne,
  )

  router.delete('/:id', [auth, params(IdParam)], RequestController.deleteOne)

  return router
}

export default createRouter
