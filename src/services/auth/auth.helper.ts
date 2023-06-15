import CookiesTypes from "constants/CookiesTypes"
import StorageTypes from "constants/StorageTypes"
import { IAuthResponse, ITokens } from "interfaces/auth.interface"
import { ICompanyClaims } from "interfaces/claims.interface"
import Cookies from "js-cookie"
import jwt_decode from "jwt-decode"

export const saveTokensStorage = (data: ITokens) => {
	var decodedHeader: ICompanyClaims = jwt_decode(data.accessToken)
	Cookies.set(CookiesTypes.AccessToken, data.accessToken, {
		secure: true,
		expires: decodedHeader.exp
	})
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