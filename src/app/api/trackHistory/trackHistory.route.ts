import auth from 'api/auth/middlewares/auth.middleware'
import { TrackHistoryController } from 'api/trackHistory/controller'
import {
  CreateTrackHistoryDto,
  DeleteOneTrackHistoryByIdParams,
} from 'api/trackHistory/dto'
import { CreateRouter } from 'app/routes/interface'
import { body, params } from 'shared/middlewares/validation'

const createRouter: CreateRouter = (router) => {
  router.get('/', auth, TrackHistoryController.getAll)

  router.post(
    '/',
    [auth, body(CreateTrackHistoryDto)],
    TrackHistoryController.createOne,
  )

  router.delete(
    '/:id',
    [auth, params(DeleteOneTrackHistoryByIdParams)],
    TrackHistoryController.deleteOneById,
  )

  return router
}

export default createRouter
