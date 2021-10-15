import { CreateRouter } from 'api/interface'
import { auth } from 'modules/auth/middlewares'
import { TrackController } from 'modules/track/controller'
import {
  CreateTrackDto,
  DeleteTrackParams,
  GetAllTracksQuery,
} from 'modules/track/dto'
import { body, params, query } from 'shared/middlewares/validation'

const createRouter: CreateRouter = (router) => {
  router.get('/', query(GetAllTracksQuery), TrackController.getAll)

  router.post('/', [auth, body(CreateTrackDto)], TrackController.create)

  router.delete(
    '/:id',
    [auth, params(DeleteTrackParams)],
    TrackController.deleteOneById,
  )

  return router
}

export default createRouter
