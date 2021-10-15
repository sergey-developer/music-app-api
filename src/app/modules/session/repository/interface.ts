import { JwtPayload, JwtToken } from 'modules/session/interface'
import { ISessionDocument } from 'modules/session/model'

export interface ICreateSessionRepositoryPayload extends JwtPayload {}

export interface ISessionRepository {
  findOneByToken: (token: JwtToken) => Promise<ISessionDocument>

  create: (
    payload: ICreateSessionRepositoryPayload,
  ) => Promise<ISessionDocument>

  deleteOneByToken: (token: JwtToken) => Promise<void>
}
