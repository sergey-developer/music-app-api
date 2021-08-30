import { Schema, model } from 'mongoose'

import { RequestEntityNameEnum, RequestStatusEnum } from 'api/request/interface'
import { IRequestDocument, IRequestModel } from 'api/request/model'
import { UserModel } from 'api/user/model'

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
      enum: [
        RequestEntityNameEnum.Artist,
        RequestEntityNameEnum.Album,
        RequestEntityNameEnum.Track,
      ],
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: UserModel.modelName,
      required: true,
    },
    entity: {
      type: Schema.Types.ObjectId,
      refPath: 'entityName',
      required: true,
    },
  },
  { timestamps: true },
)

RequestSchema.plugin(toJson)

const RequestModel = model<IRequestDocument, IRequestModel>(
  'Request',
  RequestSchema,
)

export default RequestModel
