import dayjs from 'dayjs';
import type { ScheduleDetail } from '@/types';

interface ScheduleDetailCardProps {
  schedule: ScheduleDetail;
  onClockIn: () => void;
}

export const ScheduleDetailCard: React.FC<ScheduleDetailCardProps> = ({
  schedule,
  onClockIn,
}) => {
  const start = dayjs(schedule.start_time);
  const end = dayjs(schedule.end_time);

  return (
    <div className="rounded-2xl bg-transparent overflow-hidden">
      <div className="p-6">
        {/* Service Name and Profile Card */}
        <div
          className="rounded-lg p-2 mb-2 w-full"
          style={{ backgroundColor: '#2DA6FF0A' }}
        >
          {/* Service Name - Centered */}
          <h1 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            {schedule.service_name}
          </h1>

          {/* Profile and Info - Side by Side */}
          <div className="flex items-center justify-center gap-4 pb-2">
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

          {/* Date and Time - Full Width Background */}
          <div
            className="rounded-lg p-2 w-full"
            style={{ backgroundColor: '#2DA6FF14' }}
          >
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              {/* Date Section */}
              <div className="flex items-center gap-1 mr-2">
                <span className="material-symbols-rounded text-base text-[#0D5D59]">
                  calendar_month
                </span>
                <span>{start.format('ddd, DD MMM YYYY')}</span>
              </div>

              {/* Separator */}
              <span className="text-gray-400">|</span>

              {/* Time Section */}
              <div className="flex items-center gap-1 ml-2">
                <span className="material-symbols-rounded text-base text-[#0D5D59]">
                  schedule
                </span>
                <span>{`${start.format('HH:mm')} - ${end.format(
                  'HH:mm'
                )}`}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Client Contact */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Client Contact:
          </h2>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="material-symbols-rounded text-base text-[#0D5D59]">
                mail
              </span>
              <span>{schedule.client.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="material-symbols-rounded text-base text-[#0D5D59]">
                phone
              </span>
              <span>{schedule.client.phone}</span>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Address:</h2>
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <span className="material-symbols-rounded text-base text-[#0D5D59]">
              location_on
            </span>
            <div>
              <div>{schedule.client.address}</div>
              <div>
                {schedule.client.city}, {schedule.client.state}{' '}
                {schedule.client.postal}
              </div>
            </div>
          </div>
        </div>

        {/* Tasks */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Tasks:</h2>
          <div className="space-y-3">
            {schedule.tasks.map((task) => (
              <div key={task.id} className="rounded-lg bg-white p-4">
                <h3 className="text-base font-semibold text-gray-800 mb-2">
                  {task.title}
                </h3>
                {task.description && (
                  <p className="text-sm text-gray-600">{task.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Service Notes */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Service Notes:
          </h2>
          <p className="text-sm text-gray-600">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris.
          </p>
        </div>

        {/* Clock In Button */}
        <button
          type="button"
          onClick={onClockIn}
          className="w-full rounded-lg py-3 text-white font-medium hover:opacity-90 transition-opacity"
          style={{ backgroundColor: '#0D5D59' }}
        >
          Clock In Now
        </button>
      </div>
    </div>
  );
};
