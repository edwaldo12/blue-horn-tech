import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import dayjs from 'dayjs'
import {
  useCreateTask,
  useEndSchedule,
  useScheduleDetail,
  useUpdateTaskStatus,
} from '../../hooks/useSchedules'
import { LoadingScreen } from '../../components/common/LoadingScreen'
import { ErrorState } from '../../components/common/ErrorState'
import { formatDate, formatDuration, formatTimeRange } from '../../utils/format'
import { useGeolocation } from '../../hooks/useGeolocation'
import type { Task } from '../../types'

export const ScheduleProgressPage: React.FC = () => {
  const { scheduleId = '' } = useParams<{ scheduleId: string }>()
  const navigate = useNavigate()
  const { data: schedule, isLoading, isError, refetch } = useScheduleDetail(scheduleId)
  const updateTaskMutation = useUpdateTaskStatus(scheduleId)
  const createTaskMutation = useCreateTask(scheduleId)
  const endMutation = useEndSchedule(scheduleId)
  const { coords, error: geoError, loading: locating, requestPosition } = useGeolocation()

  const [reasonDrafts, setReasonDrafts] = useState<Record<string, string | undefined>>({})
  const [manualLat, setManualLat] = useState('')
  const [manualLng, setManualLng] = useState('')
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskDescription, setNewTaskDescription] = useState('')

  if (isLoading) {
    return <LoadingScreen message="Loading active visit..." />
  }

  if (isError || !schedule) {
    return <ErrorState onRetry={() => void refetch()} />
  }

  const sortedTasks = schedule.tasks.slice().sort((a, b) => a.sort_order - b.sort_order)
  const elapsedMinutes = schedule.clock_in_at ? dayjs().diff(dayjs(schedule.clock_in_at), 'minute') : null

  const handleTaskUpdate = async (task: Task, status: 'completed' | 'not_completed') => {
    let reason = reasonDrafts[task.id]
    if (status === 'not_completed') {
      if (!reason) {
        setReasonDrafts((prev) => ({ ...prev, [task.id]: '' }))
        return
      }
    } else {
      reason = undefined
    }

    await updateTaskMutation.mutateAsync({
      taskId: task.id,
      payload: { schedule_id: schedule.id, status, reason },
    })
  }

  const handleClockOut = async () => {
    const latitude = coords?.latitude ?? Number(manualLat)
    const longitude = coords?.longitude ?? Number(manualLng)

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      alert('Please allow geolocation or provide coordinates manually.')
      return
    }

    const updated = await endMutation.mutateAsync({ latitude, longitude })
    navigate(`/schedule/${updated.id}`, { replace: true })
  }

  const handleCreateTask = async () => {
    if (!newTaskTitle.trim()) return
    await createTaskMutation.mutateAsync({ title: newTaskTitle.trim(), description: newTaskDescription.trim() || undefined })
    setNewTaskTitle('')
    setNewTaskDescription('')
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-6 md:px-8 md:py-10">
      <button type="button" className="btn btn-ghost w-fit" onClick={() => navigate(-1)}>
        <span className="material-symbols-rounded">arrow_back</span>
        Back
      </button>

      <div className="card-shadow flex flex-col gap-6 p-6">
        <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-wide text-primary">Active visit</p>
            <h1 className="text-2xl font-semibold text-neutral-800">{schedule.service_name}</h1>
            <p className="text-sm text-neutral-500">{schedule.client.full_name}</p>
            <p className="text-sm text-neutral-500">{formatDate(schedule.start_time)}</p>
            <p className="text-sm text-neutral-500">{formatTimeRange(schedule.start_time, schedule.end_time)}</p>
            <p className="text-sm text-neutral-500">Duration: {formatDuration(schedule.duration_mins)}</p>
          </div>
          <div className="rounded-2xl bg-primary/10 px-6 py-4 text-center text-primary">
            <p className="text-xs uppercase tracking-wide">Elapsed time</p>
            <p className="text-2xl font-semibold">
              {elapsedMinutes !== null ? formatDuration(Math.max(elapsedMinutes, 1)) : '—'}
            </p>
          </div>
        </header>

        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-700">Tasks during visit</h2>
            <button type="button" className="btn btn-sm" onClick={() => setReasonDrafts({})}>
              Reset reasons
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {sortedTasks.map((task) => {
              const reasonValue = reasonDrafts[task.id] ?? ''
              return (
                <div key={task.id} className="rounded-2xl border border-base-200 bg-base-100 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-semibold text-neutral-800">{task.title}</h3>
                      {task.description && <p className="text-sm text-neutral-500">{task.description}</p>}
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="btn btn-sm"
                        onClick={() => handleTaskUpdate(task, 'completed')}
                        disabled={updateTaskMutation.isPending}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline"
                        onClick={() =>
                          setReasonDrafts((prev) => ({ ...prev, [task.id]: prev[task.id] ?? '' }))
                        }
                      >
                        No
                      </button>
                    </div>
                  </div>
                  {task.not_completed_reason && (
                    <p className="mt-2 rounded-lg bg-error/10 p-3 text-sm text-error">
                      Reason: {task.not_completed_reason}
                    </p>
                  )}
                  {reasonDrafts[task.id] !== undefined && (
                    <div className="mt-3 space-y-3">
                      <textarea
                        className="textarea textarea-bordered w-full"
                        placeholder="Provide reason"
                        value={reasonValue}
                        onChange={(event) =>
                          setReasonDrafts((prev) => ({ ...prev, [task.id]: event.target.value }))
                        }
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          disabled={reasonValue.trim().length === 0 || updateTaskMutation.isPending}
                          onClick={() => handleTaskUpdate(task, 'not_completed')}
                        >
                          Save reason
                        </button>
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          onClick={() =>
                            setReasonDrafts((prev) => {
                              const copy: Record<string, string | undefined> = { ...prev }
                              delete copy[task.id]
                              return copy
                            })
                          }
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        <section className="rounded-2xl bg-base-200/60 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Add new task</h3>
          <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
            <input
              type="text"
              className="input input-bordered"
              placeholder="Task title"
              value={newTaskTitle}
              onChange={(event) => setNewTaskTitle(event.target.value)}
            />
            <input
              type="text"
              className="input input-bordered"
              placeholder="Optional description"
              value={newTaskDescription}
              onChange={(event) => setNewTaskDescription(event.target.value)}
            />
          </div>
          <button
            type="button"
            className="btn btn-primary btn-sm mt-3"
            onClick={handleCreateTask}
            disabled={createTaskMutation.isPending || !newTaskTitle.trim()}
          >
            Add task
          </button>
        </section>

        <section className="rounded-2xl bg-base-200/50 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Clock-out location</h3>
          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-neutral-600">
            <span>Latitude: {coords?.latitude?.toFixed(6) ?? '—'}</span>
            <span>Longitude: {coords?.longitude?.toFixed(6) ?? '—'}</span>
            <button type="button" className="btn btn-xs" onClick={() => requestPosition()} disabled={locating}>
              {locating ? 'Locating…' : 'Retry'}
            </button>
          </div>
          {geoError && (
            <div className="alert alert-warning mt-3 text-sm">
              <span className="material-symbols-rounded">warning</span>
              <span>{geoError}</span>
            </div>
          )}
          {!coords && (
            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
              <input
                type="number"
                step="0.000001"
                className="input input-bordered"
                placeholder="Manual latitude"
                value={manualLat}
                onChange={(event) => setManualLat(event.target.value)}
              />
              <input
                type="number"
                step="0.000001"
                className="input input-bordered"
                placeholder="Manual longitude"
                value={manualLng}
                onChange={(event) => setManualLng(event.target.value)}
              />
            </div>
          )}
        </section>

        <div className="flex flex-col gap-3 md:flex-row md:justify-end">
          <button type="button" className="btn btn-outline" onClick={() => navigate(-1)}>
            Cancel clock-in
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleClockOut}
            disabled={endMutation.isPending}
          >
            {endMutation.isPending ? 'Submitting…' : 'Clock-out'}
          </button>
        </div>
      </div>
    </div>
  )
}
