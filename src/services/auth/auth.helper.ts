import CookiesTypes from "constants/CookiesTypes"
import { IToken } from "interfaces/auth.interface"
import Cookies from "js-cookie"

export const saveTokensStorage = (data: IToken) => {
  Cookies.set(CookiesTypes.AccessToken, data.accessToken)
}

export const removeTokens = () => {
  Cookies.remove(CookiesTypes.AccessToken)
}

export const saveTokens = (data: IToken) => {
  saveTokensStorage(data)
}

export const getAccessToken = (): string | null => {
  return Cookies.get(CookiesTypes.AccessToken) ?? null
}