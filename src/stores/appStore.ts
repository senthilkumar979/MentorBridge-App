import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface StudentFilters {
  search: string
  cohort: string
  company: string
  role: string
}

interface AppState {
  studentFilters: StudentFilters
  setStudentFilters: (filters: Partial<StudentFilters>) => void
  resetStudentFilters: () => void
  biometricEnabled: boolean
  setBiometricEnabled: (enabled: boolean) => void
  /** Admin-only: preview the student app shell and screens. */
  studentModePreview: boolean
  setStudentModePreview: (enabled: boolean) => void
  pendingOfflineWrites: Array<{
    id: string
    type: 'meeting' | 'announcement'
    method: 'POST' | 'PATCH' | 'DELETE'
    path: string
    body?: unknown
    createdAt: string
  }>
  enqueueOfflineWrite: (write: AppState['pendingOfflineWrites'][number]) => void
  dequeueOfflineWrite: (id: string) => void
}

const defaultFilters: StudentFilters = {
  search: '',
  cohort: '',
  company: '',
  role: '',
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      studentFilters: defaultFilters,
      setStudentFilters: (filters) =>
        set((state) => ({
          studentFilters: { ...state.studentFilters, ...filters },
        })),
      resetStudentFilters: () => set({ studentFilters: defaultFilters }),
      biometricEnabled: false,
      setBiometricEnabled: (enabled) => set({ biometricEnabled: enabled }),
      studentModePreview: false,
      setStudentModePreview: (enabled) => set({ studentModePreview: enabled }),
      pendingOfflineWrites: [],
      enqueueOfflineWrite: (write) =>
        set((state) => ({
          pendingOfflineWrites: [...state.pendingOfflineWrites, write],
        })),
      dequeueOfflineWrite: (id) =>
        set((state) => ({
          pendingOfflineWrites: state.pendingOfflineWrites.filter(
            (w) => w.id !== id,
          ),
        })),
    }),
    {
      name: 'mentorbridge-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        studentFilters: state.studentFilters,
        biometricEnabled: state.biometricEnabled,
        studentModePreview: state.studentModePreview,
        pendingOfflineWrites: state.pendingOfflineWrites,
      }),
    },
  ),
)
