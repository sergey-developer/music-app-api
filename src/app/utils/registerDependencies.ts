import { modelList } from 'database/constants/modelList'
import registerModels from 'database/utils/registerModels'

const registerDependencies = (): void => {
  registerModels(modelList)
}

export default registerDependencies
