import axios from "axios";
import { errorCatch } from "./api.helper";
import { getAccessToken, removeTokens } from "services/auth/auth.helper";

export const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL
})

instance.interceptors.request.use(config => {
  const accessToken = getAccessToken()

  if (config.headers && accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})

instance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config

    if (
      error.response.status === 401 && 
      error.config && 
      !error.config._isRetry
    ) {
        originalRequest._isRetry = true
        removeTokens()
      }

  return error
})