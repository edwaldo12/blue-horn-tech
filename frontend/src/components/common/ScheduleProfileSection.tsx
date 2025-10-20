import { memo } from 'react';

interface ScheduleProfileSectionProps {
  clientName: string;
  serviceName: string;
}

export const ScheduleProfileSection: React.FC<ScheduleProfileSectionProps> =
  memo(({ clientName, serviceName }) => {
    return (
      <div className="flex items-start gap-4 mb-4">
        <div className="flex-shrink-0">
          <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden">
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                clientName
              )}&backgroundColor=b6e3f4`}
              alt={clientName}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {clientName}
          </h3>
          <p className="text-sm text-gray-600 mb-3">{serviceName}</p>
        </div>
      </div>
    );
  });

ScheduleProfileSection.displayName = 'ScheduleProfileSection';
