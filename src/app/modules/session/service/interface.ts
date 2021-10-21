import { ISessionDocument } from 'modules/session/model'
import { ISessionRepository } from 'modules/session/repository'
import { IUserDocument } from 'modules/user/model'

export interface ICreateSessionPayload
  extends Pick<IUserDocument, 'id' | 'email' | 'role'> {}

export interface ISessionService {
  getOneByToken: ISessionRepository['findOneByToken']

  createOne: (payload: ICreateSessionPayload) => Promise<ISessionDocument>

  deleteOneByToken: ISessionRepository['deleteOneByToken']
}
