import { apiClient } from '@/api/client'

export interface AttendanceStatus {
  caregiver_id: string
  date: string
  has_clocked_in: boolean
  has_clocked_out: boolean
  clock_in_at?: string
  clock_in_lat?: number
  clock_in_long?: number
  clock_out_at?: string
  clock_out_lat?: number
  clock_out_long?: number
}

export interface AttendanceLog {
  id: string
  caregiver_id: string
  log_type: 'clock_in' | 'clock_out'
  latitude: number
  longitude: number
  timestamp: string
  notes?: string
  created_at: string
}

export interface AttendanceLogSummary {
  id: string
  caregiver_id: string
  log_type: 'clock_in' | 'clock_out'
  timestamp: string
}

export interface ClockEventPayload {
  latitude: number
  longitude: number
  notes?: string
}

export async function getTodayAttendanceStatus(): Promise<AttendanceStatus> {
  const { data } = await apiClient.get<{ data: AttendanceStatus }>('/attendance/today/status')
  return data.data
}

export async function clockIn(payload: ClockEventPayload): Promise<AttendanceLog> {
  const { data } = await apiClient.post<{ data: AttendanceLog }>('/attendance/clock-in', payload)
  return data.data
}

export async function clockOut(payload: ClockEventPayload): Promise<AttendanceLog> {
  const { data } = await apiClient.post<{ data: AttendanceLog }>('/attendance/clock-out', payload)
  return data.data
}

export async function getAttendanceHistory(params?: {
  log_type?: 'clock_in' | 'clock_out'
  start_date?: string
  end_date?: string
  limit?: number
  offset?: number
}): Promise<AttendanceLogSummary[]> {
  const searchParams = new URLSearchParams()
  
  if (params?.log_type) {
    searchParams.append('log_type', params.log_type)
  }
  if (params?.start_date) {
    searchParams.append('start_date', params.start_date)
  }
  if (params?.end_date) {
    searchParams.append('end_date', params.end_date)
  }
  if (params?.limit) {
    searchParams.append('limit', params.limit.toString())
  }
  if (params?.offset) {
    searchParams.append('offset', params.offset.toString())
  }
  
  const queryString = searchParams.toString()
  const url = `/attendance/history${queryString ? `?${queryString}` : ''}`
  
  const { data } = await apiClient.get<{ data: AttendanceLogSummary[] }>(url)
  return data.data
}