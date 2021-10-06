import { ArtistModel } from 'api/artist/model'
import { IArtistRepository } from 'api/artist/repository'
import { isNotFoundDatabaseError } from 'database/utils/errors'
import { createNotFoundError } from 'shared/utils/errors/httpErrors'

class ArtistRepository implements IArtistRepository {
  private readonly artist: typeof ArtistModel

  public constructor() {
    this.artist = ArtistModel
  }

  public findAll: IArtistRepository['findAll'] = async () => {
    return this.artist.find().exec()
  }

  public findAllWhere: IArtistRepository['findAllWhere'] = async (filter) => {
    return this.artist.find({ _id: { $in: filter.ids } }).exec()
  }

  public createOne: IArtistRepository['createOne'] = async (payload) => {
    const artist = new this.artist(payload)
    return artist.save()
  }

  public deleteOneById: IArtistRepository['deleteOneById'] = async (id) => {
    try {
      const deletedArtist = await this.artist
        .findByIdAndDelete(id)
        .orFail()
        .exec()

      return deletedArtist
    } catch (error) {
      throw isNotFoundDatabaseError(error) ? createNotFoundError() : error
    }
  }
}

export default new ArtistRepository()
