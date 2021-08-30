import { GetAllRequestsFilterDto } from 'api/request/dto'

export type GetAllArtistsFilterDto = Partial<{
  status: GetAllRequestsFilterDto['status']
  userId: GetAllRequestsFilterDto['creator']
}>
