import { useCallback, useMemo, memo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useInfiniteSchedules,
  useTodaySchedules,
  useEndSchedule,
} from '@/hooks/useSchedules';
import { useAuth } from '@/hooks/useAuth';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { ErrorState } from '@/components/common/ErrorState';
import { StatCard } from '@/components/common/StatCard';
import { ScheduleCard } from '@/components/common/ScheduleCard';
import { ScheduleCardSkeleton } from '@/components/common/ScheduleCardSkeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { HeaderDropdown } from '@/components/common/HeaderDropdown';
import { ActiveVisitCard } from '@/components/common/ActiveVisitCard';
import type { ScheduleStatus, ScheduleSummary } from '@/types';

// Memoized header component
const DashboardHeader: React.FC = memo(() => {
  const handleLogout = useCallback(() => {
    // Add logout logic here
    console.log('Logging out...');
  }, []);

  return (
    <header
      className="mb-6 hidden rounded-2xl px-6 py-4 md:block"
      style={{ backgroundColor: '#D2EEFF' }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
            <span className="text-xl font-bold" style={{ color: '#1D1D1BDE' }}>
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
  );
});

DashboardHeader.displayName = 'DashboardHeader';

// Memoized stats section
const DashboardStats: React.FC<{
  metrics: {
    missed: number;
    upcoming: number;
    completed: number;
  };
}> = memo(({ metrics }) => {
  return (
    <>
      {/* Mobile layout: 1 full-width card (Missed), then 2 cards side-by-side */}
      <div className="mb-8 md:hidden">
        <div className="mb-4">
          <StatCard
            label="Missed Scheduled"
            value={metrics.missed}
            tone="missed"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
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
      </div>

      {/* Desktop/tablet layout: 3 columns */}
      <div className="mb-8 hidden grid-cols-3 gap-4 md:grid">
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
    </>
  );
});

DashboardStats.displayName = 'DashboardStats';

// Memoized schedule item to prevent unnecessary re-renders
const ScheduleItem: React.FC<{ schedule: ScheduleSummary }> = memo(
  ({ schedule }) => {
    const navigate = useNavigate();

    const actions = useMemo(() => {
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

      // For cancelled schedules, don't show any buttons
      if (schedule.status === 'cancelled') {
        return {};
      }

      return {
        primary: {
          label: 'View details',
          action: () => navigate(`/schedule/${schedule.id}`),
        },
      };
    }, [schedule.id, schedule.status, navigate]);

    return (
      <ScheduleCard
        schedule={schedule}
        onPrimaryAction={actions.primary}
        onSecondaryAction={actions.secondary}
      />
    );
  },
  (prevProps, nextProps) => {
    // Only re-render if the schedule ID or status changes
    return (
      prevProps.schedule.id === nextProps.schedule.id &&
      prevProps.schedule.status === nextProps.schedule.status
    );
  }
);

ScheduleItem.displayName = 'ScheduleItem';

// Memoize the main content to prevent unnecessary re-renders
const DashboardContent: React.FC<{
  todaySchedules: ScheduleSummary[];
  activeVisit: ScheduleSummary | undefined;
  caregiverName: string;
  schedules: ScheduleSummary[];
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
}> = memo(({
  todaySchedules,
  activeVisit,
  caregiverName,
  schedules,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage
}) => {
  const endMutation = useEndSchedule(activeVisit?.id || '');
  const observer = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const metrics = useMemo(
    () => ({
      missed: 0,
      upcoming: 0,
      completed: 0,
      total: todaySchedules.length,
      in_progress: 0,
      cancelled: 0,
    }),
    [todaySchedules]
  );

  const orderedSchedules = useMemo(() => {
    const priority: Record<ScheduleStatus, number> = {
      in_progress: 0,
      scheduled: 1,
      missed: 2,
      completed: 3,
      cancelled: 4,
    };

    return schedules
      .slice()
      .sort((a, b) => priority[a.status] - priority[b.status]);
  }, [schedules]);

  const handleClockOut = useCallback(async () => {
    if (!activeVisit) return;

    try {
      // Use default coordinates for clock-out (0,0 as fallback)
      await endMutation.mutateAsync({
        latitude: 0,
        longitude: 0,
      });
      // Stay on dashboard - the mutation will update the data
    } catch (error) {
      console.error('Clock-out failed:', error);
      alert('Failed to clock out. Please try again.');
    }
  }, [activeVisit, endMutation]);

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="mx-auto max-w-6xl px-4 py-6 md:px-8">
        <DashboardHeader />

        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 md:block hidden">
            Dashboard
          </h1>
          <h1 className="text-2xl font-semibold text-gray-900 md:hidden">
            Welcome, {caregiverName} !
          </h1>
        </div>

        {activeVisit && (
          <div
            className="mb-8 rounded-2xl p-6 text-white shadow-lg"
            style={{ backgroundColor: '#0D5D59' }}
          >
            <ActiveVisitCard
              schedule={activeVisit}
              onClockOut={handleClockOut}
            />
            {endMutation.isPending && (
              <div className="mt-4 text-center text-white/80">
                Clocking out...
              </div>
            )}
          </div>
        )}

        <DashboardStats metrics={metrics} />

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
          </div>
          {orderedSchedules.length === 0 ? (
            <EmptyState
              title="No visits scheduled for today"
              description="You're all caught up! Check back later for new assignments."
            />
          ) : (
            <div className="flex flex-col gap-4">
              {orderedSchedules.map((schedule) => (
                <ScheduleItem key={schedule.id} schedule={schedule} />
              ))}
              {/* Show skeleton cards when fetching next page */}
              {isFetchingNextPage && Array.from({ length: 5 }).map((_, index) => (
                <ScheduleCardSkeleton key={`skeleton-${index}`} />
              ))}
              {/* Load more trigger for infinite scroll */}
              {hasNextPage && !isFetchingNextPage && (
                <div ref={loadMoreRef} className="h-8"></div> // Invisible element to trigger intersection
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
});

DashboardContent.displayName = 'DashboardContent';

export const DashboardPage: React.FC = () => {
  const { caregiver } = useAuth();
  const {
    data: todayData,
    isLoading: loadingToday,
    isError: errorToday,
    refetch: refetchToday,
  } = useTodaySchedules();
  const {
    data: schedulesData,
    isLoading: loadingAll,
    isError: errorAll,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteSchedules();

  // Memoize todaySchedules to prevent unnecessary re-computations
  const todaySchedules = useMemo(() => todayData || [], [todayData]);

  // Flatten all pages of schedules
  const schedules = useMemo(
    () => schedulesData?.pages?.flatMap(page => page?.data || []) || [],
    [schedulesData]
  );

  const activeVisit = useMemo(
    () => schedules.find((item) => item.status === 'in_progress'),
    [schedules]
  );

  const handleRetry = useCallback(() => {
    void refetchToday();
  }, [refetchToday]);

  if (loadingToday || loadingAll) {
    return <LoadingScreen message="Loading your schedules..." />;
  }

  if (errorToday || errorAll) {
    return <ErrorState onRetry={handleRetry} />;
  }

  return (
    <DashboardContent
      todaySchedules={todaySchedules}
      activeVisit={activeVisit}
      caregiverName={caregiver?.name || 'Guest'}
      schedules={schedules}
      hasNextPage={hasNextPage}
      fetchNextPage={fetchNextPage}
      isFetchingNextPage={isFetchingNextPage}
    />
  );
};
