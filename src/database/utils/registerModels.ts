import { container as DiContainer } from 'tsyringe'

import getModelByDiToken, {
  DiTokenToModel,
} from 'database/utils/getModelByDiToken'
import { DiTokenEnum } from 'lib/dependency-injection'

const registerModel = (token: DiTokenEnum) => {
  const model = getModelByDiToken(token)
  DiContainer.register(token, { useValue: model })
}

const registerModels = () => {
  Object.keys(DiTokenToModel).forEach((token) => {
    registerModel(token as DiTokenEnum)
  })
}

export { registerModel }

export default registerModels
