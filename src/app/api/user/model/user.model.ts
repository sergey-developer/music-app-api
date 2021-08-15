import { Model, Schema, model } from 'mongoose'

import { IUserModel } from 'api/user/model'

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

UserSchema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject()
  object.id = _id
  return object
})

const UserModel: Model<IUserModel> = model('user', UserSchema)

export default UserModel
