import { memo } from 'react';
import dayjs from 'dayjs';
import type { ScheduleDetail, ScheduleSummary } from '@/types';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ScheduleProfileSection } from './ScheduleProfileSection';
import { ScheduleLocationDisplay } from './ScheduleLocationDisplay';
import { ScheduleTimingDisplay } from './ScheduleTimingDisplay';
import { ScheduleActionButtons } from './ScheduleActionButtons';

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

export const ScheduleCard: React.FC<ScheduleCardProps> = memo(
  ({ schedule, onPrimaryAction, onSecondaryAction }) => {
    const start = dayjs(schedule.start_time);
    const end = dayjs(schedule.end_time);

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

          <ScheduleProfileSection
            clientName={schedule.client_name}
            serviceName={schedule.service_name}
          />

          <ScheduleLocationDisplay
            address={(schedule as ScheduleDetail).client?.address}
            locationName={schedule.location_name}
          />

          <ScheduleTimingDisplay startTime={start} endTime={end} />

          <ScheduleActionButtons
            schedule={schedule}
            primaryAction={onPrimaryAction}
            secondaryAction={onSecondaryAction}
          />
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison: only re-render if schedule ID or status changes
    // Ignore action function reference changes
    return (
      prevProps.schedule.id === nextProps.schedule.id &&
      prevProps.schedule.status === nextProps.schedule.status &&
      prevProps.schedule.start_time === nextProps.schedule.start_time &&
      prevProps.schedule.end_time === nextProps.schedule.end_time &&
      prevProps.schedule.client_name === nextProps.schedule.client_name &&
      prevProps.schedule.service_name === nextProps.schedule.service_name &&
      prevProps.schedule.location_name === nextProps.schedule.location_name &&
      prevProps.onPrimaryAction?.label === nextProps.onPrimaryAction?.label &&
      prevProps.onSecondaryAction?.label === nextProps.onSecondaryAction?.label
    );
  }
);

ScheduleCard.displayName = 'ScheduleCard';
