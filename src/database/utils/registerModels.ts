import { container as DiContainer } from 'tsyringe'

import { IModelList } from 'database/constants/modelList'

const registerModels = (modelList: IModelList): void => {
  modelList.forEach((model) => {
    DiContainer.register(model.name, { useValue: model.value })
  })
}

export default registerModels
