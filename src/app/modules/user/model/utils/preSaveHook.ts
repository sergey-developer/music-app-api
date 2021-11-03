import { PreSaveMiddlewareFunction } from 'mongoose'

import { IUserDocument } from 'modules/user/model'
import { generatePassword } from 'modules/user/utils'

const preSaveHook: PreSaveMiddlewareFunction<
  Pick<IUserDocument, 'password' | 'isModified'>
> = async function (this, next) {
  if (!this.isModified('password')) return next()

  this.password = await generatePassword(this.password)
  next()
}

export default preSaveHook
