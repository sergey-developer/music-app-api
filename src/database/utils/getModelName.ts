import EntityNamesEnum from 'database/constants/entityNamesEnum'

type ModelName = `${EntityNamesEnum}Model`

const getModelName = (modelName: EntityNamesEnum): ModelName => {
  return `${modelName}Model` as ModelName
}

export default getModelName
