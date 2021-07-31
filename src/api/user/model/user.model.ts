import { Model, model, Schema } from 'mongoose'

import ModelName from 'shared/utils/modelName'

import { IUser } from './types'

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
})

const UserModelName = new ModelName('user')

const UserModel: Model<IUser> = model(UserModelName.name, UserSchema)

export {
  UserModelName,
}

export default UserModel
