import { memo } from 'react';
import dayjs from 'dayjs';

interface ScheduleTimingDisplayProps {
  startTime: dayjs.Dayjs;
  endTime: dayjs.Dayjs;
}

export const ScheduleTimingDisplay: React.FC<ScheduleTimingDisplayProps> = memo(
  ({ startTime, endTime }) => {
    return (
      <div
        className="rounded-lg p-2 mb-4 w-full"
        style={{ backgroundColor: '#2DA6FF14' }}
      >
        <div className="grid grid-cols-3 items-center justify-items-center text-sm text-gray-600">
          {/* Left Section - Date */}
          <div className="flex items-center gap-1">
            <span
              className="material-symbols-rounded text-base"
              style={{ color: '#02CAD1' }}
            >
              calendar_month
            </span>
            <span>{startTime.format('ddd, DD MMM YYYY')}</span>
          </div>

          {/* Center Section - Line Separator */}
          <div className="text-gray-400">|</div>

          {/* Right Section - Time */}
          <div className="flex items-center gap-1">
            <span
              className="material-symbols-rounded text-base"
              style={{ color: '#02CAD1' }}
            >
              schedule
            </span>
            <span>{`${startTime.format('HH:mm')} - ${endTime.format(
              'HH:mm'
            )}`}</span>
          </div>
        </div>
      </div>
    );
  }
);

ScheduleTimingDisplay.displayName = 'ScheduleTimingDisplay';
