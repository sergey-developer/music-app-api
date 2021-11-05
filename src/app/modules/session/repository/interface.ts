import { JwtPayload, JwtToken } from 'modules/session/interface'
import { ISessionDocument } from 'modules/session/model'

export interface ICreateSessionPayload extends JwtPayload {}

export interface IFindOneSessionFilter extends Partial<{ token: JwtToken }> {}

export interface IDeleteOneSessionFilter extends Partial<{ token: JwtToken }> {}

export interface ISessionRepository {
  findOne: (filter: IFindOneSessionFilter) => Promise<ISessionDocument>

  createOne: (payload: ICreateSessionPayload) => Promise<ISessionDocument>

  deleteOne: (filter: IDeleteOneSessionFilter) => Promise<ISessionDocument>
}
