import { HttpError } from 'http-errors'

export type CreateHttpError = (
  message?: string,
  props?: Record<string, any>,
) => HttpError

export type CheckHttpError = (error: unknown) => boolean
