import { ISessionDocument } from 'api/session/model'
import { ISessionRepository } from 'api/session/repository'
import { IUserDocument } from 'api/user/model'

export interface ICreateSessionServicePayload
  extends Pick<IUserDocument, 'id' | 'email' | 'role'> {}

export interface ISessionService {
  create: (payload: ICreateSessionServicePayload) => Promise<ISessionDocument>

  getOneByToken: ISessionRepository['findOneByToken']

  deleteOneByToken: ISessionRepository['deleteOneByToken']
}
