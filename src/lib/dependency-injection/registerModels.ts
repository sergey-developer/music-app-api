import { container as DiContainer } from 'tsyringe'

import { IModelList, IModelListItem } from 'database/utils/modelList'

export const registerModel = (model: IModelListItem) => {
  DiContainer.register(model.name, { useValue: model.value })
}

export const registerModelList = (modelList: IModelList): void => {
  modelList.forEach(registerModel)
}
