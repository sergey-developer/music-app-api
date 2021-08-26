import { ICreateSessionPayload } from 'api/session/interface'
import { ISessionDocument } from 'api/session/model'

export interface ISessionRepository {
  create: (payload: ICreateSessionPayload) => Promise<ISessionDocument>
}
