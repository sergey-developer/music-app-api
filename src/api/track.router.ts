import { auth } from 'modules/auth/middlewares'
import { TrackController } from 'modules/track/controller'
import {
  CreateTrackDto,
  DeleteOneTrackByIdParams,
  GetAllTracksQuery,
} from 'modules/track/dto'
import { CreateRouter } from 'shared/interface/router'
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
