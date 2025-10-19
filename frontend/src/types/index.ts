export type ScheduleStatus =
  | 'scheduled'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'missed'

export type TaskStatus = 'pending' | 'completed' | 'not_completed'

export interface ClientContact {
  id: string
  full_name: string
  email?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  postal?: string
  latitude?: number
  longitude?: number
}

export interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatus
  not_completed_reason?: string | null
  sort_order: number
  updated_at: string
}

export interface ScheduleSummary {
  id: string
  client_name: string
  service_name: string
  start_time: string
  end_time: string
  status: ScheduleStatus
  location_name: string
}

export interface ScheduleDetail extends ScheduleSummary {
  caregiver_id: string
  client: ClientContact
  clock_in_at?: string | null
  clock_in_lat?: number | null
  clock_in_long?: number | null
  clock_out_at?: string | null
  clock_out_lat?: number | null
  clock_out_long?: number | null
  notes?: string | null
  tasks: Task[]
  duration_mins: number
}

export interface ScheduleMetrics {
  total: number
  missed: number
  upcoming: number
  completed: number
  in_progress: number
  cancelled: number
}

export interface TodaySchedulesResponse {
  data: ScheduleSummary[]
  metrics: ScheduleMetrics
}

export interface TokenResponse {
  access_token: string
  token_type: string
  expires_in: number
  scope: string
  id_token?: string
  caregiver: {
    id: string
    name: string
    email: string
  }
}

export interface VisitEventPayload {
  latitude: number
  longitude: number
  notes?: string
}

export interface UpdateTaskPayload {
  schedule_id: string
  status: TaskStatus
  reason?: string
}
