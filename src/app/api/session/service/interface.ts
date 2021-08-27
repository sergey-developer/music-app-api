import { ISessionDocument } from 'api/session/model'
import { ISessionRepository } from 'api/session/repository'
import { IUserDocument } from 'api/user/model'

export interface ISessionService {
  create: (payload: IUserDocument) => Promise<ISessionDocument>
  getOneByToken: ISessionRepository['findOneByToken']
  deleteOneByToken: ISessionRepository['deleteOneByToken']
}
