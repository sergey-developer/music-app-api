import { Schema, model } from 'mongoose'

import { EntityNamesEnum } from 'database/constants/entityNames'
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
const uniqueValidation = require('mongoose-unique-validator')

const UserSchema = new Schema<IUserDocument, IUserModel, IUserDocument>({
  username: {
    type: String,
    required: true,
    unique: 'User with such name is already exists' as any,
    minlength: MIN_LENGTH_USERNAME,
    maxlength: MAX_LENGTH_USERNAME,
  },
  email: {
    type: String,
    required: true,
    unique: 'User with such email is already exists' as any,
  },
  password: {
    type: String,
    required: true,
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
UserSchema.plugin(uniqueValidation)

const UserModel = model<IUserDocument, IUserModel>(
  EntityNamesEnum.User,
  UserSchema,
)

export default UserModel
