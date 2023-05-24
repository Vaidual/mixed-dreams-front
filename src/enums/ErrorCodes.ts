export enum ErrorCodes {
  InternalError = -1,

  EmailIsTaken = 0,
  LargeOrder = 1,
  PeriodDoesntExist = 2,
  PropertyIsTaken = 3,
  EntityNotFound = 4,
  InvalidCredentials  = 5,
  ParsingError = 6,
  ModelValidationError = 6,
}