import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import dayjs from 'dayjs'
import { useScheduleDetail, useStartSchedule } from '../../hooks/useSchedules'
import { LoadingScreen } from '../../components/common/LoadingScreen'
import { ErrorState } from '../../components/common/ErrorState'
import { formatDate, formatTimeRange, formatDuration } from '../../utils/format'
import { StatusBadge } from '../../components/common/StatusBadge'
import { useGeolocation } from '../../hooks/useGeolocation'

export const ScheduleDetailPage: React.FC = () => {
  const { scheduleId = '' } = useParams<{ scheduleId: string }>()
  const navigate = useNavigate()
  const { data: schedule, isLoading, isError, refetch } = useScheduleDetail(scheduleId)
  const startMutation = useStartSchedule(scheduleId)
  const { coords, error: geoError, loading: locating, requestPosition } = useGeolocation()
  const [manualLat, setManualLat] = useState('')
  const [manualLng, setManualLng] = useState('')

  const canClockIn = useMemo(() => schedule?.status === 'scheduled' || schedule?.status === 'missed', [schedule])
  const showProgress = schedule?.status === 'in_progress'
  const isCompleted = schedule?.status === 'completed'

  if (isLoading) {
    return <LoadingScreen message="Preparing schedule details..." />
  }

  if (isError || !schedule) {
    return <ErrorState onRetry={() => void refetch()} />
  }

  const handleClockIn = async () => {
    const latitude = coords?.latitude ?? Number(manualLat)
    const longitude = coords?.longitude ?? Number(manualLng)

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      alert('Please allow geolocation or provide coordinates manually.')
      return
    }

    await startMutation.mutateAsync({ latitude, longitude })
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-6 md:px-8 md:py-10">
      <button type="button" className="btn btn-ghost w-fit" onClick={() => navigate(-1)}>
        <span className="material-symbols-rounded">arrow_back</span>
        Back
      </button>

      <div className="card bg-base-100 shadow-md">
        <div className="card-body flex flex-col gap-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-wide text-primary">Schedule details</p>
            <h1 className="mt-1 text-2xl font-semibold text-neutral-800">{schedule.service_name}</h1>
            <p className="text-sm text-neutral-500">Client: {schedule.client.full_name}</p>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-neutral-600">
              <div className="flex items-center gap-1">
                <span className="material-symbols-rounded text-base text-primary">calendar_month</span>
                {formatDate(schedule.start_time)}
              </div>
              <div className="flex items-center gap-1">
                <span className="material-symbols-rounded text-base text-primary">schedule</span>
                {formatTimeRange(schedule.start_time, schedule.end_time)}
              </div>
              <div className="flex items-center gap-1">
                <span className="material-symbols-rounded text-base text-primary">timer</span>
                {formatDuration(schedule.duration_mins)}
              </div>
            </div>
          </div>
          <StatusBadge status={schedule.status} />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-neutral-700">Client contact</h2>
            <div className="flex items-center gap-2 text-sm text-neutral-600">
              <span className="material-symbols-rounded text-primary">mail</span>
              {schedule.client.email ?? 'N/A'}
            </div>
            <div className="flex items-center gap-2 text-sm text-neutral-600">
              <span className="material-symbols-rounded text-primary">call</span>
              {schedule.client.phone ?? 'N/A'}
            </div>
            <div className="flex items-start gap-2 text-sm text-neutral-600">
              <span className="material-symbols-rounded text-primary">location_on</span>
              <span>
                {schedule.client.address}
                <br />
                {schedule.client.city}, {schedule.client.state} {schedule.client.postal}
              </span>
            </div>
          </div>
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-neutral-700">Visit summary</h2>
            <p className="text-sm text-neutral-600">
              Clock-in time:{' '}
              {schedule.clock_in_at ? dayjs(schedule.clock_in_at).format('HH:mm:ss') : '—'}
            </p>
            <p className="text-sm text-neutral-600">
              Clock-out time:{' '}
              {schedule.clock_out_at ? dayjs(schedule.clock_out_at).format('HH:mm:ss') : '—'}
            </p>
            {schedule.notes && <p className="rounded-xl bg-base-200/60 p-3 text-sm text-neutral-600">{schedule.notes}</p>}
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-lg font-semibold text-neutral-700">Tasks</h2>
          <div className="flex flex-col gap-3">
            {schedule.tasks.map((task) => (
              <div key={task.id} className="rounded-2xl border border-base-200 bg-base-100 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-neutral-800">{task.title}</h3>
                  <span className="text-xs font-medium uppercase tracking-wide text-neutral-400">{task.status}</span>
                </div>
                {task.description && <p className="mt-2 text-sm text-neutral-500">{task.description}</p>}
                {task.not_completed_reason && (
                  <p className="mt-2 rounded-lg bg-error/10 p-3 text-sm text-error">
                    Reason: {task.not_completed_reason}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 rounded-2xl bg-base-200/50 p-4">
          <h3 className="text-sm font-medium uppercase tracking-wide text-neutral-500">Geolocation</h3>
          <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-600">
            <span>Latitude: {coords?.latitude?.toFixed(6) ?? '—'}</span>
            <span>Longitude: {coords?.longitude?.toFixed(6) ?? '—'}</span>
            <button type="button" className="btn btn-xs" onClick={() => requestPosition()} disabled={locating}>
              {locating ? 'Locating…' : 'Retry'}
            </button>
          </div>
          {geoError && (
            <div className="alert alert-warning text-sm">
              <span className="material-symbols-rounded">warning</span>
              <span>{geoError}</span>
            </div>
          )}
          {!coords && (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <label className="form-control w-full">
                <span className="label-text text-xs uppercase tracking-wide text-neutral-500">Manual latitude</span>
                <input
                  type="number"
                  step="0.000001"
                  className="input input-bordered"
                  value={manualLat}
                  onChange={(event) => setManualLat(event.target.value)}
                />
              </label>
              <label className="form-control w-full">
                <span className="label-text text-xs uppercase tracking-wide text-neutral-500">Manual longitude</span>
                <input
                  type="number"
                  step="0.000001"
                  className="input input-bordered"
                  value={manualLng}
                  onChange={(event) => setManualLng(event.target.value)}
                />
              </label>
            </div>
          )}
        </div>

        <div className="card-actions justify-end gap-3">
          {showProgress && (
            <button type="button" className="btn btn-outline btn-primary" onClick={() => navigate(`/schedule/${schedule.id}/progress`)}>
              Go to progress
            </button>
          )}
          {canClockIn && (
            <button type="button" className="btn btn-primary" onClick={handleClockIn} disabled={startMutation.isPending}>
              {startMutation.isPending ? 'Clocking in…' : 'Clock-in now'}
            </button>
          )}
          {isCompleted && (
            <button type="button" className="btn btn-primary" onClick={() => navigate('/')}>Back to dashboard</button>
          )}
        </div>
        </div>
      </div>
    </div>
  )
}
