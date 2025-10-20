import { memo } from 'react';

export const ScheduleCardSkeleton: React.FC = memo(() => {
  return (
    <div className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden animate-pulse">
      <div className="p-6">
        {/* Status and Menu */}
        <div className="flex items-start justify-between mb-4">
          <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
          <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
        </div>

        {/* Profile Section */}
        <div className="mb-4">
          <div className="h-6 w-3/4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
        </div>

        {/* Location Section */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
            <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
          </div>
        </div>

        {/* Timing Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
            <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
            <div className="h-4 w-1/4 bg-gray-200 rounded"></div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <div className="h-10 flex-1 bg-gray-200 rounded-lg"></div>
          <div className="h-10 w-28 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
});

ScheduleCardSkeleton.displayName = 'ScheduleCardSkeleton';