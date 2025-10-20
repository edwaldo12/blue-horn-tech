import React from 'react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useReverseGeocode } from '@/hooks/useReverseGeocode';
import { useClockIn, useClockOut } from '@/hooks/useAttendance';
import { RealTimeClock } from '@/components/common/RealTimeClock';

interface ActiveVisitCardProps {
  caregiverName: string;
  serviceName: string;
  clientName: string;
  isClockIn: boolean;
  onClockAction?: () => void;
}

export const ActiveVisitCard: React.FC<ActiveVisitCardProps> = React.memo(
  ({ serviceName, clientName, isClockIn, onClockAction }) => {
    const { coords } = useGeolocation();
    const { address } = useReverseGeocode(coords?.latitude, coords?.longitude);
    const clockInMutation = useClockIn();
    const clockOutMutation = useClockOut();

    const handleClockAction = async () => {
      const latitude = coords?.latitude ?? 0;
      const longitude = coords?.longitude ?? 0;

      try {
        if (isClockIn) {
          await clockInMutation.mutateAsync({ latitude, longitude });
        } else {
          await clockOutMutation.mutateAsync({ latitude, longitude });
        }
        onClockAction?.();
      } catch (error) {
        console.error(`${isClockIn ? 'Clock-in' : 'Clock-out'} failed:`, error);
      }
    };

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
                  clientName
                )}&backgroundColor=b6e3f4`}
                alt={clientName}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-semibold text-white">{clientName}</h3>
              {/* Desktop: Show service name */}
              <p className="text-white/80 text-sm hidden md:block">
                {serviceName}
              </p>
            </div>
          </div>

          {/* Location Information */}
          {address && (
            <div className="mb-3">
              <div className="flex items-start gap-2 text-white/80 text-sm">
                <span className="material-symbols-rounded text-sm !text-white flex-shrink-0 mt-0.5">
                  location_on
                </span>
                <span className="break-words">{address}</span>
              </div>
            </div>
          )}

          {/* Mobile: Current Day and Time */}
          <div className="md:hidden">
            <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
              <span className="material-symbols-rounded text-sm !text-white">
                calendar_today
              </span>
              <span>
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
          </div>

          {/* Desktop: Current Day and Time */}
          <div className="hidden md:flex items-center gap-2 text-white/80 text-sm">
            <span className="material-symbols-rounded text-sm !text-white">
              calendar_today
            </span>
            <span>
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
        </div>

        {/* Full Width Clock-In/Clock-Out Button */}
        <button
          type="button"
          className="w-full rounded-lg bg-white py-3 text-slate-800 font-medium hover:bg-white/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          onClick={handleClockAction}
          disabled={clockInMutation.isPending || clockOutMutation.isPending}
        >
          {/* Clock icon - Both mobile and desktop */}
          <span
            className="material-symbols-rounded"
            style={{ color: isClockIn ? '#02CAD1' : '#0D5D59' }}
          >
            schedule
          </span>
          {isClockIn
            ? clockInMutation.isPending
              ? 'Clocking in...'
              : 'Clock-In'
            : clockOutMutation.isPending
            ? 'Clocking out...'
            : 'Clock-Out'}
        </button>
      </>
    );
  }
);

ActiveVisitCard.displayName = 'ActiveVisitCard';
