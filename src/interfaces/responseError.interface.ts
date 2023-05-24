export interface IStandardError {
  statusCode: number,
  title: string
  errorCode: number
}

export interface IValidationError extends IStandardError {
  errors: {[field: string]: string[]}
}

export interface IBadRequestError extends IStandardError {
  errors: {[field: string]: string}
}

export type IResponseError = IValidationError | IBadRequestError | IStandardError