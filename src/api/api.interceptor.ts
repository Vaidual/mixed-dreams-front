import axios, { AxiosError } from "axios";
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
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
        removeTokens()
      }

  return Promise.reject(error.response?.data ?? error);
})