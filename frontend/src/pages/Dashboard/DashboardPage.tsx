import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSchedules, useTodaySchedules } from '../../hooks/useSchedules';
import { LoadingScreen } from '../../components/common/LoadingScreen';
import { ErrorState } from '../../components/common/ErrorState';
import { StatCard } from '../../components/common/StatCard';
import { ScheduleCard } from '../../components/common/ScheduleCard';
import { EmptyState } from '../../components/common/EmptyState';
import type { ScheduleStatus, ScheduleSummary } from '../../types';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    data: todayData,
    isLoading: loadingToday,
    isError: errorToday,
    refetch: refetchToday,
  } = useTodaySchedules();
  const {
    data: schedules,
    isLoading: loadingAll,
    isError: errorAll,
    refetch: refetchAll,
  } = useSchedules();

  const handleLogout = () => {
    // Add logout logic here
    console.log('Logging out...');
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (loadingToday || loadingAll) {
    return <LoadingScreen message="Loading your schedules..." />;
  }

  if (errorToday || errorAll || !todayData || !schedules) {
    return (
      <ErrorState
        onRetry={() => void Promise.all([refetchToday(), refetchAll()])}
      />
    );
  }

  // Handle the response as ScheduleSummary array
  const todaySchedules = todayData || [];
  const metrics = {
    missed: 0,
    upcoming: 0,
    completed: 0,
    total: todaySchedules.length,
    in_progress: 0,
    cancelled: 0,
  };

  const activeVisit = schedules.find((item) => item.status === 'in_progress');

  const priority: Record<ScheduleStatus, number> = {
    in_progress: 0,
    scheduled: 1,
    missed: 2,
    completed: 3,
    cancelled: 4,
  };

  const orderedSchedules = todaySchedules
    .slice()
    .sort((a, b) => priority[a.status] - priority[b.status]);

  const renderScheduleActions = (schedule: ScheduleSummary) => {
    if (schedule.status === 'scheduled' || schedule.status === 'missed') {
      return {
        primary: {
          label: 'Clock-in now',
          action: () => navigate(`/schedule/${schedule.id}`),
        },
      };
    }

    if (schedule.status === 'in_progress') {
      return {
        primary: {
          label: 'Clock-out now',
          action: () => navigate(`/schedule/${schedule.id}/progress`),
        },
        secondary: {
          label: 'View progress',
          action: () => navigate(`/schedule/${schedule.id}/progress`),
          variant: 'outline' as const,
        },
      };
    }

    if (schedule.status === 'completed') {
      return {
        primary: {
          label: 'View report',
          action: () => navigate(`/schedule/${schedule.id}`),
        },
      };
    }

    return {
      primary: {
        label: 'View details',
        action: () => navigate(`/schedule/${schedule.id}`),
      },
    };
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="mx-auto max-w-6xl px-4 py-6 md:px-8">
        <header
          className="mb-6 rounded-2xl px-6 py-4"
          style={{ backgroundColor: '#D2EEFF' }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                <span
                  className="text-xl font-bold"
                  style={{ color: '#1D1D1BDE' }}
                >
                  C
                </span>
              </div>
              <div>
                <p
                  className="text-xs font-medium uppercase tracking-[0.2em]"
                  style={{ color: '#1D1D1BDE' }}
                >
                  Careviah
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p
                  className="text-sm font-semibold"
                  style={{ color: '#1D1D1BDE' }}
                >
                  Admin A
                </p>
                <p className="text-xs" style={{ color: '#1D1D1BDE' }}>
                  admin@healthcare.io
                </p>
              </div>
              <div className="avatar">
                <div className="w-10 rounded-full bg-white">
                  <img
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin%20A&backgroundColor=b6e3f4"
                    alt="Admin A"
                  />
                </div>
              </div>
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="dropdown-button material-symbols-rounded text-xl hover:bg-white/20 rounded-full p-1 transition-colors cursor-pointer"
                  style={{ color: '#1D1D1BDE' }}
                >
                  expand_more
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                    <button
                      onClick={handleLogout}
                      className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors"
                      style={{ color: '#1D1D1B' }}
                    >
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        </div>

        {activeVisit && (
          <div
            className="mb-8 rounded-2xl p-6 text-white shadow-lg"
            style={{ backgroundColor: '#0D5D59' }}
          >
            {/* Timer Display - Top Center */}
            <div className="text-center mb-6">
              <div className="text-4xl font-bold mb-2">01 : 35 : 40</div>
            </div>

            {/* Left side - Profile, Name, and Address */}
            <div className="mb-6">
              {/* Profile and Name */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-white/20 overflow-hidden">
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                      activeVisit.client_name
                    )}&backgroundColor=b6e3f4`}
                    alt={activeVisit.client_name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-white">
                    {activeVisit.client_name}
                  </h3>
                  <p className="text-white/80 text-sm">
                    {activeVisit.service_name}
                  </p>
                </div>
              </div>

              {/* Address and Time - Same Line */}
              <div className="flex items-center gap-2 text-white/80 text-sm">
                <span className="material-symbols-rounded text-sm">
                  location_on
                </span>
                <span>117-101 Iowa St, Minnesota City, MN 55959, USA</span>
                <span className="mx-2">|</span>
                <span>10:30 - 12:30 SGT</span>
              </div>
            </div>

            {/* Full Width Clock-Out Button */}
            <button
              type="button"
              className="w-full rounded-lg bg-white py-3 text-slate-800 font-medium hover:bg-white/90 transition-colors"
              onClick={() => navigate(`/schedule/${activeVisit.id}/progress`)}
            >
              Clock-Out
            </button>
          </div>
        )}

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <StatCard
            label="Missed Scheduled"
            value={metrics.missed}
            tone="missed"
          />
          <StatCard
            label="Upcoming Today's Schedule"
            value={metrics.upcoming}
            tone="upcoming"
          />
          <StatCard
            label="Today's Completed Schedule"
            value={metrics.completed}
            tone="completed"
          />
        </div>

        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-semibold text-gray-900">Schedule</h3>
              <span
                className="inline-flex items-center justify-center w-8 h-8 rounded-full text-white text-sm font-semibold"
                style={{ backgroundColor: '#02CAD1' }}
              >
                {orderedSchedules.length}
              </span>
            </div>
            <button
              type="button"
              className="text-sm font-medium text-[#0D9488] hover:text-[#0D9488]/80"
            >
              See All
            </button>
          </div>
          {orderedSchedules.length === 0 ? (
            <EmptyState
              title="No visits scheduled for today"
              description="You're all caught up! Check back later for new assignments."
            />
          ) : (
            <div className="flex flex-col gap-4">
              {orderedSchedules.map((schedule) => {
                const actions = renderScheduleActions(schedule);
                return (
                  <ScheduleCard
                    key={schedule.id}
                    schedule={schedule}
                    onPrimaryAction={actions.primary}
                    onSecondaryAction={actions.secondary}
                  />
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
