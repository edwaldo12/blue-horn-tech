import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useScheduleDetail, useStartSchedule } from '@/hooks/useSchedules';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { ErrorState } from '@/components/common/ErrorState';
import { PageHeader } from '@/components/layout/PageHeader';
import { ScheduleDetailCard } from '@/components/common/ScheduleDetailCard';
import { useGeolocation } from '@/hooks/useGeolocation';

export const ScheduleDetailPage: React.FC = () => {
  const { scheduleId = '' } = useParams<{ scheduleId: string }>();
  const navigate = useNavigate();
  const {
    data: schedule,
    isLoading,
    isError,
    refetch,
  } = useScheduleDetail(scheduleId);
  const startMutation = useStartSchedule(scheduleId);
  const { coords } = useGeolocation();
  const [manualLat] = useState('');
  const [manualLng] = useState('');

  if (isLoading) {
    return <LoadingScreen message="Preparing schedule details..." />;
  }

  if (isError || !schedule) {
    return <ErrorState onRetry={() => void refetch()} />;
  }

  const handleClockIn = async () => {
    const latitude = coords?.latitude ?? Number(manualLat);
    const longitude = coords?.longitude ?? Number(manualLng);

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      alert('Please allow geolocation or provide coordinates manually.');
      return;
    }

    await startMutation.mutateAsync({ latitude, longitude });
  };

  const handleLogout = () => {
    // Add logout logic here
    console.log('Logging out...');
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-6 md:px-8">
        <PageHeader
          title="Careviah"
          userName="Admin A"
          userEmail="admin@healthcare.io"
          onLogout={handleLogout}
        />

        <div className="mb-6">
          <div className="flex items-center relative">
            <button
              type="button"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 md:gap-2"
              onClick={() => navigate(-1)}
            >
              <span className="material-symbols-rounded">arrow_back</span>
              <span className="text-lg font-semibold md:block hidden">
                Schedule Details
              </span>
            </button>
            <span className="text-lg font-semibold text-gray-900 md:hidden absolute left-1/2 transform -translate-x-1/2">
              Schedule Details
            </span>
          </div>
        </div>

        <ScheduleDetailCard schedule={schedule} onClockIn={handleClockIn} />
      </div>
    </div>
  );
};
