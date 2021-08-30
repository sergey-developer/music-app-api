import { IRequestDocument } from 'api/request/model'

export interface ICreateRequestPayload
  extends Pick<
    IRequestDocument,
    'status' | 'reason' | 'entityName' | 'entity' | 'creator'
  > {}
