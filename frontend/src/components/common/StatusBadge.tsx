import clsx from 'clsx'
import type { ScheduleStatus } from '../../types'

const statusConfig: Record<
  ScheduleStatus,
  {
    label: string
    className: string
  }
> = {
  scheduled: { label: 'Scheduled', className: 'badge badge-outline border-primary text-primary' },
  in_progress: { label: 'In progress', className: 'badge badge-warning text-white border-transparent' },
  completed: { label: 'Completed', className: 'badge badge-success text-white border-transparent' },
  cancelled: { label: 'Cancelled', className: 'badge badge-error text-white border-transparent' },
  missed: { label: 'Missed', className: 'badge badge-secondary text-white border-transparent' },
}

export const StatusBadge: React.FC<{ status: ScheduleStatus }> = ({ status }) => {
  const config = statusConfig[status]
  return <span className={clsx('badge font-medium uppercase tracking-wide', config.className)}>{config.label}</span>
}
