import { Model, Schema, model } from 'mongoose'

import { IUserModel } from 'api/user/model'

const toJson = require('@meanie/mongoose-to-json')

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true, // TODO: add validation
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
})

UserSchema.plugin(toJson)

const UserModel: Model<IUserModel> = model('User', UserSchema)

export default UserModel
