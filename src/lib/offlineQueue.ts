import { apiClient } from '@/api/client'
import { useAppStore } from '@/stores/appStore'

export async function flushOfflineQueue() {
  const { pendingOfflineWrites, dequeueOfflineWrite } = useAppStore.getState()
  let flushed = 0
  let failed = 0

  for (const write of [...pendingOfflineWrites]) {
    try {
      if (write.method === 'POST') {
        await apiClient.post(write.path, write.body)
      } else if (write.method === 'PATCH') {
        await apiClient.patch(write.path, write.body)
      } else if (write.method === 'DELETE') {
        await apiClient.delete(write.path)
      }
      dequeueOfflineWrite(write.id)
      flushed += 1
    } catch {
      failed += 1
    }
  }

  return { flushed, failed }
}
