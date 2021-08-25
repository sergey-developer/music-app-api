import { Schema, model } from 'mongoose'

import { ISessionDocument, ISessionModel } from 'api/session/model'
import { UserModel } from 'api/user/model'

const toJson = require('@meanie/mongoose-to-json')

const SessionSchema = new Schema<
  ISessionDocument,
  ISessionModel,
  ISessionDocument
>({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: UserModel.modelName,
    required: true,
    unique: true,
  },
})

SessionSchema.plugin(toJson)

const SessionModel = model<ISessionDocument, ISessionModel>(
  'Session',
  SessionSchema,
)

export default SessionModel
