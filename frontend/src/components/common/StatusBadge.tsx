import { memo } from 'react';
import type { ScheduleStatus } from '@/types';

const statusConfig: Record<ScheduleStatus, string> = {
  scheduled: 'Scheduled',
  in_progress: 'In progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
  missed: 'Missed',
};

export const StatusBadge: React.FC<{ status: ScheduleStatus }> = memo(
  ({ status }) => {
    const getStatusStyle = (status: ScheduleStatus) => {
      switch (status) {
        case 'cancelled':
          return { backgroundColor: '#D32F2F', color: 'white' };
        case 'completed':
          return { backgroundColor: '#2E7D32', color: 'white' };
        case 'in_progress':
          return { backgroundColor: '#ED6C02', color: 'white' };
        case 'scheduled':
          return { backgroundColor: '#616161', color: 'white' };
        case 'missed':
          return { backgroundColor: '#757575', color: 'white' };
        default:
          return { backgroundColor: '#9E9E9E', color: 'white' };
      }
    };

    const style = getStatusStyle(status);

    return (
      <span
        className="badge font-medium px-3 py-1 rounded-full text-xs"
        style={style}
      >
        {statusConfig[status]}
      </span>
    );
  }
);

StatusBadge.displayName = 'StatusBadge';
