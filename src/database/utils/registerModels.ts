import { container as DiContainer } from 'tsyringe'

import { IModelList, IModelListItem } from 'database/constants/modelList'

export const registerModel = (model: IModelListItem) => {
  DiContainer.register(model.name, { useValue: model.value })
}

export const registerModels = (modelList: IModelList): void => {
  modelList.forEach(registerModel)
}
