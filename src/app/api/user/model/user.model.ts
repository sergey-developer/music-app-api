import { Schema, model } from 'mongoose'

import { UserRoleEnum } from 'api/user/interface'
import { IUserDocument, IUserModel } from 'api/user/model'

const toJson = require('@meanie/mongoose-to-json')

const UserSchema = new Schema<IUserDocument, IUserModel, IUserDocument>({
  username: {
    type: String,
    unique: true, // TODO: add validation
    required: true,
  },
  password: {
    type: String,
    required: true,
    /**
     * Field from "@meanie/mongoose-to-json"
     * */
    private: true,
  },
  role: {
    type: String,
    default: UserRoleEnum.User,
    enum: [UserRoleEnum.User, UserRoleEnum.Admin],
  },
})

UserSchema.plugin(toJson)

const UserModel = model<IUserDocument, IUserModel>('User', UserSchema)

export default UserModel
