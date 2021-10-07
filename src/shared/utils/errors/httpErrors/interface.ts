import { HttpError } from 'http-errors'

import { MaybeNull } from 'shared/interface/utils/common'

export type CreateHttpError = (
  message?: MaybeNull<string>,
  props?: Record<string, any>,
) => HttpError

export type CheckHttpError = (error: unknown) => boolean
