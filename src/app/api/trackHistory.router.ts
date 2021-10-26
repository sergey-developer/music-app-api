import { container as DiContainer } from 'tsyringe'

import { CreateRouter } from 'api/interface'
import { auth } from 'modules/auth/middlewares'
import { TrackHistoryController } from 'modules/trackHistory/controller'
import { CreateTrackHistoryDto } from 'modules/trackHistory/dto'
import { IdParam } from 'shared/dto'
import { body, params } from 'shared/middlewares/validation'

const trackHistoryController = DiContainer.resolve(TrackHistoryController)

const createRouter: CreateRouter = (router) => {
  router.get('/', auth, trackHistoryController.getAll)

  router.post(
    '/',
    [auth, body(CreateTrackHistoryDto)],
    trackHistoryController.createOne,
  )

  router.delete(
    '/:id',
    [auth, params(IdParam)],
    trackHistoryController.deleteOne,
  )

  return router
}

export default createRouter
