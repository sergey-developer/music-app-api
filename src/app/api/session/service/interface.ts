import { ISessionRepository } from 'api/session/repository'

export interface ISessionService {
  create: ISessionRepository['create']
}
