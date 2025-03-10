import { container as DiContainer } from 'tsyringe'

import { CreateRouter } from 'api/interface'
import { IdParam } from 'app/dto'
import { body, params, query } from 'app/middlewares/validation'
import { auth } from 'modules/auth/middlewares'
import { validateStatus } from 'modules/request/middleware'
import { TrackController } from 'modules/track/controller'
import {
  CreateTrackDto,
  GetAllTracksQuery,
  UpdateTrackDto,
} from 'modules/track/dto'

const trackController = DiContainer.resolve(TrackController)

const createRouter: CreateRouter = (router) => {
  router.get('/', query(GetAllTracksQuery), trackController.getAll)

  router.get('/:id', [auth, params(IdParam)], trackController.getOne)

  router.post('/', [auth, body(CreateTrackDto)], trackController.createOne)

  router.put(
    '/:id',
    [
      auth,
      params(IdParam),
      body(UpdateTrackDto),
      validateStatus({ byEntity: true }),
    ],
    trackController.updateOne,
  )

  router.delete('/:id', [auth, params(IdParam)], trackController.deleteOne)

  return router
}

export default createRouter
