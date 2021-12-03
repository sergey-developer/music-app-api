import { ISessionDocument } from 'database/models/session'
import { JwtPayload, JwtToken } from 'modules/session/interface'

export interface ICreateOneSessionPayload extends JwtPayload {}

export interface IFindOneSessionFilter extends Partial<{ token: JwtToken }> {}

export interface IDeleteOneSessionFilter extends Partial<{ token: JwtToken }> {}

export interface ISessionRepository {
  findOne: (filter: IFindOneSessionFilter) => Promise<ISessionDocument>

  createOne: (payload: ICreateOneSessionPayload) => Promise<ISessionDocument>

  deleteOne: (filter: IDeleteOneSessionFilter) => Promise<ISessionDocument>
}
