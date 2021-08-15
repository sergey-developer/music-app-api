import { Request as ExpressRequest } from 'express'

export interface Request<Body = any> extends ExpressRequest {
  body: Body
}
