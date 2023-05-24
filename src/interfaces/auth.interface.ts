import { IAddress } from "./address.interface"

export interface IRegisterCompany {
  firstName: string,
  lastName: string,
  email: string,
  password: string
  companyName: string,
  birthday: string,
  address: IAddress
}

export interface IOptionalRegisterCompany extends Partial<IRegisterCompany> {}

export interface ITokens {
  accessToken: string
}

export interface ILogin {
  email: string,
  password: string,
  rememberMe: boolean,
}

export interface IAuthResponse {
  user: IUser,
  tokens: ITokens
}

export interface IUser {
  firstName: string,
  lastName: string,
  email: string,
}