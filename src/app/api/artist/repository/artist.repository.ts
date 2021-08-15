import { CreateArtistDto } from 'api/artist/dto'
import { ArtistModel } from 'api/artist/model'
import { IArtistRepository } from 'api/artist/repository'

class ArtistRepository implements IArtistRepository {
  private readonly artist: typeof ArtistModel

  constructor() {
    this.artist = ArtistModel
  }

  findAll = async () => {
    return this.artist.find()
  }

  createOne = async (payload: CreateArtistDto) => {
    const newArtist = new this.artist(payload)
    return newArtist.save()
  }
}

export default new ArtistRepository()
