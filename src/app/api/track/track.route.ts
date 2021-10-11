import auth from 'api/auth/middlewares/auth.middleware'
import { TrackController } from 'api/track/controller'
import {
  CreateTrackDto,
  DeleteOneTrackByIdParams,
  GetAllTracksQuery,
} from 'api/track/dto'
import { CreateRouter } from 'app/routes/interface'
import { body, params, query } from 'shared/middlewares/validation'

const createRouter: CreateRouter = (router) => {
  router.get('/', query(GetAllTracksQuery), TrackController.getAll)

  router.post('/', [auth, body(CreateTrackDto)], TrackController.createOne)

  router.delete(
    '/:id',
    [auth, params(DeleteOneTrackByIdParams)],
    TrackController.deleteOneById,
  )

  return router
}

export default createRouter
