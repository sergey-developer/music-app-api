import { ArtistModel } from 'api/artist/model'
import { IArtistRepository } from 'api/artist/repository'

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
      await this.artist.findByIdAndDelete(id).orFail()
    } catch (error) {
      // TODO: throw custom not found if not found
      throw error
    }
  }
}

export default new ArtistRepository()
