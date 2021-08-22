import { IArtistRepository } from 'api/artist/repository'

export interface IArtistService {
  getAll: IArtistRepository['findAll']
  createOne: IArtistRepository['createOne']
}
