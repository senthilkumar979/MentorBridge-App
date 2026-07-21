import { useMutation, useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  createAnnouncement,
  createMeeting,
  deleteAnnouncement,
  deleteMeeting,
  fetchAnnouncements,
  fetchDashboard,
  fetchMeeting,
  fetchMeetings,
  fetchMeetingsInRange,
  fetchStudent,
  fetchStudentFilterOptions,
  fetchStudents,
  updateAnnouncement,
  updateMeeting,
  updateMeetingAttendance,
  updateStudent,
  type Meeting,
} from '@/api/endpoints'
import { useAppStore } from '@/stores/appStore'
import { getCurrentWeekBoundsIst, getDateKeyIst } from '@/lib/meetingWeek'

export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboard,
    staleTime: 30_000,
  })
}

export function useStudents() {
  const filters = useAppStore((s) => s.studentFilters)
  return useInfiniteQuery({
    queryKey: ['students', filters],
    queryFn: ({ pageParam }) =>
      fetchStudents({
        page: pageParam,
        limit: 20,
        search: filters.search || undefined,
        cohort: filters.cohort || undefined,
        company: filters.company || undefined,
        role: filters.role || undefined,
      }),
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.pagination.hasNextPage ? last.pagination.page + 1 : undefined,
  })
}

export function useStudentFilterOptions() {
  return useQuery({
    queryKey: ['students', 'filter-options'],
    queryFn: fetchStudentFilterOptions,
    staleTime: 5 * 60_000,
  })
}

export function useStudent(id: string) {
  return useQuery({
    queryKey: ['students', id],
    queryFn: () => fetchStudent(id),
    enabled: !!id,
  })
}

export function useUpdateStudent(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: Parameters<typeof updateStudent>[1]) =>
      updateStudent(id, payload),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['students'] })
    },
  })
}

export function useMeetings(page = 1) {
  return useQuery({
    queryKey: ['meetings', { page }],
    queryFn: () => fetchMeetings(page),
  })
}

export function useMeetingsInfinite() {
  return useInfiniteQuery({
    queryKey: ['meetings', 'infinite'],
    queryFn: ({ pageParam }) => fetchMeetings(pageParam),
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.pagination.hasNextPage ? last.pagination.page + 1 : undefined,
  })
}

export function useMeetingsForWeek() {
  const bounds = getCurrentWeekBoundsIst()
  return useQuery({
    queryKey: ['meetings', 'week', bounds.fromIso, bounds.toIso],
    queryFn: async () => {
      const result = await fetchMeetingsInRange(bounds.fromIso, bounds.toIso)
      const fromMs = new Date(bounds.fromIso).getTime()
      const toMs = new Date(bounds.toIso).getTime()
      const inWeek = result.data.filter((meeting) => {
        const t = new Date(meeting.date).getTime()
        return !Number.isNaN(t) && t >= fromMs && t <= toMs
      })

      const meetingsByDay: Record<string, Meeting[]> = {}
      for (const day of bounds.weekDays) meetingsByDay[day.key] = []
      for (const meeting of inWeek) {
        const key = getDateKeyIst(meeting.date)
        if (meetingsByDay[key]) meetingsByDay[key].push(meeting)
      }
      return {
        weekDays: bounds.weekDays,
        meetingsByDay,
        monthLabel: bounds.monthLabel,
        rangeLabel: bounds.rangeLabel,
        totalCount: inWeek.length,
      }
    },
    staleTime: 60_000,
  })
}

export function useMeeting(id: string) {
  return useQuery({
    queryKey: ['meetings', id],
    queryFn: () => fetchMeeting(id),
    enabled: !!id,
  })
}

export function useMeetingMutations() {
  const qc = useQueryClient()
  const invalidate = () => {
    void qc.invalidateQueries({ queryKey: ['meetings'] })
  }

  return {
    create: useMutation({
      mutationFn: (payload: Omit<Meeting, 'id'>) => createMeeting(payload),
      onSuccess: invalidate,
    }),
    update: useMutation({
      mutationFn: ({ id, payload }: { id: string; payload: Omit<Meeting, 'id'> }) =>
        updateMeeting(id, payload),
      onSuccess: invalidate,
    }),
    remove: useMutation({
      mutationFn: (id: string) => deleteMeeting(id),
      onSuccess: invalidate,
    }),
    attendance: useMutation({
      mutationFn: ({ id, attendance }: { id: string; attendance: number[] }) =>
        updateMeetingAttendance(id, attendance),
      onSuccess: invalidate,
    }),
  }
}

export function useAnnouncements(page = 1) {
  return useQuery({
    queryKey: ['announcements', { page }],
    queryFn: () => fetchAnnouncements(page),
  })
}

export function useAnnouncementMutations() {
  const qc = useQueryClient()
  const invalidate = () =>
    void qc.invalidateQueries({ queryKey: ['announcements'] })

  return {
    create: useMutation({
      mutationFn: createAnnouncement,
      onSuccess: invalidate,
    }),
    update: useMutation({
      mutationFn: ({
        id,
        payload,
      }: {
        id: string
        payload: { title: string; description: string }
      }) => updateAnnouncement(id, payload),
      onSuccess: invalidate,
    }),
    remove: useMutation({
      mutationFn: deleteAnnouncement,
      onSuccess: invalidate,
    }),
  }
}
