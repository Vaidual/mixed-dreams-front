import { instance } from "api/api.interceptor";
import { ILogin, IRegisterCompany, IToken } from "interfaces/auth.interface";

export const AuthService = {
  async registerCompany(data: IRegisterCompany) {
    const response = await instance<IToken>({
      url: '/auth/register/company',
      method: 'POST',
      data
    })

    return response.data as IToken
  },

  async login(data: ILogin) {
    const response = await instance<IToken>({
      url: '/auth/login',
      method: 'POST',
      data
    })

    return response.data as IToken
  }
}