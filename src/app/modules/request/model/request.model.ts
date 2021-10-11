import { Schema, model } from 'mongoose'
import autopopulate from 'mongoose-autopopulate'

import { ModelNamesEnum } from 'database/constants'
import { RequestStatusEnum } from 'modules/request/constants'
import { IRequestDocument, IRequestModel } from 'modules/request/model'

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
      default: null,
      // TODO: make capitalize
    },
    entityName: {
      type: String,
      required: true,
      enum: [ModelNamesEnum.Artist, ModelNamesEnum.Album, ModelNamesEnum.Track],
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: ModelNamesEnum.User,
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
  ModelNamesEnum.Request,
  RequestSchema,
)

export default RequestModel
