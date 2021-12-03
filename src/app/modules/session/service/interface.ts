import { ISessionDocument } from 'database/models/session'
import { JwtPayload } from 'modules/session/interface'

export interface ICreateOneSessionPayload extends JwtPayload {}

export interface ISessionService {
  getOneByToken: (token: ISessionDocument['token']) => Promise<ISessionDocument>

  createOne: (payload: ICreateOneSessionPayload) => Promise<ISessionDocument>

  deleteOneByToken: (
    token: ISessionDocument['token'],
  ) => Promise<ISessionDocument>
}
