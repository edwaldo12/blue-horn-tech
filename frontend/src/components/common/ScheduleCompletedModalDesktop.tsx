import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { ScheduleDetail } from '@/types';
import { formatTime, formatDate } from '@/utils/format';

interface ScheduleCompletedModalDesktopProps {
  schedule: ScheduleDetail;
  isOpen: boolean;
  onClose: () => void;
}

export const ScheduleCompletedModalDesktop: React.FC<
  ScheduleCompletedModalDesktopProps
> = ({ schedule, isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  // CSS Animation for desktop modal
  const desktopModalAnimationStyles = `
    @keyframes checkmark-success-desktop {
      0% {
        transform: scale(0);
        opacity: 0;
      }
      50% {
        transform: scale(1.3);
        opacity: 1;
      }
      70% {
        transform: scale(0.9);
      }
      100% {
        transform: scale(1);
      }
    }

    @keyframes checkmark-draw-desktop {
      0% {
        stroke-dashoffset: 100;
      }
      100% {
        stroke-dashoffset: 0;
      }
    }

    @keyframes confetti-float-desktop {
      0%, 100% {
        transform: translateY(0px) rotate(0deg);
      }
      25% {
        transform: translateY(-10px) rotate(90deg);
      }
      50% {
        transform: translateY(-5px) rotate(180deg);
      }
      75% {
        transform: translateY(-15px) rotate(270deg);
      }
    }

    @keyframes confetti-bounce-desktop {
      0%, 100% {
        transform: translateY(0px) scale(1);
      }
      50% {
        transform: translateY(-8px) scale(1.2);
      }
    }

    @keyframes confetti-spin-desktop {
      0% {
        transform: rotate(0deg) scale(1);
      }
      50% {
        transform: rotate(180deg) scale(1.1);
      }
      100% {
        transform: rotate(360deg) scale(1);
      }
    }

    .animate-checkmark-success-desktop {
      animation: checkmark-success-desktop 0.6s ease-out forwards;
    }

    .animate-checkmark-continuous-desktop {
      animation: checkmark-draw-desktop 2s ease-in-out infinite;
    }

    .animate-confetti-1-desktop {
      animation: confetti-float-desktop 3s ease-in-out infinite;
    }

    .animate-confetti-2-desktop {
      animation: confetti-bounce-desktop 2.5s ease-in-out infinite;
    }

    .animate-confetti-3-desktop {
      animation: confetti-spin-desktop 4s linear infinite;
    }

    .animate-confetti-4-desktop {
      animation: confetti-float-desktop 3.5s ease-in-out infinite reverse;
    }

    .checkmark-svg-desktop {
      stroke-dasharray: 100;
      stroke-dashoffset: 100;
    }
  `;

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
    <>
      <style
        dangerouslySetInnerHTML={{ __html: desktopModalAnimationStyles }}
      />
      <div className="fixed inset-0 z-50 items-center justify-center bg-black bg-opacity-50 hidden md:flex">
        <div className="relative mx-4 w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
          {/* Close Button - Top Right */}
          <button
            type="button"
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            onClick={onClose}
          >
            <span className="material-symbols-rounded text-2xl">close</span>
          </button>

          {/* Success Icon with Confetti */}
          <div className="mb-6 flex justify-center pt-4">
            <div
              className="relative flex h-24 w-24 items-center justify-center rounded-full"
              style={{ backgroundColor: '#FF8046' }}
            >
              <svg
                className="w-12 h-12 text-white animate-checkmark-success-desktop animate-checkmark-continuous-desktop checkmark-svg-desktop"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>

              {/* Confetti Elements */}
              <div className="absolute -right-2 -top-2 h-4 w-4 rounded-full bg-pink-300 animate-confetti-1-desktop"></div>
              <div className="absolute -left-2 -bottom-2 h-3 w-3 rounded-full bg-blue-300 animate-confetti-2-desktop"></div>
              <div className="absolute right-0 top-1/2 h-2 w-2 rounded-full bg-yellow-300 animate-confetti-3-desktop"></div>
              <div className="absolute -left-1 top-0 h-2 w-2 rounded-full bg-white animate-confetti-4-desktop"></div>
              <div className="absolute -right-1 -bottom-1 h-2 w-2 rounded-full bg-orange-200 animate-confetti-1-desktop"></div>
            </div>
          </div>

          {/* Title */}
          <h2 className="mb-6 text-center text-2xl font-semibold text-gray-900">
            Schedule Completed
          </h2>

          {/* Date and Time Info - Desktop Layout */}
          <div className="mb-8 space-y-3">
            {/* Date - Separate Line */}
            <div className="flex items-center gap-3 text-gray-700">
              <span className="material-symbols-rounded text-xl">
                calendar_today
              </span>
              <span className="text-base">
                {formatDate(new Date(schedule.start_time))}
              </span>
            </div>

            {/* Time - Separate Line */}
            <div className="flex items-center gap-3 text-gray-700">
              <span className="material-symbols-rounded text-xl">schedule</span>
              <span className="text-base">
                {formatTime(new Date(schedule.start_time))} -{' '}
                {formatTime(new Date(schedule.end_time))} SGT
              </span>
            </div>

            {/* Duration - Under Time */}
            <div className="text-gray-500 text-sm ml-8">
              ({duration} hour{duration !== 1 ? 's' : ''})
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
    </>
  );
};
