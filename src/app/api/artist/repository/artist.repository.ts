import { ArtistModel } from 'api/artist/model'
import { IArtistRepository } from 'api/artist/repository'

class ArtistRepository implements IArtistRepository {
  private readonly artist: typeof ArtistModel

  constructor() {
    this.artist = ArtistModel
  }

  findAll: IArtistRepository['findAll'] = async () => {
    return this.artist.find()
  }

  createOne: IArtistRepository['createOne'] = async (payload) => {
    const artist = new this.artist(payload)
    return artist.save()
  }
}

export default new ArtistRepository()
