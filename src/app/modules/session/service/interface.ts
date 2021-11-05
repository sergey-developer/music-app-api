import { ISessionDocument } from 'modules/session/model'
import { IUserDocument } from 'modules/user/model'

export interface ICreateSessionPayload
  extends Pick<IUserDocument, 'email' | 'role'> {
  userId: IUserDocument['id']
}

export interface ISessionService {
  getOneByToken: (token: ISessionDocument['token']) => Promise<ISessionDocument>

  createOne: (payload: ICreateSessionPayload) => Promise<ISessionDocument>

  deleteOneByToken: (
    token: ISessionDocument['token'],
  ) => Promise<ISessionDocument>
}
