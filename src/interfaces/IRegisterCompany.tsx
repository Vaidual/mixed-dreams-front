export interface IRegisterCompany {
  email: string,
  password: string,
  country: string
}

export interface IOptionalRegisterCompany extends Partial<IRegisterCompany> {}