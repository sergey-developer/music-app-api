import { JwtPayload as BaseJwtPayload } from 'jsonwebtoken'

import { IUserDocument } from 'api/user/model'
import { MaybeString } from 'shared/interface/utils/common'

export type JwtPayload = Pick<IUserDocument, 'id' | 'email'>

export type JwtToken = string

export type JwtVerifyResult = MaybeString<BaseJwtPayload>
