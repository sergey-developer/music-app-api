import { CreateRouter } from 'api/interface'
import { auth } from 'modules/auth/middlewares'
import { RequestController } from 'modules/request/controller'
import {
  DeleteOneRequestByIdParams,
  GetAllRequestsQuery,
} from 'modules/request/dto'
import { params, query } from 'shared/middlewares/validation'

const createRouter: CreateRouter = (router) => {
  router.get('/', [auth, query(GetAllRequestsQuery)], RequestController.getAll)

  router.delete(
    '/:id',
    [auth, params(DeleteOneRequestByIdParams)],
    RequestController.deleteOneById,
  )

  return router
}

export default createRouter
