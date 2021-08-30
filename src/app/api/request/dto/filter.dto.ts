import { RequestEntityNameEnum, RequestStatusEnum } from 'api/request/interface'
import { IUserDocument } from 'api/user/model'
import { DocumentId } from 'database/interface/document'

export type GetAllRequestsFilterDto = Partial<{
  kind: RequestEntityNameEnum
  status: RequestStatusEnum
  creator: DocumentId<IUserDocument>
}>
