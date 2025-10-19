import { apiClient } from './client'
import type {
  ScheduleDetail,
  ScheduleSummary,
  TodaySchedulesResponse,
  UpdateTaskPayload,
  VisitEventPayload,
} from '../types'

export async function fetchSchedules(): Promise<ScheduleSummary[]> {
  const { data } = await apiClient.get<{ data: ScheduleSummary[] }>('/schedules')
  return data.data
}

export async function fetchTodaySchedules(): Promise<TodaySchedulesResponse> {
  const { data } = await apiClient.get<TodaySchedulesResponse>('/schedules/today')
  return data
}

export async function fetchScheduleById(id: string): Promise<ScheduleDetail> {
  const { data } = await apiClient.get<{ data: ScheduleDetail }>(`/schedules/${id}`)
  return data.data
}

export async function startSchedule(id: string, payload: VisitEventPayload): Promise<ScheduleDetail> {
  const { data } = await apiClient.post<{ data: ScheduleDetail }>(`/schedules/${id}/start`, payload)
  return data.data
}

export async function endSchedule(id: string, payload: VisitEventPayload): Promise<ScheduleDetail> {
  const { data } = await apiClient.post<{ data: ScheduleDetail }>(`/schedules/${id}/end`, payload)
  return data.data
}

export async function updateTaskStatus(taskId: string, payload: UpdateTaskPayload): Promise<ScheduleDetail> {
  const { data } = await apiClient.patch<{ data: ScheduleDetail }>(`/tasks/${taskId}`, payload)
  return data.data
}

export async function createTask(
  scheduleId: string,
  payload: { title: string; description?: string; sort_order?: number },
): Promise<ScheduleDetail> {
  const { data } = await apiClient.post<{ data: ScheduleDetail }>(`/schedules/${scheduleId}/tasks`, payload)
  return data.data
}
