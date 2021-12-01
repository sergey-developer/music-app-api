import { modelList } from 'database/utils/modelList'
import { registerModelList } from 'lib/dependency-injection/registerModels'

const registerDependencies = (): void => {
  registerModelList(modelList)
}

export default registerDependencies
