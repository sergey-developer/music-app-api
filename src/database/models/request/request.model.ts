import { Schema, model } from 'mongoose'
import autopopulate from 'mongoose-autopopulate'

import EntityNamesEnum from 'database/constants/entityNamesEnum'
import { IRequestDocument, IRequestModel } from 'database/models/request'
import {
  MAX_LENGTH_REASON,
  MIN_LENGTH_REASON,
  RequestStatusEnum,
} from 'modules/request/constants'

const toJson = require('@meanie/mongoose-to-json')

const RequestSchema = new Schema<
  IRequestDocument,
  IRequestModel,
  IRequestDocument
>(
  {
    status: {
      type: String,
      required: true,
      enum: [
        RequestStatusEnum.Approved,
        RequestStatusEnum.Rejected,
        RequestStatusEnum.Pending,
      ],
      default: RequestStatusEnum.Pending,
    },
    reason: {
      type: String,
      trim: true,
      minlength: MIN_LENGTH_REASON,
      maxlength: MAX_LENGTH_REASON,
      default: null,
    },
    entityName: {
      type: String,
      required: true,
      enum: [
        EntityNamesEnum.Artist,
        EntityNamesEnum.Album,
        EntityNamesEnum.Track,
      ],
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: EntityNamesEnum.User,
      required: true,
      autopopulate: true,
    },
    entity: {
      type: Schema.Types.ObjectId,
      refPath: 'entityName',
      required: true,
      autopopulate: true,
    },
  },
  { timestamps: true },
)

RequestSchema.plugin(toJson)
RequestSchema.plugin(autopopulate)

const RequestModel = model<IRequestDocument, IRequestModel>(
  EntityNamesEnum.Request,
  RequestSchema,
)

export default RequestModel
