import CookiesTypes from "constants/CookiesTypes"
import StorageTypes from "constants/StorageTypes"
import { IAuthResponse, ITokens } from "interfaces/auth.interface"
import Cookies from "js-cookie"

export const saveTokensStorage = (data: ITokens) => {
  Cookies.set(CookiesTypes.AccessToken, data.accessToken, {
    secure: true,
  });
}

export const removeTokens = () => {
  Cookies.remove(CookiesTypes.AccessToken);
}

export const saveTokens = (data: ITokens) => {
  saveTokensStorage(data);
}

export const getAccessToken = (): string | null => {
  return Cookies.get(CookiesTypes.AccessToken) ?? null;
}

export const saveAuthDataToStorage = (data: IAuthResponse) => {
  saveTokens(data.tokens);
  localStorage.setItem(StorageTypes.User, JSON.stringify(data.user));
}

export const removeAuthDataFromStorage = () => {
  removeTokens();
  localStorage.removeItem(StorageTypes.User);
}