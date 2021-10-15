import { CreateRouter } from 'api/interface'
import { auth } from 'modules/auth/middlewares'
import { TrackController } from 'modules/track/controller'
import { CreateTrackDto, GetAllTracksQuery } from 'modules/track/dto'
import { IdParam } from 'shared/dto'
import { body, params, query } from 'shared/middlewares/validation'

const createRouter: CreateRouter = (router) => {
  router.get('/', query(GetAllTracksQuery), TrackController.getAll)

  router.post('/', [auth, body(CreateTrackDto)], TrackController.create)

  router.delete('/:id', [auth, params(IdParam)], TrackController.deleteOne)

  return router
}

export default createRouter
