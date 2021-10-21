import { JwtPayload, JwtToken } from 'modules/session/interface'
import { ISessionDocument } from 'modules/session/model'

export interface ICreateSessionPayload extends JwtPayload {}

export interface ISessionRepository {
  findOneByToken: (token: JwtToken) => Promise<ISessionDocument>

  createOne: (payload: ICreateSessionPayload) => Promise<ISessionDocument>

  deleteOneByToken: (token: JwtToken) => Promise<ISessionDocument>
}
