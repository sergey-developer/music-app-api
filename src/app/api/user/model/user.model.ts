import { Schema, model } from 'mongoose'

import { UserRoleEnum } from 'api/user/interface'
import { IUserDocument, IUserModel } from 'api/user/model'
import { checkPassword, generatePassword } from 'api/user/utils'
import { ModelNamesEnum } from 'database/constants'

const toJson = require('@meanie/mongoose-to-json')

const UserSchema = new Schema<IUserDocument, IUserModel, IUserDocument>({
  username: {
    type: String,
    required: true,
    unique: true,
    // TODO: add validation
  },
  email: {
    type: String,
    required: true,
    unique: true, // TODO: add validation
  },
  password: {
    type: String,
    required: true,
    unique: true,
    /**
     * Field from "@meanie/mongoose-to-json"
     * */
    private: true,
  },
  role: {
    type: String,
    default: UserRoleEnum.User,
    enum: [UserRoleEnum.User, UserRoleEnum.Moderator],
  },
})

UserSchema.pre('save', async function (next): Promise<void> {
  if (!this.isModified('password')) return next()

  this.password = await generatePassword(this.password)
  next()
})

UserSchema.method(
  'checkPassword',
  async function (password: string): Promise<boolean> {
    return checkPassword(password, this.password)
  },
)

UserSchema.plugin(toJson)

const UserModel = model<IUserDocument, IUserModel>(
  ModelNamesEnum.User,
  UserSchema,
)

export default UserModel
