import auth from 'api/auth/middlewares/auth.middleware'
import { RequestController } from 'api/request/controller'
import {
  DeleteOneRequestByIdParams,
  GetAllRequestsQuery,
} from 'api/request/dto'
import { CreateRouter } from 'app/routes/interface'
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
