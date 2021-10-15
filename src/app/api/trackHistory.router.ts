import { CreateRouter } from 'api/interface'
import { auth } from 'modules/auth/middlewares'
import { TrackHistoryController } from 'modules/trackHistory/controller'
import {
  CreateTrackHistoryDto,
  DeleteTrackHistoryParams,
} from 'modules/trackHistory/dto'
import { body, params } from 'shared/middlewares/validation'

const createRouter: CreateRouter = (router) => {
  router.get('/', auth, TrackHistoryController.getAll)

  router.post(
    '/',
    [auth, body(CreateTrackHistoryDto)],
    TrackHistoryController.create,
  )

  router.delete(
    '/:id',
    [auth, params(DeleteTrackHistoryParams)],
    TrackHistoryController.deleteOneById,
  )

  return router
}

export default createRouter
