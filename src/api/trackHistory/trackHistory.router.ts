import { auth } from 'api/auth'
import { TrackHistoryController } from 'modules/trackHistory/controller'
import {
  CreateTrackHistoryDto,
  DeleteOneTrackHistoryByIdParams,
} from 'modules/trackHistory/dto'
import { CreateRouter } from 'shared/interface/router'
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
