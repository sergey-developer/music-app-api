// import { FilterQuery, QueryFindOptions } from 'mongoose'

import { CreateArtistDto } from 'api/artist/dto'
import { ArtistModelArray, IArtistModel } from 'api/artist/model'

export interface IArtistRepository {
  findAll: () => Promise<ArtistModelArray>
  createOne: (payload: CreateArtistDto) => Promise<IArtistModel>
}
