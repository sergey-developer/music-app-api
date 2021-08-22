export type SuccessResBody<T> = {
  data: T
}

// TODO: придумать структуру ответа ошибки
export type ErrorResBody<T> = T

// TODO: убрать any когда ErrorResponseBody будет готово
export type ResBody<SuccessBody, ErrorBody = any> =
  | SuccessResBody<SuccessBody>
  | ErrorResBody<ErrorBody>
