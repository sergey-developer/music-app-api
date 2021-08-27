import { Schema, model } from 'mongoose'

import { JwtPayload, JwtToken } from 'api/session/interface'
import { ISessionDocument, ISessionModel } from 'api/session/model'
import { generateToken } from 'api/session/utils'
import { UserModel } from 'api/user/model'
import { envConfig } from 'configs/env'

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

SessionSchema.static('generateToken', function (payload: JwtPayload): JwtToken {
  const secret = envConfig.app.tokenSecret
  return generateToken(payload, secret)
})

SessionSchema.plugin(toJson)

const SessionModel = model<ISessionDocument, ISessionModel>(
  'Session',
  SessionSchema,
)

export default SessionModel
