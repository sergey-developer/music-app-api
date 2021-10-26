import { StatusCodes } from 'http-status-codes'
import pick from 'lodash/pick'
import { singleton } from 'tsyringe'

import { IArtistController } from 'modules/artist/controller'
import { IArtistDocumentArray } from 'modules/artist/interface'
import { ArtistService } from 'modules/artist/service'
import { RequestStatusEnum } from 'modules/request/constants'
import { ensureHttpError } from 'shared/utils/errors/httpErrors'

@singleton()
class ArtistController implements IArtistController {
  constructor(private readonly artistService: ArtistService) {}

  public getAll: IArtistController['getAll'] = async (req, res) => {
    const { user, query } = req
    const userIsAuthorized = !!user
    const filter = query

    try {
      let artists: IArtistDocumentArray

      if (userIsAuthorized) {
        artists = await this.artistService.getAll(filter)
      } else {
        artists = await this.artistService.getAll({
          status: RequestStatusEnum.Approved,
        })
      }

      res.status(StatusCodes.OK).send({ data: artists })
    } catch (exception) {
      const error = ensureHttpError(exception)
      res.status(error.status).send(error)
    }
  }

  public getOne: IArtistController['getOne'] = async (req, res) => {
    const { id } = req.params

    try {
      const artist = await this.artistService.getOneById(id)
      res.status(StatusCodes.OK).send({ data: artist })
    } catch (exception) {
      const error = ensureHttpError(exception)
      res.status(error.status).send(error)
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
        userId: user?.userId!,
      })

      const result = pick(artist, 'id')

      res
        .status(StatusCodes.CREATED)
        .send({ data: result, message: 'Artist successfully created' })
    } catch (exception) {
      const error = ensureHttpError(exception)
      res.status(error.status).send(error)
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
    } catch (exception) {
      const error = ensureHttpError(exception)
      res.status(error.status).send(error)
    }
  }

  public deleteOne: IArtistController['deleteOne'] = async (req, res) => {
    const { id } = req.params

    try {
      await this.artistService.deleteOneById(id)

      res
        .status(StatusCodes.OK)
        .send({ message: 'Artist successfully deleted' })
    } catch (exception) {
      const error = ensureHttpError(exception)
      res.status(error.status).send(error)
    }
  }
}

export default ArtistController
