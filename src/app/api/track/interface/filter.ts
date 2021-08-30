import { GetAllTracksFilterDto } from 'api/track/dto'

export type GetAllTracksFilter = Partial<Pick<GetAllTracksFilterDto, 'album'>>
