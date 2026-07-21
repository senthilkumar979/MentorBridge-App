import * as SecureStore from 'expo-secure-store'
import { Platform } from 'react-native'
import type { TokenCache } from '@clerk/clerk-expo'

const createTokenCache = (): TokenCache => ({
  async getToken(key) {
    try {
      return await SecureStore.getItemAsync(key)
    } catch {
      return null
    }
  },
  async saveToken(key, value) {
    try {
      await SecureStore.setItemAsync(key, value)
    } catch {
      // ignore
    }
  },
})

export const tokenCache = Platform.OS !== 'web' ? createTokenCache() : undefined
