import { memo } from 'react';
import clsx from 'clsx';
import type { ScheduleDetail, ScheduleSummary, ScheduleStatus } from '@/types';

interface ActionConfig {
  label: string;
  action: () => void;
  variant?: 'primary' | 'outline';
}

interface ScheduleActionButtonsProps {
  schedule: ScheduleSummary | ScheduleDetail;
  primaryAction?: ActionConfig;
  secondaryAction?: ActionConfig;
}

const getButtonStyle = (isPrimary = false, status?: ScheduleStatus) => {
  if (isPrimary) {
    // For completed schedules, use outline style for "View Report"
    if (status === 'completed') {
      return 'bg-transparent border hover:bg-gray-50 text-[#0D5D59]';
    }
    return 'bg-[#0D5D59] hover:bg-[#0D5D59]/90 text-white';
  }
  return 'bg-white hover:bg-gray-50 text-[#0D5D59]';
};

const getSecondaryButtonStyle = () => {
  return 'bg-transparent border hover:bg-gray-50 text-[#0D5D59]';
};

const shouldShowSecondaryButton = (status: ScheduleStatus): boolean => {
  return status === 'in_progress';
};

const getPrimaryButtonLayout = (
  status: ScheduleStatus,
  hasSecondary: boolean
): string => {
  if (status === 'scheduled' || status === 'completed') {
    return 'w-full px-4 py-2 rounded-lg font-medium text-sm transition-colors';
  }
  return hasSecondary
    ? 'flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-colors'
    : 'w-full px-4 py-2 rounded-lg font-medium text-sm transition-colors';
};

export const ScheduleActionButtons: React.FC<ScheduleActionButtonsProps> = memo(
  ({ schedule, primaryAction, secondaryAction }) => {
    const showSecondaryButton = shouldShowSecondaryButton(schedule.status);
    const hasActions = primaryAction || secondaryAction;

    if (!hasActions) {
      return null;
    }

    return (
      <div className="flex gap-3">
        {secondaryAction && showSecondaryButton && (
          <button
            type="button"
            onClick={secondaryAction.action}
            className={clsx(
              'flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-colors',
              getSecondaryButtonStyle()
            )}
            style={{ borderColor: '#2DA6FF80' }}
          >
            {secondaryAction.label}
          </button>
        )}
        {primaryAction && (
          <button
            type="button"
            onClick={primaryAction.action}
            className={clsx(
              getPrimaryButtonLayout(
                schedule.status,
                showSecondaryButton && !!secondaryAction
              ),
              getButtonStyle(true, schedule.status)
            )}
            style={
              schedule.status === 'completed'
                ? { borderColor: '#2DA6FF80' }
                : {}
            }
          >
            {primaryAction.label}
          </button>
        )}
      </div>
    );
  }
);

ScheduleActionButtons.displayName = 'ScheduleActionButtons';
