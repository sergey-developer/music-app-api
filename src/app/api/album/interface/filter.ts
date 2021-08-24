import { IArtistDocument } from 'api/artist/model'
import { DocumentId } from 'database/interface/document'

export type GetAllAlbumsFilterDto = Partial<{
  artist: DocumentId<IArtistDocument>
}>
