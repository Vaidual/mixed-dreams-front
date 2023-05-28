import { instance } from "api/api.interceptor";
import { IAuthResponse, ILogin, IRegisterCompany } from "interfaces/auth.interface";
import { saveAuthDataToStorage } from "./auth.helper";

export const AuthService = {
  async registerCompany(data: IRegisterCompany) {
    const response = await instance<IAuthResponse>({
      url: '/auth/register/company',
      method: 'POST',
      data
    })

    saveAuthDataToStorage(response.data);
    
    return response.data
  },

  async login(data: ILogin) {
    const response = await instance<IAuthResponse>({
      url: '/auth/login',
      method: 'POST',
      data
    })

    if(response.data?.tokens) {
      saveAuthDataToStorage(response.data);
    }

    return response.data
  },
}