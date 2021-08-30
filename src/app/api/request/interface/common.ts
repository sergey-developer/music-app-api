import { IRequestDocument } from 'api/request/model'

export type RequestDocumentArray = IRequestDocument[]

export enum RequestStatusEnum {
  Pending = 'Pending',
  Approved = 'Approved',
  Rejected = 'Rejected',
}

export enum RequestEntityNameEnum {
  Artist = 'Artist',
  Album = 'Album',
  Track = 'Track',
}
