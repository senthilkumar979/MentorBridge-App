import Constants, { ExecutionEnvironment } from 'expo-constants'
import * as Device from 'expo-device'
import { Platform } from 'react-native'

import { registerPushToken } from '@/api/endpoints'

const isExpoGo =
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient

async function getNotifications() {
  if (isExpoGo) {
    throw new Error(
      'Push notifications require a development build. They are unavailable in Expo Go on Android (SDK 53+).',
    )
  }

  return import('expo-notifications')
}

export async function registerForPushNotifications() {
  const Notifications = await getNotifications()

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  })

  if (!Device.isDevice) {
    throw new Error('Push notifications require a physical device')
  }

  const { status: existing } = await Notifications.getPermissionsAsync()
  let finalStatus = existing
  if (existing !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync()
    finalStatus = status
  }
  if (finalStatus !== 'granted') {
    throw new Error('Notification permission not granted')
  }

  const token = (await Notifications.getExpoPushTokenAsync()).data

  await registerPushToken({
    deviceId: Device.modelId ?? Device.modelName ?? 'unknown-device',
    platform: Platform.OS === 'ios' ? 'ios' : 'android',
    pushToken: token,
  })

  return token
}
