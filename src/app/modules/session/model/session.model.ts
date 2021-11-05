import config from 'config'
import { Schema, model } from 'mongoose'

import { EntityNamesEnum } from 'database/constants/entityNames'
import { JwtPayload, JwtToken } from 'modules/session/interface'
import { ISessionDocument, ISessionModel } from 'modules/session/model'
import { generateToken as baseGenerateToken } from 'modules/session/utils'

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
    ref: EntityNamesEnum.User,
    required: true,
    unique: true,
  },
})

const generateToken = function (payload: JwtPayload): JwtToken {
  const secret: string = config.get('app.secrets.tokenSecret')
  return baseGenerateToken(payload, secret)
}

SessionSchema.static('generateToken', generateToken)
SessionSchema.plugin(toJson)

const SessionModel = model<ISessionDocument, ISessionModel>(
  EntityNamesEnum.Session,
  SessionSchema,
)

export { generateToken }
export default SessionModel
