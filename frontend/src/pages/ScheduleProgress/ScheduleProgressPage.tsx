import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useEndSchedule,
  useScheduleDetail,
  useUpdateTaskStatus,
} from '../../hooks/useSchedules';
import { LoadingScreen } from '../../components/common/LoadingScreen';
import { ErrorState } from '../../components/common/ErrorState';
import { PageHeader } from '../../components/layout/PageHeader';
import { RealTimeClock } from '../../components/common/RealTimeClock';
import { useGeolocation } from '../../hooks/useGeolocation';
import type { Task } from '../../types';

export const ScheduleProgressPage: React.FC = () => {
  const { scheduleId = '' } = useParams<{ scheduleId: string }>();
  const navigate = useNavigate();
  const {
    data: schedule,
    isLoading,
    isError,
    refetch,
  } = useScheduleDetail(scheduleId);
  const updateTaskMutation = useUpdateTaskStatus(scheduleId);
  const endMutation = useEndSchedule(scheduleId);
  const {
    coords,
    error: geoError,
    loading: locating,
    requestPosition,
  } = useGeolocation();

  const [reasonDrafts, setReasonDrafts] = useState<
    Record<string, string | undefined>
  >({});
  const [manualLat, setManualLat] = useState('');
  const [manualLng, setManualLng] = useState('');

  if (isLoading) {
    return <LoadingScreen message="Loading active visit..." />;
  }

  if (isError || !schedule) {
    return <ErrorState onRetry={() => void refetch()} />;
  }

  const sortedTasks = schedule.tasks
    .slice()
    .sort((a, b) => a.sort_order - b.sort_order);

  const handleTaskUpdate = async (
    task: Task,
    status: 'completed' | 'not_completed'
  ) => {
    let reason = reasonDrafts[task.id];
    if (status === 'not_completed') {
      if (!reason) {
        setReasonDrafts((prev) => ({ ...prev, [task.id]: '' }));
        return;
      }
    } else {
      reason = undefined;
    }

    await updateTaskMutation.mutateAsync({
      taskId: task.id,
      payload: { schedule_id: schedule.id, status, reason },
    });
  };

  const handleClockOut = async () => {
    const latitude = coords?.latitude ?? Number(manualLat);
    const longitude = coords?.longitude ?? Number(manualLng);

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      alert('Please allow geolocation or provide coordinates manually.');
      return;
    }

    const updated = await endMutation.mutateAsync({ latitude, longitude });
    navigate(`/schedule/${updated.id}`, { replace: true });
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
          <button
            type="button"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            onClick={() => navigate(-1)}
          >
            <span className="material-symbols-rounded">arrow_back</span>
            <span className="text-lg font-semibold">Clock-Out</span>
          </button>
        </div>

        {/* Timer Display - Current Real Time */}
        <div className="text-center mb-8">
          <RealTimeClock className="mb-2" />
        </div>

        {/* Service Card */}
        <div className="rounded-2xl bg-transparent overflow-hidden mb-6">
          <div className="p-6">
            {/* Service Name and Profile Card */}
            <div
              className="rounded-lg p-6 mb-6 w-full"
              style={{ backgroundColor: '#2DA6FF0A' }}
            >
              {/* Service Name - Centered */}
              <h1 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
                {schedule.service_name}
              </h1>

              {/* Profile and Info - Side by Side */}
              <div className="flex items-center justify-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden">
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                      schedule.client.full_name
                    )}&backgroundColor=b6e3f4`}
                    alt={schedule.client.full_name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {schedule.client.full_name}
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* Tasks Section */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Tasks:</h2>
          <div className="space-y-3">
            {sortedTasks.map((task) => {
              const reasonValue = reasonDrafts[task.id] ?? '';
              return (
                <div key={task.id} className="rounded-lg bg-white p-4">
                  <h3 className="text-base font-semibold text-gray-800 mb-2">
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className="text-sm text-gray-600 mb-4">
                      {task.description}
                    </p>
                  )}

                  {/* Yes/No Buttons with Icons */}
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        task.status === 'completed'
                          ? 'text-gray-900'
                          : 'text-gray-600'
                      }`}
                      style={{
                        backgroundColor:
                          task.status === 'completed'
                            ? '#2DA6FF1F'
                            : 'transparent',
                      }}
                      onClick={() => handleTaskUpdate(task, 'completed')}
                      disabled={updateTaskMutation.isPending}
                    >
                      <span className="text-green-600 text-xl">✓</span>
                      Yes
                    </button>
                    <div className="text-gray-400">|</div>
                    <button
                      type="button"
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        task.status === 'not_completed' ||
                        reasonDrafts[task.id] !== undefined
                          ? 'text-gray-900'
                          : 'text-gray-600'
                      }`}
                      style={{
                        backgroundColor:
                          task.status === 'not_completed' ||
                          reasonDrafts[task.id] !== undefined
                            ? '#2DA6FF1F'
                            : 'transparent',
                      }}
                      onClick={() =>
                        setReasonDrafts((prev) => ({
                          ...prev,
                          [task.id]: prev[task.id] ?? '',
                        }))
                      }
                    >
                      <span className="text-red-600 text-xl">✗</span>
                      No
                    </button>
                  </div>

                  {/* Reason Input */}
                  {reasonDrafts[task.id] !== undefined && (
                    <div className="mt-4 space-y-3">
                      <textarea
                        className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                        placeholder="Add reason..."
                        value={reasonValue}
                        onChange={(event) =>
                          setReasonDrafts((prev) => ({
                            ...prev,
                            [task.id]: event.target.value,
                          }))
                        }
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="px-4 py-2 bg-[#0D5D59] text-white rounded-lg text-sm font-medium hover:opacity-90"
                          disabled={
                            reasonValue.trim().length === 0 ||
                            updateTaskMutation.isPending
                          }
                          onClick={() =>
                            handleTaskUpdate(task, 'not_completed')
                          }
                        >
                          Save reason
                        </button>
                        <button
                          type="button"
                          className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200"
                          onClick={() =>
                            setReasonDrafts((prev) => {
                              const copy: Record<string, string | undefined> = {
                                ...prev,
                              };
                              delete copy[task.id];
                              return copy;
                            })
                          }
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Display existing reason */}
                  {task.not_completed_reason && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-800">
                        <strong>Reason:</strong> {task.not_completed_reason}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Clock-In Location */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Clock-In Location:
          </h2>
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <span className="material-symbols-rounded text-base text-[#0D5D59]">
              location_on
            </span>
            <div>
              <div>Latitude: {coords?.latitude?.toFixed(6) ?? '—'}</div>
              <div>Longitude: {coords?.longitude?.toFixed(6) ?? '—'}</div>
              <button
                type="button"
                className="text-[#0D5D59] hover:underline mt-1"
                onClick={() => requestPosition()}
                disabled={locating}
              >
                {locating ? 'Locating…' : 'Retry'}
              </button>
            </div>
          </div>
          {geoError && (
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <span className="text-sm text-yellow-800">{geoError}</span>
            </div>
          )}
          {!coords && (
            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
              <input
                type="number"
                step="0.000001"
                className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                placeholder="Manual latitude"
                value={manualLat}
                onChange={(event) => setManualLat(event.target.value)}
              />
              <input
                type="number"
                step="0.000001"
                className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                placeholder="Manual longitude"
                value={manualLng}
                onChange={(event) => setManualLng(event.target.value)}
              />
            </div>
          )}
        </div>

        {/* Service Notes */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Service Notes:
          </h2>
          <p className="text-sm text-gray-600">
            Lorem ipsum dolor sit amet consectetur. Praesent adipiscing
            malesuada est vestibulum leo tempus sociis. Sodales libero mauris eu
            donec tempor in sagittis urna turpis. Vitae et vestibulum convallis
            volutpat commodo blandit in fusce viverra. Semper magna amet ipsum
            massa turpis non tortor. Etiam diam neque tristique nulla. Ipsum
            duis praesent sed a mattis morbi morbi aliquam. Enim quam amet cras
            nibh. Amet quis malesuada ac in ultrices. Viverra sagittis aenean
            vulputate at orci aliquam enim.
          </p>
        </div>

        {/* Bottom Buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            className="flex-1 px-4 py-3 border border-red-500 text-red-500 rounded-lg font-medium hover:bg-red-50 transition-colors"
            onClick={() => navigate(-1)}
          >
            Cancel Clock-In
          </button>
          <button
            type="button"
            className="flex-1 px-4 py-3 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#0D5D59' }}
            onClick={handleClockOut}
            disabled={endMutation.isPending}
          >
            {endMutation.isPending ? 'Submitting…' : 'Clock-Out'}
          </button>
        </div>
      </div>
    </div>
  );
};
