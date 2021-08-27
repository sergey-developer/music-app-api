import { ICreateSessionPayload, JwtToken } from 'api/session/interface'
import { ISessionDocument } from 'api/session/model'
import { MaybeNull } from 'shared/interface/utils/common'

export interface ISessionRepository {
  create: (payload: ICreateSessionPayload) => Promise<ISessionDocument>
  findOneByToken: (token: JwtToken) => Promise<MaybeNull<ISessionDocument>>
  deleteOneByToken: (token: JwtToken) => Promise<void>
}
