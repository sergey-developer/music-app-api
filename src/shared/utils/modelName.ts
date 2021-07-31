import _upperFirst from 'lodash.upperfirst'

class ModelName {
  public name: Capitalize<string>
  public lowercaseName: Lowercase<string>

  constructor(name: string) {
    this.name = _upperFirst(name)
    this.lowercaseName = name.toLowerCase()
  }
}

export default ModelName
