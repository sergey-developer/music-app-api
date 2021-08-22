import { Document } from 'mongoose'

export type ModelId<T extends Document> = T['_id']

export type PickModelId<T extends Document> = {
  id: ModelId<T>
}
