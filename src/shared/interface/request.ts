import { ParamsDictionary, Query } from 'express-serve-static-core'

export type ReqParams<T extends ParamsDictionary> = T
export type ReqQuery<T extends Query> = T
