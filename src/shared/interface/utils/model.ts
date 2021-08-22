import { Document } from 'mongoose'

export type OnlyModelId<T extends Document> = T['_id']

export type PickModelId<T extends Document> = {
  id: Document['_id']
}
