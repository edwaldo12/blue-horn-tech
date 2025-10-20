import { memo } from 'react';

interface ScheduleLocationDisplayProps {
  address?: string;
  locationName: string;
}

export const ScheduleLocationDisplay: React.FC<ScheduleLocationDisplayProps> =
  memo(({ address, locationName }) => {
    const displayText = address || locationName;

    return (
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
        <span className="material-symbols-rounded text-base text-[#0D5D59]">
          location_on
        </span>
        <span>{displayText}</span>
      </div>
    );
  });

ScheduleLocationDisplay.displayName = 'ScheduleLocationDisplay';
