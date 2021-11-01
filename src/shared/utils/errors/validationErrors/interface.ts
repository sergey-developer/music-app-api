export interface IValidationError {
  value: string
  messages: Array<string>
}

export interface IValidationErrors extends Record<string, IValidationError> {}
