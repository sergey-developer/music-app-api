// import { FilterQuery, QueryFindOptions } from 'mongoose'

import { CreateArtistDto } from 'api/artist/dto'
import { ArtistModelArray } from 'api/artist/interface'
import { IArtistModel } from 'api/artist/model'

export interface IArtistRepository {
  findAll: () => Promise<ArtistModelArray>
  createOne: (payload: CreateArtistDto) => Promise<IArtistModel>
}
