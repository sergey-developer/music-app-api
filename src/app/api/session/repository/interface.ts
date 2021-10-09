import { JwtPayload, JwtToken } from 'api/session/interface'
import { ISessionDocument } from 'api/session/model'

export interface ICreateSessionRepositoryPayload extends JwtPayload {}

export interface ISessionRepository {
  create: (
    payload: ICreateSessionRepositoryPayload,
  ) => Promise<ISessionDocument>

  findOneByToken: (token: JwtToken) => Promise<ISessionDocument>

  deleteOneByToken: (token: JwtToken) => Promise<void>
}
