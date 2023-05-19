import { instance } from "api/api.interceptor";
import { IRegisterCompany, IToken } from "interfaces/auth.interface";

export const AuthService = {
  async registerCompany(data: IRegisterCompany) {
    const response = await instance<IToken>({
      url: '/auth/register/company',
      method: 'POST',
      data
    })

    return response
  }
}