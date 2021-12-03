import { StatusCodes } from 'http-status-codes'
import pick from 'lodash/pick'
import { singleton } from 'tsyringe'

import { getHttpErrorByAppError } from 'app/utils/errors/httpErrors'
import { IArtistController } from 'modules/artist/controller'
import { ArtistService, IGetAllArtistsFilter } from 'modules/artist/service'
import { RequestStatusEnum } from 'modules/request/constants'

@singleton()
class ArtistController implements IArtistController {
  constructor(private readonly artistService: ArtistService) {}

  public getAll: IArtistController['getAll'] = async (req, res) => {
    const { user, query } = req
    const userIsAuthorized = !!user

    const filter: IGetAllArtistsFilter = userIsAuthorized
      ? { status: query.status, userId: query.userId }
      : { status: RequestStatusEnum.Approved }

    try {
      const artists = await this.artistService.getAll(filter)
      res.status(StatusCodes.OK).send({ data: artists })
    } catch (error) {
      const httpError = getHttpErrorByAppError(error)
      res.status(httpError.status).send(httpError)
    }
  }

  public getOne: IArtistController['getOne'] = async (req, res) => {
    const { id } = req.params

    try {
      const artist = await this.artistService.getOneById(id)
      res.status(StatusCodes.OK).send({ data: artist })
    } catch (error) {
      const httpError = getHttpErrorByAppError(error)
      res.status(httpError.status).send(httpError)
    }
  }

  public createOne: IArtistController['createOne'] = async (req, res) => {
    try {
      const { user, body, file } = req
      const { name, info } = body

      const artist = await this.artistService.createOne({
        name,
        info,
        photo: file?.filename,
        user: user?.userId!,
      })

      const result = pick(artist, 'id')

      res
        .status(StatusCodes.CREATED)
        .send({ data: result, message: 'Artist successfully created' })
    } catch (error) {
      const httpError = getHttpErrorByAppError(error)
      res.status(httpError.status).send(httpError)
    }
  }

  public updateOne: IArtistController['updateOne'] = async (req, res) => {
    try {
      const { params, body, file } = req
      const { id } = params
      const { name, info } = body

      await this.artistService.updateOneById(id, {
        name,
        info,
        photo: file?.filename || null,
      })

      res
        .status(StatusCodes.OK)
        .send({ message: 'Artist successfully updated' })
    } catch (error) {
      const httpError = getHttpErrorByAppError(error)
      res.status(httpError.status).send(httpError)
    }
  }

  public deleteOne: IArtistController['deleteOne'] = async (req, res) => {
    const { id } = req.params

    try {
      await this.artistService.deleteOneById(id)

      res
        .status(StatusCodes.OK)
        .send({ message: 'Artist successfully deleted' })
    } catch (error) {
      const httpError = getHttpErrorByAppError(error)
      res.status(httpError.status).send(httpError)
    }
  }
}

export default ArtistController
