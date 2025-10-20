import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { ScheduleDetail } from '../../types';
import { formatTime, formatDate } from '../../utils/format';

interface ScheduleCompletedModalProps {
  schedule: ScheduleDetail;
  isOpen: boolean;
  onClose: () => void;
}

export const ScheduleCompletedModal: React.FC<ScheduleCompletedModalProps> = ({
  schedule,
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleGoHome = () => {
    onClose();
    navigate('/', { replace: true });
  };

  const duration = Math.round(
    (new Date(schedule.end_time).getTime() -
      new Date(schedule.start_time).getTime()) /
      (1000 * 60 * 60)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative mx-4 w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        {/* Close Button */}
        <button
          type="button"
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          <span className="text-2xl">×</span>
        </button>

        {/* Success Icon */}
        <div className="mb-6 flex justify-center">
          <div
            className="relative flex h-24 w-24 items-center justify-center rounded-full"
            style={{ backgroundColor: '#FF8046' }}
          >
            <svg
              className="h-12 w-12 text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
            {/* Decorative circles */}
            <div className="absolute -left-2 -top-2 h-3 w-3 rounded-full bg-orange-300 opacity-60" />
            <div className="absolute -right-1 top-2 h-2 w-2 rounded-full bg-orange-200 opacity-40" />
            <div className="absolute -bottom-1 left-4 h-2.5 w-2.5 rounded-full bg-orange-300 opacity-50" />
            <div className="absolute -right-2 -bottom-2 h-3 w-3 rounded-full bg-orange-200 opacity-60" />
          </div>
        </div>

        {/* Title */}
        <h2 className="mb-6 text-center text-2xl font-semibold text-gray-900">
          Schedule Completed
        </h2>

        {/* Date and Time Info */}
        <div className="mb-8 space-y-3">
          <div className="flex items-center justify-center gap-3 text-gray-700">
            <span className="material-symbols-rounded text-xl">
              calendar_today
            </span>
            <span className="text-base">
              {formatDate(new Date(schedule.start_time))}
            </span>
          </div>
          <div className="flex items-center justify-center gap-3 text-gray-700">
            <span className="material-symbols-rounded text-xl">schedule</span>
            <span className="text-base">
              {formatTime(new Date(schedule.start_time))} -{' '}
              {formatTime(new Date(schedule.end_time))} SGT
              <span className="ml-1 text-gray-500">
                ({duration} hour{duration !== 1 ? 's' : ''})
              </span>
            </span>
          </div>
        </div>

        {/* Go to Home Button */}
        <button
          type="button"
          className="w-full rounded-lg border-2 border-gray-900 bg-white py-3 text-base font-medium text-gray-900 transition-colors hover:bg-gray-50"
          onClick={handleGoHome}
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};
