import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { Platform } from 'react-native'

import { getErrorMessage } from '@/api/errors'
import { API_BASE_URL, APP_VERSION } from '@/constants/brand'

export interface ApiErrorBody {
  error: string
  code?: string
  details?: unknown
}

export { getErrorMessage }

let getToken: (() => Promise<string | null>) | null = null

export function setApiTokenGetter(fn: () => Promise<string | null>) {
  getToken = fn
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-Client-Platform': Platform.OS,
    'X-App-Version': APP_VERSION,
  },
})

apiClient.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  if (getToken) {
    const token = await getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorBody>) => {
    const message =
      error.response?.data?.error ??
      error.message ??
      'Something went wrong'
    const code = error.response?.data?.code ?? 'UNKNOWN'
    const status = error.response?.status
    return Promise.reject(Object.assign(new Error(message), { code, status }))
  },
)
