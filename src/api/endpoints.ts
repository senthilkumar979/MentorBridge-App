import { apiClient } from '@/api/client'
import type { ProfileData } from '@/types/student'

export interface MeResponse {
  user: {
    id: string
    email: string
    firstName: string | null
    lastName: string | null
    imageUrl: string
    publicMetadata: Record<string, unknown>
  }
  isAdmin: boolean
  linkedStudent: {
    id: string
    name: string
    email: string
    cohortId: string | null
    batch: string | null
  } | null
}

export interface Pagination {
  page: number
  limit: number
  totalCount: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface Paginated<T> {
  data: T[]
  pagination: Pagination
}

export interface DashboardData {
  studentCount: number
  meetingsTodayCount: number
  openAssignmentsCount: number
  pendingSubmissionsCount: number
  recentAnnouncements: Array<{
    id: string
    title: string
    description: string
    created_at?: string
  }>
}

export interface Meeting {
  id?: string
  title: string
  date: string
  googleGroupId: string
  description: string
  meetingLink: string
  coverImageUrl: string
  feedbackForm?: string
  feedbackEmailSentAt?: string | null
  attendance?: number[]
}

export interface Announcement {
  id: string
  title: string
  description: string
  created_at?: string
}

export async function fetchMe() {
  const { data } = await apiClient.get<MeResponse>('/api/mobile/v1/me')
  return data
}

export async function fetchDashboard() {
  const { data } = await apiClient.get<{ data: DashboardData }>(
    '/api/mobile/v1/admin/dashboard',
  )
  return data.data
}

export async function fetchStudents(params: {
  page?: number
  limit?: number
  search?: string
  cohort?: string
  company?: string
  role?: string
}) {
  const { data } = await apiClient.get<Paginated<ProfileData>>(
    '/api/mobile/v1/admin/students',
    { params },
  )
  return data
}

export async function fetchStudentFilterOptions() {
  const { data } = await apiClient.get<{
    data: {
      cohorts: Array<{ id: string; name: string }>
      companies: string[]
      roles: string[]
    }
  }>('/api/mobile/v1/admin/students/filter-options')
  return data.data
}

export async function fetchStudent(id: string) {
  const { data } = await apiClient.get<{ data: ProfileData }>(
    `/api/mobile/v1/admin/students/${id}`,
  )
  return data.data
}

export async function updateStudent(id: string, payload: Partial<ProfileData> & {
  name: string
  email: string
  role: string
  cohortId: string
}) {
  const { data } = await apiClient.patch<{ data: ProfileData }>(
    `/api/mobile/v1/admin/students/${id}`,
    payload,
  )
  return data.data
}

export async function fetchMeetings(page = 1, limit = 20) {
  const { data } = await apiClient.get<Paginated<Meeting>>(
    '/api/mobile/v1/admin/meetings',
    { params: { page, limit } },
  )
  return data
}

/** Member-readable events (students + admins). Falls back to admin list if needed. */
export async function fetchMemberMeetings(page = 1, limit = 50) {
  try {
    const { data } = await apiClient.get<Paginated<Meeting>>(
      '/api/mobile/v1/meetings',
      { params: { page, limit } },
    )
    return data
  } catch (error) {
    const status = (error as { status?: number }).status
    if (status === 404 || status === 405) return fetchMeetings(page, limit)
    throw error
  }
}

export async function fetchMemberMeeting(id: string) {
  try {
    const { data } = await apiClient.get<{ data: Meeting }>(
      `/api/mobile/v1/meetings/${id}`,
    )
    return data.data
  } catch (error) {
    const status = (error as { status?: number }).status
    if (status === 404 || status === 405) return fetchMeeting(id)
    throw error
  }
}

export async function fetchMeetingsInRange(from: string, to: string) {
  const { data } = await apiClient.get<Paginated<Meeting>>(
    '/api/mobile/v1/admin/meetings',
    { params: { page: 1, limit: 100, from, to } },
  )
  return data
}

export async function fetchMeeting(id: string) {
  const { data } = await apiClient.get<{ data: Meeting }>(
    `/api/mobile/v1/admin/meetings/${id}`,
  )
  return data.data
}

export async function createMeeting(payload: Omit<Meeting, 'id'>) {
  const { data } = await apiClient.post<{ data: Meeting }>(
    '/api/mobile/v1/admin/meetings',
    payload,
  )
  return data.data
}

export async function updateMeeting(id: string, payload: Omit<Meeting, 'id'>) {
  const { data } = await apiClient.patch<{ data: Meeting }>(
    `/api/mobile/v1/admin/meetings/${id}`,
    payload,
  )
  return data.data
}

export async function deleteMeeting(id: string) {
  await apiClient.delete(`/api/mobile/v1/admin/meetings/${id}`)
}

export async function updateMeetingAttendance(id: string, attendance: number[]) {
  const { data } = await apiClient.patch<{ data: Meeting }>(
    `/api/mobile/v1/admin/meetings/${id}/attendance`,
    { attendance },
  )
  return data.data
}

export async function fetchAnnouncements(page = 1, limit = 20) {
  const { data } = await apiClient.get<Paginated<Announcement>>(
    '/api/mobile/v1/announcements',
    { params: { page, limit } },
  )
  return data
}

export async function createAnnouncement(payload: {
  title: string
  description: string
}) {
  const { data } = await apiClient.post<{ data: Announcement }>(
    '/api/mobile/v1/admin/announcements',
    payload,
  )
  return data.data
}

export async function updateAnnouncement(
  id: string,
  payload: { title: string; description: string },
) {
  const { data } = await apiClient.patch<{ data: Announcement }>(
    `/api/mobile/v1/admin/announcements/${id}`,
    payload,
  )
  return data.data
}

export async function deleteAnnouncement(id: string) {
  await apiClient.delete(`/api/mobile/v1/admin/announcements/${id}`)
}

export async function fetchAssignments() {
  const { data } = await apiClient.get<{
    assignments: unknown[]
    isAdmin: boolean
  }>('/api/assignments')
  return data
}

export async function fetchAssignment(id: string) {
  const { data } = await apiClient.get(`/api/assignments/${id}`)
  return data
}

export async function submitMyAssignment(
  id: string,
  payload: { googleDocUrl: string; githubRepoUrl: string },
) {
  const { data } = await apiClient.post(
    `/api/assignments/${id}/my-submission`,
    payload,
  )
  return data
}

export async function recordVideoView(id: string) {
  await apiClient.post(`/api/session-videos/${id}/view`)
}

export async function fetchSessionVideos() {
  const { data } = await apiClient.get<{
    videos: unknown[]
    isAdmin: boolean
  }>('/api/session-videos')
  return data
}

export async function fetchSessionVideo(id: string) {
  const { data } = await apiClient.get<{ video: Record<string, unknown> }>(
    `/api/session-videos/${id}`,
  )
  return data.video
}

export async function createSessionVideo(payload: Record<string, unknown>) {
  const { data } = await apiClient.post('/api/session-videos', payload)
  return data
}

export async function fetchAdminResource(resource: string, page = 1) {
  const { data } = await apiClient.get(`/api/mobile/v1/admin/${resource}`, {
    params: { page, limit: 50 },
  })
  return data
}

export async function createAdminResource(
  resource: string,
  payload: Record<string, unknown>,
) {
  const { data } = await apiClient.post(`/api/mobile/v1/admin/${resource}`, payload)
  return data
}

export async function fetchBlogs(page = 1) {
  const { data } = await apiClient.get<
    Paginated<{
      id?: string
      link?: string
      title?: string
      [key: string]: unknown
    }>
  >('/api/mobile/v1/blogs', {
    params: { page, limit: 20 },
  })
  return data
}

export async function fetchGalleryImages(folder: string, maxResults = 50) {
  const { data } = await apiClient.get<{
    images: Array<{
      id: string
      src: string
      title: string
      alt: string
      public_id: string
      width: number
      height: number
      folder: string
    }>
    message?: string
  }>('/api/cloudinary/images', {
    params: {
      folder,
      max_results: maxResults,
      transformation: 'f_auto,q_auto,w_900',
    },
  })
  return data
}

export async function registerPushToken(payload: {
  deviceId: string
  platform: 'android' | 'ios'
  pushToken: string
}) {
  const { data } = await apiClient.post('/api/mobile/v1/push/register', payload)
  return data
}
