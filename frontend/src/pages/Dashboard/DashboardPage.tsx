import { useNavigate } from 'react-router-dom';
import { useSchedules, useTodaySchedules } from '../../hooks/useSchedules';
import { LoadingScreen } from '../../components/common/LoadingScreen';
import { ErrorState } from '../../components/common/ErrorState';
import { StatCard } from '../../components/common/StatCard';
import { ScheduleCard } from '../../components/common/ScheduleCard';
import { EmptyState } from '../../components/common/EmptyState';
import { HeaderDropdown } from '../../components/common/HeaderDropdown';
import { ActiveVisitCard } from '../../components/common/ActiveVisitCard';
import type { ScheduleStatus, ScheduleSummary } from '../../types';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

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
  };

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
            <HeaderDropdown
              userName="Admin A"
              userEmail="admin@healthcare.io"
              onLogout={handleLogout}
            />
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
            <ActiveVisitCard
              schedule={activeVisit}
              onClockOut={() =>
                navigate(`/schedule/${activeVisit.id}/progress`)
              }
            />
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
