import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { ScheduleDetail } from '@/types';
import { formatTime, formatDate } from '@/utils/format';

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

  // CSS Animation for checkmark success effect
  const checkmarkAnimationStyles = `
    @keyframes checkmark-success {
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

    @keyframes checkmark-draw {
      0% {
        stroke-dashoffset: 100;
      }
      100% {
        stroke-dashoffset: 0;
      }
    }

    @keyframes checkmark-pulse {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.1);
      }
    }

    @keyframes confetti-float {
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

    @keyframes confetti-bounce {
      0%, 100% {
        transform: translateY(0px) scale(1);
      }
      50% {
        transform: translateY(-8px) scale(1.2);
      }
    }

    @keyframes confetti-spin {
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

    .animate-checkmark-success {
      animation: checkmark-success 0.6s ease-out forwards;
    }

    .animate-checkmark-continuous {
      animation: checkmark-draw 2s ease-in-out infinite;
    }

    .checkmark-svg {
      stroke-dasharray: 100;
      stroke-dashoffset: 100;
    }

    .animate-confetti-1 {
      animation: confetti-float 3s ease-in-out infinite;
    }

    .animate-confetti-2 {
      animation: confetti-bounce 2.5s ease-in-out infinite;
    }

    .animate-confetti-3 {
      animation: confetti-spin 4s linear infinite;
    }

    .animate-confetti-4 {
      animation: confetti-float 3.5s ease-in-out infinite reverse;
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
      <style dangerouslySetInnerHTML={{ __html: checkmarkAnimationStyles }} />
      <div
        className="fixed inset-0 z-50 md:hidden flex flex-col"
        style={{ backgroundColor: '#0e5d59' }}
      >
        {/* Close Button - Top Right */}
        <button
          type="button"
          className="absolute right-4 top-4 text-white hover:text-gray-200 z-10"
          onClick={onClose}
        >
          <span className="material-symbols-rounded text-2xl">close</span>
        </button>

        {/* Main Content - Centered */}
        <div className="flex flex-col items-center justify-center flex-1 px-6 py-8">
          {/* Success Icon with Confetti */}
          <div className="mb-8 flex justify-center">
            <div
              className="relative flex h-24 w-24 items-center justify-center rounded-full"
              style={{ backgroundColor: '#FF8046' }}
            >
              <svg
                className="w-12 h-12 text-white animate-checkmark-success animate-checkmark-continuous checkmark-svg"
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
              <div className="absolute -right-2 -top-2 h-4 w-4 rounded-full bg-pink-300 animate-confetti-1"></div>
              <div className="absolute -left-2 -bottom-2 h-3 w-3 rounded-full bg-blue-300 animate-confetti-2"></div>
              <div className="absolute right-0 top-1/2 h-2 w-2 rounded-full bg-yellow-300 animate-confetti-3"></div>
              <div className="absolute -left-1 top-0 h-2 w-2 rounded-full bg-white animate-confetti-4"></div>
              <div className="absolute -right-1 -bottom-1 h-2 w-2 rounded-full bg-orange-200 animate-confetti-1"></div>
            </div>
          </div>

          {/* Title */}
          <h2 className="mb-8 text-center text-2xl font-bold text-white">
            Schedule Completed
          </h2>

          {/* Schedule Details Card */}
          <div
            className="mb-8 w-full max-w-sm rounded-lg p-4"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <div className="space-y-3">
              {/* Date */}
              <div className="flex items-center gap-3 text-white">
                <span className="material-symbols-rounded text-white">
                  calendar_today
                </span>
                <span className="text-base">
                  {formatDate(new Date(schedule.start_time))}
                </span>
              </div>

              {/* Time */}
              <div className="flex items-center gap-3 text-white">
                <span className="material-symbols-rounded text-white">
                  schedule
                </span>
                <span className="text-base">
                  {formatTime(new Date(schedule.start_time))} -{' '}
                  {formatTime(new Date(schedule.end_time))} SGT
                </span>
              </div>

              {/* Duration - Separate Line */}
              <div className="text-white/70 text-sm ml-8">
                ({duration} hour{duration !== 1 ? 's' : ''})
              </div>
            </div>
          </div>
        </div>

        {/* Go to Home Button - Bottom */}
        <div className="px-6 pb-8">
          <button
            type="button"
            className="w-full max-w-sm mx-auto rounded-lg border border-white bg-transparent py-3 text-base font-medium text-white transition-colors hover:bg-white/10"
            onClick={handleGoHome}
          >
            Go to Home
          </button>
        </div>
      </div>
    </>
  );
};
