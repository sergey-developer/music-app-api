import { Schema, model } from 'mongoose'

import { ModelNamesEnum } from 'database/constants'
import {
  MAX_LENGTH_PASSWORD,
  MAX_LENGTH_USERNAME,
  MIN_LENGTH_PASSWORD,
  MIN_LENGTH_USERNAME,
  UserRoleEnum,
} from 'modules/user/constants'
import { IUserDocument, IUserModel } from 'modules/user/model'
import { checkPassword, generatePassword } from 'modules/user/utils'

const toJson = require('@meanie/mongoose-to-json')

const UserSchema = new Schema<IUserDocument, IUserModel, IUserDocument>({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: MIN_LENGTH_USERNAME,
    maxlength: MAX_LENGTH_USERNAME,
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
    minlength: MIN_LENGTH_PASSWORD,
    maxlength: MAX_LENGTH_PASSWORD,
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
