import React from 'react';
import type { ScheduleSummary } from '../../types';
import { RealTimeClock } from './RealTimeClock';

interface ActiveVisitCardProps {
  schedule: ScheduleSummary;
  onClockOut: () => void;
}

export const ActiveVisitCard: React.FC<ActiveVisitCardProps> = React.memo(
  ({ schedule, onClockOut }) => {
    return (
      <>
        {/* Timer Display - Top Center */}
        <div className="text-center mb-6">
          <RealTimeClock className="mb-2 text-white" />
        </div>

        {/* Left side - Profile, Name, and Address */}
        <div className="mb-6">
          {/* Profile and Name */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-white/20 overflow-hidden">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                  schedule.client_name
                )}&backgroundColor=b6e3f4`}
                alt={schedule.client_name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-semibold text-white">
                {schedule.client_name}
              </h3>
              <p className="text-white/80 text-sm">{schedule.service_name}</p>
            </div>
          </div>

          {/* Address and Time - Same Line */}
          <div className="flex items-center gap-2 text-white/80 text-sm">
            <span className="material-symbols-rounded text-sm !text-white">
              location_on
            </span>
            <span>117-101 Iowa St, Minnesota City, MN 55959, USA</span>
            <span className="mx-2 !text-white">|</span>
            <span className="material-symbols-rounded text-sm !text-white">
              schedule
            </span>
            <span>10:30 - 12:30 SGT</span>
          </div>
        </div>

        {/* Full Width Clock-Out Button */}
        <button
          type="button"
          className="w-full rounded-lg bg-white py-3 text-slate-800 font-medium hover:bg-white/90 transition-colors"
          onClick={onClockOut}
        >
          Clock-Out
        </button>
      </>
    );
  }
);
