import dayjs from 'dayjs';
import type { ScheduleDetail, ScheduleSummary } from '../../types';
import { StatusBadge } from './StatusBadge';
import clsx from 'clsx';

interface ActionConfig {
  label: string;
  action: () => void;
  variant?: 'primary' | 'outline';
}

interface ScheduleCardProps {
  schedule: ScheduleSummary | ScheduleDetail;
  onPrimaryAction?: ActionConfig;
  onSecondaryAction?: ActionConfig;
}

export const ScheduleCard: React.FC<ScheduleCardProps> = ({
  schedule,
  onPrimaryAction,
  onSecondaryAction,
}) => {
  const start = dayjs(schedule.start_time);
  const end = dayjs(schedule.end_time);

  const getButtonStyle = (isPrimary = false) => {
    if (isPrimary) {
      return 'bg-[#0D5D59] hover:bg-[#0D5D59]/90 text-white';
    }
    return 'bg-white hover:bg-gray-50 text-[#0D5D59]';
  };

  const getSecondaryButtonStyle = () => {
    return 'bg-white border hover:bg-gray-50 text-[#0D5D59]';
  };

  return (
    <div className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6">
        {/* Status and Menu */}
        <div className="flex items-start justify-between mb-4">
          <StatusBadge status={schedule.status} />
          <button type="button" className="text-gray-400 hover:text-gray-600">
            <span className="material-symbols-rounded text-2xl">
              more_horiz
            </span>
          </button>
        </div>

        {/* Profile and Info */}
        <div className="flex items-start gap-4 mb-4">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                  schedule.client_name
                )}&backgroundColor=b6e3f4`}
                alt={schedule.client_name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {schedule.client_name}
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              {schedule.service_name}
            </p>
          </div>
        </div>

        {/* Address - Below profile image */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <span className="material-symbols-rounded text-base text-[#0D5D59]">
            location_on
          </span>
          <span>
            {(schedule as ScheduleDetail).client?.address ??
              schedule.location_name}
          </span>
        </div>

        {/* Date and Time - Full Width Background */}
        <div
          className="rounded-lg p-2 mb-4 w-full"
          style={{ backgroundColor: '#2DA6FF14' }}
        >
          <div className="grid grid-cols-3 items-center justify-items-center text-sm text-gray-600">
            {/* Left Section - Date */}
            <div className="flex items-center gap-1">
              <span className="material-symbols-rounded text-base text-[#0D5D59]">
                calendar_month
              </span>
              <span>{start.format('ddd, DD MMM YYYY')}</span>
            </div>

            {/* Center Section - Line Separator */}
            <div className="text-gray-400">|</div>

            {/* Right Section - Time */}
            <div className="flex items-center gap-1">
              <span className="material-symbols-rounded text-base text-[#0D5D59]">
                schedule
              </span>
              <span>{`${start.format('HH:mm')} - ${end.format('HH:mm')}`}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {(onPrimaryAction || onSecondaryAction) && (
          <div className="flex gap-3">
            {onSecondaryAction && schedule.status === 'in_progress' && (
              <button
                type="button"
                onClick={onSecondaryAction.action}
                className={clsx(
                  'flex-1 px-4 py-3 rounded-lg font-medium text-sm transition-colors',
                  getSecondaryButtonStyle()
                )}
                style={{ borderColor: '#2DA6FF80' }}
              >
                {onSecondaryAction.label}
              </button>
            )}
            {onPrimaryAction && (
              <button
                type="button"
                onClick={onPrimaryAction.action}
                className={clsx(
                  schedule.status === 'scheduled' ||
                    schedule.status === 'completed'
                    ? 'w-full px-4 py-3 rounded-lg font-medium text-sm transition-colors'
                    : 'flex-1 px-4 py-3 rounded-lg font-medium text-sm transition-colors',
                  getButtonStyle(true)
                )}
              >
                {onPrimaryAction.label}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
